import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { salesApi } from "@/api/sales";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { usePDVStore } from "@/store/pdv";
import type { CartItem } from "@/store/pdv";
import type { PaymentMethod } from "@/types/domain";
import { useAuthStore } from "@/store/auth";

function calculateTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discounts = items.reduce(
    (sum, item) => sum + (item.discount ? item.discount * item.quantity : 0),
    0,
  );
  const total = Math.max(subtotal - discounts, 0);
  return { subtotal, discounts, total };
}

export default function Payment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    cartItems,
    payments,
    addPayment,
    clearSale,
    enqueuePendingSale,
    cashStatus,
  } = usePDVStore();
  const user = useAuthStore((s) => s.user);

  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const totals = useMemo(() => calculateTotals(cartItems), [cartItems]);
  const paid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.max(totals.total - paid, 0);

  const handleAddPayment = (event: React.FormEvent) => {
    event.preventDefault();
    const numeric = Number.parseFloat(amount || `${remaining}`);
    if (!Number.isFinite(numeric) || numeric <= 0) return;
    addPayment({ method, amount: numeric, change: Math.max(numeric - remaining, 0) });
    setAmount("");
  };

  const handleFinish = async () => {
    if (remaining > 0) {
      toast({ title: "Pagamento incompleto", description: "Falta valor para fechar", variant: "destructive" });
      return;
    }
    const saleUid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
    setLoading(true);
    try {
      await salesApi.create({
        saleUid,
        items: cartItems.map((item) => ({
          productId: item.code,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: item.discount,
        })),
        total: totals.total,
      });
      enqueuePendingSale({ saleUid, total: totals.total });
      clearSale();
      toast({ title: "Venda enviada", description: "Pagamento registrado. Fiscal sera processado." });
      navigate("/pdv/sell");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pagamento</h2>
        <div className="text-sm text-muted-foreground">
          Caixa: <span className="font-semibold capitalize">{cashStatus}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total a receber</CardTitle>
          <CardDescription>Confirme o pagamento antes de emitir NFC-e.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <Label>Subtotal</Label>
              <div className="text-lg font-semibold">R$ {totals.subtotal.toFixed(2)}</div>
            </div>
            <div className="space-y-1">
              <Label>Descontos</Label>
              <div className="text-lg font-semibold text-orange-600">
                - R$ {totals.discounts.toFixed(2)}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Total</Label>
              <div className="text-2xl font-bold">R$ {totals.total.toFixed(2)}</div>
            </div>
          </div>

          <Separator />

          <form className="grid gap-3 md:grid-cols-4" onSubmit={handleAddPayment}>
            <div className="md:col-span-2">
              <Label>Metodo</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(["cash", "card", "pix"] as PaymentMethod[]).map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={method === option ? "default" : "outline"}
                    onClick={() => setMethod(option)}
                  >
                    {labelForMethod(option)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Valor</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                placeholder={remaining.toFixed(2)}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full" disabled={remaining <= 0}>
                Adicionar pagamento
              </Button>
            </div>
          </form>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Pagamentos</h4>
              <span className="text-sm text-muted-foreground">
                Pago: R$ {paid.toFixed(2)} | Falta: R$ {remaining.toFixed(2)}
              </span>
            </div>
            <div className="rounded-lg border">
              {payments.length === 0 ? (
                <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                  Nenhum pagamento adicionado.
                </div>
              ) : (
                payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between px-4 py-3 border-t first:border-t-0">
                    <div>
                      <div className="font-medium">{labelForMethod(payment.method)}</div>
                      <div className="text-xs text-muted-foreground">Status: {payment.status}</div>
                    </div>
                    <div className="text-right font-semibold">
                      R$ {payment.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="secondary" onClick={() => navigate("/pdv/sell")}>
              Voltar para venda
            </Button>
            <Button onClick={handleFinish} disabled={loading || cartItems.length === 0}>
              {loading ? "Enviando..." : "Finalizar e emitir"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comprovante / DANFCE (preview)</CardTitle>
          <CardDescription>Mock para demonstração</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Operador</span>
            <span className="font-medium">{user?.name || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-semibold">R$ {totals.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pago</span>
            <span className="font-semibold">R$ {paid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Troco</span>
            <span className="font-semibold">
              R$ {Math.max(paid - totals.total, 0).toFixed(2)}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Itens</p>
            {cartItems.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span>
                  {i.name} x{i.quantity}
                </span>
                <span>R$ {(i.price * i.quantity - (i.discount ?? 0) * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              Salvar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function labelForMethod(method: PaymentMethod) {
  if (method === "cash") return "Dinheiro";
  if (method === "card") return "Cartao";
  return "Pix";
}
