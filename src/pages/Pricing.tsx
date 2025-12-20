import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import type { Product } from "@/types/domain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

type SpendItem = { id: string; descricao: string; tipo: "percent" | "valor"; valor: number };

export default function Pricing() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: products = [] } = useQuery<Product[]>({ queryKey: ["products"], queryFn: productsApi.list });

  const [productId, setProductId] = useState<string | undefined>();
  const [custoBase, setCustoBase] = useState("");
  const [dv, setDv] = useState("12");
  const [df, setDf] = useState("3");
  const [ml, setMl] = useState("15");
  const [arredondamento, setArredondamento] = useState("0.01");
  const [manterMargem, setManterMargem] = useState(true);
  const [manterPrecoMaior, setManterPrecoMaior] = useState(false);
  const [gastos, setGastos] = useState<SpendItem[]>([]);

  const selectedProduct = products.find((p) => p.id === productId);

  const totals = useMemo(() => {
    const custo = Number.parseFloat(custoBase || `${selectedProduct?.cost ?? 0}`) || 0;
    const dvNum = Number.parseFloat(dv || "0");
    const dfNum = Number.parseFloat(df || "0");
    const mlNum = Number.parseFloat(ml || "0");
    const variaveisExtras = gastos
      .filter((g) => g.tipo === "percent")
      .reduce((sum, g) => sum + (Number.isFinite(g.valor) ? g.valor : 0), 0);

    const dvTotal = dvNum + variaveisExtras;
    const carga = dvTotal + dfNum + mlNum;
    if (carga >= 100) {
      return { erro: "DV+DF+ML ultrapassam 100%. Revise as taxas.", markup: 0, preco: 0, margemEfetiva: 0 };
    }
    const markup = 100 / (100 - carga);
    const sugeridoBruto = custo * markup;
    const arred = Number.parseFloat(arredondamento || "0.01") || 0.01;
    const preco = Math.round(sugeridoBruto / arred) * arred;
    const precoAtual = selectedProduct?.price ?? 0;
    const diferenca = preco - precoAtual;
    const margemEfetiva = preco > 0 ? ((preco - custo) / preco) * 100 : 0;
    return { markup, preco, precoAtual, diferenca, margemEfetiva, carga, erro: "" };
  }, [custoBase, dv, df, ml, gastos, arredondamento, selectedProduct]);

  const handleAddGasto = () => {
    setGastos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10),
        descricao: "",
        tipo: "percent",
        valor: 0,
      },
    ]);
  };

  const handleUpdateGasto = (id: string, patch: Partial<SpendItem>) => {
    setGastos((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  };

  const handleRemoveGasto = (id: string) => {
    setGastos((prev) => prev.filter((g) => g.id !== id));
  };

  const applyPrice = async () => {
    if (!productId || totals.erro) return;
    await productsApi.update(productId, {
      price: totals.preco,
      pricing: { dv: Number(dv), df: Number(df), ml: Number(ml), lastSuggestedPrice: totals.preco },
      cost: Number(custoBase || selectedProduct?.cost || 0),
    });
    toast({ title: "Preco aplicado", description: "Stub: ajuste persistido no produto." });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const savePreset = () => {
    const preset = { dv, df, ml, arredondamento, manterMargem, manterPrecoMaior };
    localStorage.setItem("pricing-preset", JSON.stringify(preset));
    toast({ title: "Regra salva", description: "Preset guardado no browser (stub)." });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Precificacao</h2>
          <p className="text-sm text-muted-foreground">Simule e aplique precos via markup.</p>
        </div>
      </div>

      <Tabs defaultValue="simulador">
        <TabsList>
          <TabsTrigger value="simulador">Simulador</TabsTrigger>
          <TabsTrigger value="lote">Atualizacao em lote</TabsTrigger>
        </TabsList>

        <TabsContent value="simulador" className="space-y-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros</CardTitle>
              <CardDescription>Markup = 100 / (100 - (DV + DF + ML))</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Produto</Label>
                  <Select value={productId} onValueChange={setProductId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} {p.sku ? `(${p.sku})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custo">Custo base (R$)</Label>
                  <Input
                    id="custo"
                    type="number"
                    step="0.01"
                    value={custoBase}
                    placeholder={selectedProduct?.cost ? selectedProduct.cost.toString() : "0,00"}
                    onChange={(e) => setCustoBase(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <InputPercent label="Despesas variaveis (DV %)" value={dv} onChange={setDv} />
                <InputPercent label="Despesas fixas (DF %)" value={df} onChange={setDf} />
                <InputPercent label="Margem lucro (ML %)" value={ml} onChange={setMl} />
                <div className="space-y-2">
                  <Label>Arredondamento</Label>
                  <Select value={arredondamento} onValueChange={setArredondamento}>
                    <SelectTrigger>
                      <SelectValue placeholder="0,01" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.01">0,01</SelectItem>
                      <SelectItem value="0.05">0,05</SelectItem>
                      <SelectItem value="0.1">0,10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gastos relacionados</Label>
                <div className="space-y-2">
                  {gastos.map((g) => (
                    <div key={g.id} className="grid gap-2 md:grid-cols-4 items-center">
                      <Input
                        placeholder="Descricao"
                        value={g.descricao}
                        onChange={(e) => handleUpdateGasto(g.id, { descricao: e.target.value })}
                      />
                      <Select
                        value={g.tipo}
                        onValueChange={(v) => handleUpdateGasto(g.id, { tipo: v as SpendItem["tipo"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percent">%</SelectItem>
                          <SelectItem value="valor">R$</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        step="0.01"
                        value={g.valor}
                        onChange={(e) =>
                          handleUpdateGasto(g.id, { valor: Number.parseFloat(e.target.value || "0") })
                        }
                      />
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveGasto(g.id)}>
                        Remover
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddGasto}>
                    Adicionar gasto
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={manterMargem}
                    onChange={(e) => setManterMargem(e.target.checked)}
                  />
                  Manter margem ao recalcular (RAD default)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={manterPrecoMaior}
                    onChange={(e) => setManterPrecoMaior(e.target.checked)}
                  />
                  Manter preco maior ao recalcular (RAD default = off)
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Transparência do cálculo</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-4">
              <Output label="Markup" value={totals.markup} suffix="x" erro={totals.erro} />
              <Output label="Preco sugerido" value={totals.preco} prefix="R$" />
              <Output label="Margem efetiva" value={totals.margemEfetiva} suffix="%" />
              <Output label="Diferença vs atual" value={totals.diferenca} prefix="R$" />
            </CardContent>
            <Separator />
            <div className="p-4 flex flex-wrap gap-2 justify-end">
              <Button variant="outline" onClick={savePreset}>
                Salvar como regra de precificação
              </Button>
              <Button onClick={applyPrice} disabled={!productId || Boolean(totals.erro)}>
                Aplicar preço no produto
              </Button>
            </div>
            {totals.erro && <p className="px-4 pb-4 text-sm text-destructive">{totals.erro}</p>}
          </Card>
        </TabsContent>

        <TabsContent value="lote" className="space-y-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle>Atualização em lote</CardTitle>
              <CardDescription>Stub: calcula sugerido e destaca diferença.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-7 text-xs font-medium text-muted-foreground">
                <span>SKU</span>
                <span className="col-span-2">Produto</span>
                <span>Atual</span>
                <span>Sugerido</span>
                <span>Diferença</span>
                <span>Status</span>
              </div>
              {products.map((p) => {
                const sugerido = p.pricing?.lastSuggestedPrice ?? p.price;
                const diff = sugerido - p.price;
                return (
                  <div key={p.id} className="grid grid-cols-7 items-center text-sm border rounded-md px-2 py-2">
                    <span className="text-xs text-muted-foreground">{p.sku || "—"}</span>
                    <span className="col-span-2 truncate">{p.name}</span>
                    <span>R$ {p.price.toFixed(2)}</span>
                    <span>R$ {sugerido.toFixed(2)}</span>
                    <span className={diff > 0 ? "text-green-600" : diff < 0 ? "text-orange-600" : ""}>
                      {diff.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {diff === 0 ? "Aplicado" : "Calculado"}
                    </span>
                  </div>
                );
              })}
              <div className="flex gap-2 justify-end">
                <Button variant="outline">Exportar CSV</Button>
                <Button>Aplicar preço sugerido</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InputPercent({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="number"
        step="0.1"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Output({
  label,
  value,
  prefix,
  suffix,
  erro,
}: {
  label: string;
  value?: number;
  prefix?: string;
  suffix?: string;
  erro?: string;
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      {erro ? (
        <p className="text-sm text-destructive mt-1">{erro}</p>
      ) : (
        <p className="text-lg font-semibold">
          {prefix}
          {Number.isFinite(value) ? value?.toFixed(2) : "-"}
          {suffix}
        </p>
      )}
    </div>
  );
}
