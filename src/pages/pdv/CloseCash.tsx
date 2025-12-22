import { useMemo, useState } from "react";
import { cashApi } from "@/api/cash";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { usePDVStore } from "@/store/pdv";
import { useAuthStore } from "@/store/auth";

export default function CloseCash() {
  const { toast } = useToast();
  const { cashStatus, cashOpeningAmount, payments, pendingSales, closeCash } = usePDVStore();
  const user = useAuthStore((s) => s.user);
  const [cashCount, setCashCount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const totals = useMemo(() => {
    const received = payments.reduce((sum, p) => sum + p.amount, 0);
    const pending = pendingSales.filter((s) => s.status === "pending").length;
    const byMethod = payments.reduce<Record<string, number>>((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + p.amount;
      return acc;
    }, {});
    return { received, pending };
  }, [payments, pendingSales]);

  const handleClose = async (event: React.FormEvent) => {
    event.preventDefault();
    const numeric = Number.parseFloat(cashCount || "0");
    setLoading(true);
    try {
      await cashApi.close({ cashCount: numeric, notes });
      closeCash();
      toast({ title: "Caixa fechado", description: "Resumo salvo (stub)." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-[1fr,360px]">
      <Card>
        <CardHeader>
          <CardTitle>Fechamento de caixa</CardTitle>
          <CardDescription>Conte fisicamente e registre para conciliar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleClose}>
            <div className="space-y-2">
              <Label htmlFor="cashCount">Total contado (R$)</Label>
              <Input
                id="cashCount"
                type="number"
                step="0.01"
                min="0"
                value={cashCount}
                onChange={(e) => setCashCount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Observacoes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observacoes, quebras, sangria"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || cashStatus !== "open"}>
              {cashStatus !== "open" ? "Abra o caixa antes" : loading ? "Fechando..." : "Fechar caixa"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
          <CardDescription>Status antes do fechamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Status do caixa</span>
            <span className="font-semibold capitalize">{cashStatus}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Valor inicial</span>
            <span className="font-semibold">R$ {cashOpeningAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Operador</span>
            <span className="font-semibold">{user?.name || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Recebido (pagamentos)</span>
            <span className="font-semibold">R$ {totals.received.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Vendas pendentes</span>
            <span className="font-semibold">{totals.pending}</span>
          </div>
          <Separator />
          <div className="space-y-1 text-sm">
            <p className="font-semibold">Por meio de pagamento</p>
            {Object.entries(
              payments.reduce<Record<string, number>>((acc, p) => {
                acc[p.method] = (acc[p.method] || 0) + p.amount;
                return acc;
              }, {}),
            ).map(([method, total]) => (
              <div key={method} className="flex justify-between">
                <span className="text-muted-foreground capitalize">{method}</span>
                <span className="font-semibold">R$ {total.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Concilie valores e finalize para enviar a confrencia ao financeiro.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Imprimir fechamento
            </Button>
            <Button variant="outline" size="sm">
              Registrar sangria/suprimento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
