import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyBRL } from "@/lib/format";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function RelatoriosPage() {
  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: api.orders.list });
  const loading = ordersQuery.isLoading;
  const orders = ordersQuery.data ?? [];

  const revenueByProduct = new Map<string, { nome: string; receita: number; qtd: number }>();
  for (const order of orders) {
    for (const item of order.itens) {
      const current = revenueByProduct.get(item.productId) ?? {
        nome: item.nome,
        receita: 0,
        qtd: 0,
      };
      current.receita += item.precoUnitario * item.quantidade;
      current.qtd += item.quantidade;
      revenueByProduct.set(item.productId, current);
    }
  }

  const top = Array.from(revenueByProduct.values())
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">Visão consolidada (mock)</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receita por produto</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="nome" type="category" className="text-xs" width={150} />
                  <Tooltip
                    formatter={(v) => formatCurrencyBRL(Number(v))}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "10px",
                    }}
                  />
                  <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total de pedidos</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Receita total</span>
                  <span className="font-medium">
                    {formatCurrencyBRL(
                      orders.reduce((sum, o) => sum + o.total, 0),
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ticket médio</span>
                  <span className="font-medium">
                    {formatCurrencyBRL(
                      orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0,
                    )}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
