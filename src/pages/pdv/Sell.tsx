import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { usePDVStore } from "@/store/pdv";
import type { CartItem } from "@/store/pdv";

function calculateTotals(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discounts = items.reduce(
    (sum, item) => sum + (item.discount ? item.discount * item.quantity : 0),
    0,
  );
  const total = Math.max(subtotal - discounts, 0);
  return { subtotal, discounts, total };
}

export default function Sell() {
  const { toast } = useToast();
  const {
    cartItems,
    cashStatus,
    addItem,
    removeItem,
    updateQuantity,
    applyDiscount,
    setCustomer,
    selectedCustomer,
    offline,
  } = usePDVStore();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [quantity, setQuantity] = useState("1");
  const [customerName, setCustomerName] = useState(selectedCustomer?.name ?? "");
  const [customerDoc, setCustomerDoc] = useState(selectedCustomer?.document ?? "");

  const totals = useMemo(() => calculateTotals(cartItems), [cartItems]);

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!code && !name) return;
    const qty = Number.parseFloat(quantity || "1");
    const unitPrice = Number.parseFloat(price || "0");
    addItem({
      code: code || name,
      name: name || code,
      price: Number.isFinite(unitPrice) ? unitPrice : 0,
      quantity: Number.isFinite(qty) ? Math.max(qty, 1) : 1,
    });
    setCode("");
    setName("");
    setPrice("0");
    setQuantity("1");
  };

  const handleSelectCustomer = () => {
    if (!customerName) {
      setCustomer(undefined);
      return;
    }
    setCustomer({
      id: customerDoc || customerName,
      name: customerName,
      document: customerDoc,
    });
    toast({ title: "Cliente vinculado", description: customerName });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={cashStatus === "open" ? "default" : "destructive"}>
            Caixa {cashStatus === "open" ? "aberto" : "fechado"}
          </Badge>
          {offline && <Badge variant="outline">Offline - fila ativa</Badge>}
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/pdv/open">Abrir caixa</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/pdv/payment">Ir para pagamento</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Venda em andamento</CardTitle>
          <CardDescription>Escaneie o codigo ou digite manualmente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-3 md:grid-cols-5" onSubmit={handleAdd}>
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="code">Codigo ou SKU</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Escaneie ou digite"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do item"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="price">Preco (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="qty">Qtde</Label>
              <Input
                id="qty"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Adicionar item
              </Button>
            </div>
          </form>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Itens</h3>
              <span className="text-sm text-muted-foreground">
                {cartItems.length} item(s)
              </span>
            </div>
            <div className="rounded-lg border">
              <div className="grid grid-cols-12 px-4 py-2 text-xs font-medium text-muted-foreground">
                <span className="col-span-4">Item</span>
                <span className="col-span-2 text-right">Qtde</span>
                <span className="col-span-2 text-right">Preco</span>
                <span className="col-span-2 text-right">Desc</span>
                <span className="col-span-2 text-right">Subtotal</span>
              </div>
              {cartItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                  Nenhum item. Escaneie um produto para comecar.
                </div>
              ) : (
                cartItems.map((item) => {
                  const subtotal = item.price * item.quantity - (item.discount ?? 0) * item.quantity;
                  return (
                    <div key={item.id} className="grid grid-cols-12 px-4 py-3 border-t text-sm items-center">
                      <div className="col-span-4">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.code}</div>
                      </div>
                      <div className="col-span-2 text-right">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                          className="h-9 text-right"
                        />
                      </div>
                      <div className="col-span-2 text-right">R$ {item.price.toFixed(2)}</div>
                      <div className="col-span-2 text-right">
                        <Input
                          type="number"
                          min="0"
                          value={item.discount ?? 0}
                          onChange={(e) => applyDiscount(item.id, Number(e.target.value))}
                          className="h-9 text-right"
                        />
                      </div>
                      <div className="col-span-2 text-right font-semibold">
                        R$ {Math.max(subtotal, 0).toFixed(2)}
                      </div>
                      <div className="col-span-12 mt-2 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <Separator />

          <div className="grid gap-3 md:grid-cols-2">
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Descontos</span>
                  <span>- R$ {totals.discounts.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>R$ {totals.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 space-y-3">
                <h4 className="font-semibold">Cliente</h4>
                <div className="grid gap-2">
                  <Input
                    placeholder="Nome do cliente"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <Input
                    placeholder="CPF/CNPJ"
                    value={customerDoc}
                    onChange={(e) => setCustomerDoc(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setCustomerName(""); setCustomerDoc(""); setCustomer(undefined); }}>
                      Limpar
                    </Button>
                    <Button onClick={handleSelectCustomer}>Selecionar</Button>
                  </div>
                  {selectedCustomer && (
                    <p className="text-sm text-muted-foreground">
                      Vinculado: {selectedCustomer.name} {selectedCustomer.document ? `(${selectedCustomer.document})` : ""}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3 justify-between">
            <Button variant="outline" onClick={() => removeAllWithConfirm(removeItem, cartItems)}>
              Limpar itens
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" asChild>
                <Link to="/pdv/close">Fechar caixa</Link>
              </Button>
              <Button asChild disabled={cartItems.length === 0 || cashStatus !== "open"}>
                <Link to="/pdv/payment">Ir para pagamento</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function removeAllWithConfirm(
  removeItem: (id: string) => void,
  items: CartItem[],
) {
  if (!items.length) return;
  const confirmed = window.confirm("Remover todos os itens do carrinho?");
  if (confirmed) {
    items.forEach((item) => removeItem(item.id));
  }
}
