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
import { useAuthStore } from "@/store/auth";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import { customersApi } from "@/api/customers";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    discountRequests,
    requestDiscount,
    approveDiscount,
    setCustomer,
    selectedCustomer,
    offline,
  } = usePDVStore();
  const authUser = useAuthStore((s) => s.user);
  const canApproveDiscount = useAuthStore((s) => s.hasPermission("DISCOUNT_APPROVE"));
  const { data: products = [] } = useQuery(["products"], productsApi.list);
  const { data: customers = [] } = useQuery(["customers"], customersApi.list);
  const [productSearch, setProductSearch] = useState("");
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false);

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
    const match = products.find(
      (p) => p.sku === code || p.name.toLowerCase() === name.toLowerCase() || p.sku === name,
    );
    addItem({
      code: match?.sku || code || name,
      name: match?.name || name || code,
      price: match?.price ?? (Number.isFinite(unitPrice) ? unitPrice : 0),
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

  const handleRequestDiscount = (itemId: string) => {
    const percentStr = window.prompt("Percentual de desconto solicitado (%)", "5");
    if (!percentStr) return;
    const percent = Number.parseFloat(percentStr);
    if (!Number.isFinite(percent) || percent <= 0) {
      toast({ title: "Valor invalido", variant: "destructive" });
      return;
    }
    requestDiscount({
      itemId,
      percent,
      requestedBy: authUser?.name || "operador",
    });
    toast({ title: "Solicitacao enviada", description: "Aguardando aprovacao do gerente." });
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
              <Label htmlFor="code">Codigo ou SKU (F2 para focar)</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Escaneie ou digite"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdd(e);
                  }
                }}
              />
              <div className="text-xs text-muted-foreground">
                Sugestoes:
                <ScrollArea className="h-24 rounded border mt-1">
                  <div className="p-2 space-y-1">
                    {products
                      .filter(
                        (p) =>
                          !productSearch ||
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          (p.sku ?? "").includes(productSearch),
                      )
                      .slice(0, 5)
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="w-full text-left text-xs hover:underline"
                          onClick={() => {
                            setCode(p.sku ?? "");
                            setName(p.name);
                            setPrice(String(p.price));
                          }}
                        >
                          {p.name} ({p.sku}) - R$ {p.price.toFixed(2)}
                        </button>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setProductSearch(e.target.value);
                }}
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
                      <div className="col-span-2 text-right space-y-1">
                        <Input
                          type="number"
                          min="0"
                          value={item.discount ?? 0}
                          onChange={(e) => applyDiscount(item.id, Number(e.target.value))}
                          className="h-9 text-right"
                          disabled={!canApproveDiscount}
                        />
                        {!canApproveDiscount && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequestDiscount(item.id)}
                            className="w-full"
                          >
                            Solicitar desconto
                          </Button>
                        )}
                        {canApproveDiscount &&
                          discountRequests
                            .filter((req) => req.itemId === item.id && req.status === "pending")
                            .map((req) => (
                              <div key={req.id} className="flex items-center justify-between gap-2 text-xs">
                                <span>Pendente {req.percent}%</span>
                                <div className="flex gap-1">
                                  <Button size="sm" variant="outline" onClick={() => approveDiscount(req.id)}>
                                    Aprovar
                                  </Button>
                                </div>
                              </div>
                            ))}
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
                  <Button variant="outline" onClick={() => setCustomerSearchOpen(true)}>
                    Selecionar cliente
                  </Button>
                  {selectedCustomer ? (
                    <p className="text-sm text-muted-foreground">
                      Vinculado: {selectedCustomer.name} {selectedCustomer.document ? `(${selectedCustomer.document})` : ""}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum cliente selecionado</p>
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

      {customerSearchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Selecionar cliente</h3>
              <Button variant="ghost" size="sm" onClick={() => setCustomerSearchOpen(false)}>
                Fechar
              </Button>
            </div>
            <Input
              placeholder="Buscar nome ou documento"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <ScrollArea className="h-64 border rounded-md">
              <div className="p-2 space-y-2">
                {customers
                  .filter((c) => {
                    const term = customerName.toLowerCase();
                    return (
                      c.name.toLowerCase().includes(term) ||
                      (c.document ? c.document.includes(customerName) : false)
                    );
                  })
                  .map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between px-2 py-2 rounded hover:bg-muted cursor-pointer"
                      onClick={() => {
                        setCustomer(c);
                        setCustomerSearchOpen(false);
                        toast({ title: "Cliente vinculado", description: c.name });
                      }}
                    >
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.document || "Sem doc"}</div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {c.phone1 || c.phone2 || c.email || ""}
                      </span>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
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
