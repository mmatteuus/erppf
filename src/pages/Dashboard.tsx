import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Package,
  Truck,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock chart data
const salesData = [
  { day: 'Seg', vendas: 1200, pedidos: 8 },
  { day: 'Ter', vendas: 1800, pedidos: 12 },
  { day: 'Qua', vendas: 1400, pedidos: 9 },
  { day: 'Qui', vendas: 2200, pedidos: 15 },
  { day: 'Sex', vendas: 2800, pedidos: 18 },
  { day: 'Sáb', vendas: 3200, pedidos: 22 },
  { day: 'Dom', vendas: 1600, pedidos: 10 },
];

const statusData = [
  { name: 'Novos', value: 5, color: 'hsl(199, 89%, 48%)' },
  { name: 'Produção', value: 8, color: 'hsl(38, 92%, 50%)' },
  { name: 'Prontos', value: 3, color: 'hsl(142, 76%, 36%)' },
  { name: 'Em Rota', value: 4, color: 'hsl(262, 83%, 58%)' },
];

const topProducts = [
  { name: 'Buquê de Rosas', vendas: 45, receita: 6745.50 },
  { name: 'Cesta Café da Manhã', vendas: 32, receita: 8316.80 },
  { name: 'Orquídea Phalaenopsis', vendas: 28, receita: 3637.20 },
  { name: 'Arranjo Tropical', vendas: 22, receita: 4177.80 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { salesOrders, products, inventoryItems } = useERPStore();

  // Calculate KPIs
  const totalRevenue = salesOrders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);
  
  const totalOrders = salesOrders.length;
  const pendingOrders = salesOrders.filter((o) => ['new', 'separation', 'production'].includes(o.status)).length;
  const inRouteOrders = salesOrders.filter((o) => o.status === 'in_route').length;
  
  const lowStockItems = inventoryItems.filter((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product && item.quantity < product.minStock;
  });

  const expiringItems = inventoryItems.filter((item) => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>
        <Button onClick={() => navigate('/sales/orders/new')} className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita (Mês)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12.5% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pedidos Hoje
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex items-center gap-2 text-xs mt-1">
              <Badge variant="secondary" className="text-xs">
                {pendingOrders} pendentes
              </Badge>
              <Badge variant="outline" className="badge-info text-xs">
                {inRouteOrders} em rota
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Margem Média
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+2.1% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entregas no Prazo
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <div className="flex items-center gap-1 text-xs text-destructive mt-1">
              <ArrowDownRight className="h-3 w-3" />
              <span>-1.3% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {lowStockItems.length > 0 && (
            <Card className="border-warning/50 bg-warning/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <CardTitle className="text-sm font-medium">Estoque Crítico</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {lowStockItems.length} {lowStockItems.length === 1 ? 'item' : 'itens'} abaixo do estoque mínimo
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate('/inventory/overview')}>
                  Ver Estoque
                </Button>
              </CardContent>
            </Card>
          )}
          
          {expiringItems.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-destructive" />
                  <CardTitle className="text-sm font-medium">Produtos Vencendo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {expiringItems.length} {expiringItems.length === 1 ? 'lote' : 'lotes'} vencem nos próximos 3 dias
                </p>
                <Button variant="outline" size="sm" onClick={() => navigate('/inventory/batches')}>
                  Ver Lotes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vendas da Semana</CardTitle>
            <CardDescription>Receita e pedidos por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                      'Vendas',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="vendas"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVendas)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Status</CardTitle>
            <CardDescription>Distribuição atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" className="text-xs" width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>Últimas atualizações</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/sales/orders')}>
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => navigate(`/sales/orders/${order.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        order.status === 'delivered'
                          ? 'badge-success'
                          : order.status === 'in_route'
                          ? 'badge-info'
                          : order.status === 'production'
                          ? 'badge-warning'
                          : ''
                      }
                    >
                      {order.status === 'new' && 'Novo'}
                      {order.status === 'separation' && 'Separação'}
                      {order.status === 'production' && 'Produção'}
                      {order.status === 'ready' && 'Pronto'}
                      {order.status === 'in_route' && 'Em Rota'}
                      {order.status === 'delivered' && 'Entregue'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
