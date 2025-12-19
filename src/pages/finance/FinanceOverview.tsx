import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useERPStore } from '@/store/mockData';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Mock cashflow data
const cashflowData = [
  { day: 'Seg', receitas: 2500, despesas: 800 },
  { day: 'Ter', receitas: 3200, despesas: 1200 },
  { day: 'Qua', receitas: 2800, despesas: 950 },
  { day: 'Qui', receitas: 4100, despesas: 1800 },
  { day: 'Sex', receitas: 5200, despesas: 2100 },
  { day: 'Sáb', receitas: 6500, despesas: 1500 },
  { day: 'Dom', receitas: 3100, despesas: 600 },
];

export default function FinanceOverview() {
  const { invoices, salesOrders } = useERPStore();

  // Calculate metrics
  const receivables = invoices.filter((i) => i.type === 'receivable');
  const payables = invoices.filter((i) => i.type === 'payable');

  const totalReceivable = receivables.reduce((sum, i) => sum + i.amount, 0);
  const totalPayable = payables.reduce((sum, i) => sum + i.amount, 0);
  
  const pendingReceivables = receivables.filter((i) => i.status === 'pending');
  const overdueReceivables = receivables.filter((i) => {
    if (i.status === 'paid') return false;
    return new Date(i.dueDate) < new Date();
  });

  const pendingPayables = payables.filter((i) => i.status === 'pending');
  const overduePayables = payables.filter((i) => {
    if (i.status === 'paid') return false;
    return new Date(i.dueDate) < new Date();
  });

  const totalRevenue = salesOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">Visão geral de receitas e despesas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Exportar Relatório</Button>
          <Button>Novo Lançamento</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita (Mês)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+18.2% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              A Receber
            </CardTitle>
            <CreditCard className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalReceivable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {pendingReceivables.length} pendentes
              </Badge>
              {overdueReceivables.length > 0 && (
                <Badge variant="outline" className="badge-danger text-xs">
                  {overdueReceivables.length} atrasados
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              A Pagar
            </CardTitle>
            <Wallet className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {pendingPayables.length} pendentes
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Projetado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {(totalReceivable - totalPayable).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Próximos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cashflow Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
            <CardDescription>Receitas vs Despesas por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [
                      `R$ ${value.toLocaleString('pt-BR')}`,
                    ]}
                  />
                  <Bar dataKey="receitas" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Receitas" />
                  <Bar dataKey="despesas" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Receivables */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contas a Receber</CardTitle>
                <CardDescription>Próximos recebimentos</CardDescription>
              </div>
              <Button variant="ghost" size="sm">Ver todos</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {receivables.slice(0, 4).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium text-sm">{invoice.entityName}</p>
                  <p className="text-xs text-muted-foreground">
                    Vence: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      invoice.status === 'paid'
                        ? 'badge-success'
                        : invoice.status === 'overdue'
                        ? 'badge-danger'
                        : ''
                    }
                  >
                    {invoice.status === 'paid' ? 'Pago' : invoice.status === 'overdue' ? 'Atrasado' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payables */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contas a Pagar</CardTitle>
                <CardDescription>Próximos pagamentos</CardDescription>
              </div>
              <Button variant="ghost" size="sm">Ver todos</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {payables.slice(0, 4).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium text-sm">{invoice.entityName}</p>
                  <p className="text-xs text-muted-foreground">
                    Vence: {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    R$ {invoice.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      invoice.status === 'paid'
                        ? 'badge-success'
                        : invoice.status === 'overdue'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }
                  >
                    {invoice.status === 'paid' ? 'Pago' : invoice.status === 'overdue' ? 'Atrasado' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
