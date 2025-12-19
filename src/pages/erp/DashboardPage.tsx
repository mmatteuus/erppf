import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrencyBRL } from "@/lib/format";
import { api } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign, Package, ShoppingCart, Truck, TrendingUp } from "lucide-react";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DashboardPage() {
  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: api.orders.list });
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: api.products.list });
  const stockQuery = useQuery({ queryKey: ["stockBalances"], queryFn: api.stock.listBalances });

  const loading = ordersQuery.isLoading || productsQuery.isLoading || stockQuery.isLoading;
  const orders = ordersQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const balances = stockQuery.data ?? [];

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const delivered = orders.filter((o) => o.status === "entregue");
  const deliveredToday = delivered.filter((o) => isSameDay(new Date(o.entregaEm), now));
  const deliveredMonth = delivered.filter((o) => new Date(o.entregaEm) >= monthStart);

  const faturamentoDia = deliveredToday.reduce((sum, o) => sum + o.total, 0);
  const faturamentoMes = deliveredMonth.reduce((sum, o) => sum + o.total, 0);

  const pedidosEmAberto = orders.filter(
    (o) => !["entregue", "cancelado"].includes(o.status),
  ).length;

  const entregasHoje = orders.filter((o) => isSameDay(new Date(o.entregaEm), now)).length;

  const ticketMedio =
    deliveredMonth.length > 0 ? faturamentoMes / deliveredMonth.length : 0;

  const lowStock = balances.filter((b) => {
    const product = products.find((p) => p.id === b.productId);
    if (!product) return false;
    return b.saldo < product.estoqueMinimo;
  });

  const chartData = Array.from({ length: 7 }).map((_, idx) => {
    const day = new Date(startOfDay(now));
    day.setDate(day.getDate() - (6 - idx));
    const total = delivered
      .filter((o) => isSameDay(new Date(o.entregaEm), day))
      .reduce((sum, o) => sum + o.total, 0);
    return {
      dia: day.toLocaleDateString("pt-BR", { weekday: "short" }),
      faturamento: total,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">KPIs para demo/venda</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Faturamento (dia)"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          value={loading ? null : formatCurrencyBRL(faturamentoDia)}
        />
        <KpiCard
          title="Faturamento (mês)"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          value={loading ? null : formatCurrencyBRL(faturamentoMes)}
        />
        <KpiCard
          title="Pedidos em aberto"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          value={loading ? null : String(pedidosEmAberto)}
        />
        <KpiCard
          title="Estoque baixo"
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          value={loading ? null : String(lowStock.length)}
        />
        <KpiCard
          title="Entregas hoje"
          icon={<Truck className="h-4 w-4 text-muted-foreground" />}
          value={loading ? null : String(entregasHoje)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Faturamento (7 dias)</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="dia" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    formatter={(v) => formatCurrencyBRL(Number(v))}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "10px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="faturamento"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.25)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ticket médio</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-40" />
            ) : (
              <div className="text-3xl font-bold">
                {formatCurrencyBRL(ticketMedio)}
              </div>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              Baseado em pedidos entregues no mês
            </p>
            <div className="mt-6 space-y-2">
              <div className="text-sm font-medium">Itens com estoque baixo</div>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : lowStock.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Nenhum item em alerta.
                </div>
              ) : (
                <div className="space-y-2">
                  {lowStock.slice(0, 5).map((b) => (
                    <div key={b.productId} className="flex items-center justify-between text-sm">
                      <span className="truncate">{b.produto}</span>
                      <span className="text-muted-foreground whitespace-nowrap">
                        {b.saldo} un.
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | null;
  icon: ReactNode;
}) {
  return (
    <Card className="kpi-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
