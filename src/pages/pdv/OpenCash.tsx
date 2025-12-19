import { useState } from "react";
import { cashApi } from "@/api/cash";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { usePDVStore } from "@/store/pdv";

export default function OpenCash() {
  const { toast } = useToast();
  const { cashStatus, cashOpeningAmount, openCash, cashOpenedAt } = usePDVStore();
  const [amount, setAmount] = useState(cashOpeningAmount ? cashOpeningAmount.toString() : "");
  const [loading, setLoading] = useState(false);

  const handleOpen = async (event: React.FormEvent) => {
    event.preventDefault();
    const numeric = Number.parseFloat(amount || "0");
    if (Number.isNaN(numeric)) return;
    setLoading(true);
    try {
      await cashApi.open({ openingAmount: numeric, operator: "operador" });
      openCash(numeric);
      toast({ title: "Caixa aberto", description: `Valor inicial R$ ${numeric.toFixed(2)}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-[1fr,340px]">
      <Card>
        <CardHeader>
          <CardTitle>Abrir caixa</CardTitle>
          <CardDescription>Defina o valor inicial do caixa fisico.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleOpen}>
            <div className="space-y-2">
              <Label htmlFor="opening">Valor inicial (R$)</Label>
              <Input
                id="opening"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading || cashStatus === "open"} className="w-full">
              {cashStatus === "open" ? "Caixa ja aberto" : loading ? "Abrindo..." : "Abrir caixa"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Situacao atual do PDV</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Caixa</span>
            <span className="font-semibold capitalize">{cashStatus}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Valor inicial</span>
            <span className="font-semibold">
              R$ {cashOpeningAmount ? cashOpeningAmount.toFixed(2) : "0,00"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Aberto em</span>
            <span className="text-sm text-muted-foreground">
              {cashOpenedAt ? new Date(cashOpenedAt).toLocaleString() : "—"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
