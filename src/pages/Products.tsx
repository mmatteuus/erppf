import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import type { Product } from "@/types/domain";
import { useAuthStore } from "@/store/auth";
import { Link } from "react-router-dom";

export default function Products() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: products = [], isFetching } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: productsApi.list,
  });
  const hasCatalogEdit = useAuthStore((s) => s.hasPermission("CATALOG_EDIT"));
  const hasPricing = useAuthStore((s) => s.hasPermission("PRICING_TOOL"));

  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [cost, setCost] = useState("");

  const filtered = products.filter((product) => {
    const term = filter.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      (product.sku ? product.sku.toLowerCase().includes(term) : false)
    );
  });

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const numericPrice = Number.parseFloat(price || "0");
    const numericStock = Number.parseFloat(stock || "0");
    const numericCost = Number.parseFloat(cost || "0");
    await productsApi.create({
      name,
      sku,
      price: Number.isFinite(numericPrice) ? numericPrice : 0,
      stock: Number.isFinite(numericStock) ? numericStock : 0,
      cost: Number.isFinite(numericCost) ? numericCost : undefined,
    });
    toast({ title: "Produto cadastrado (stub)", description: "Conecte ao backend para persistir." });
    setOpen(false);
    setName("");
    setSku("");
    setPrice("");
    setStock("");
    setCost("");
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">Produtos</h2>
          <p className="text-sm text-muted-foreground">Busca e cadastro rapido</p>
        </div>
        <div className="flex gap-2">
          {hasPricing && (
            <Button asChild variant="outline">
              <Link to="/pricing">Abrir precificacao</Link>
            </Button>
          )}
          {hasCatalogEdit && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Novo produto</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar produto</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreate}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU/EAN</Label>
                    <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} />
                  </div>
                  <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="cost">Custo (R$)</Label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Estoque</Label>
                    <Input
                      id="stock"
                      type="number"
                      step="1"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalogo</CardTitle>
          <CardDescription>Filtro por nome ou SKU</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Buscar produtos"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Separator />
          <div className="space-y-2">
            {isFetching && <p className="text-sm text-muted-foreground">Carregando...</p>}
            {filtered.length === 0 && !isFetching ? (
              <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>
            ) : (
              filtered.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between px-2 py-2 border rounded-md"
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.sku || "Sem SKU"} | R$ {product.price.toFixed(2)}
                    </div>
                    {typeof product.cost === "number" && (
                      <div className="text-xs text-muted-foreground">
                        Custo: R$ {product.cost.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {typeof product.stock === "number" ? `${product.stock} un` : "Sem estoque"}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
