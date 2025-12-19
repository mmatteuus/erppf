import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Clock,
  Package,
  TrendingDown,
  ArrowUpRight,
  Search,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useERPStore } from '@/store/mockData';

export default function InventoryOverview() {
  const navigate = useNavigate();
  const { inventoryItems, products } = useERPStore();
  const [search, setSearch] = useState('');

  // Calculate metrics
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const lowStockItems = inventoryItems.filter((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product && item.quantity < product.minStock;
  });

  const expiringItems = inventoryItems.filter((item) => {
    if (!item.expiryDate) return false;
    const expiry = new Date(item.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 5 && diffDays >= 0;
  });

  const expiredItems = inventoryItems.filter((item) => {
    if (!item.expiryDate) return false;
    return new Date(item.expiryDate) < new Date();
  });

  const filteredItems = inventoryItems.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  const getStockLevel = (item: typeof inventoryItems[0]) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return 100;
    return Math.min((item.quantity / (product.minStock * 2)) * 100, 100);
  };

  const getExpiryDays = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visão Geral do Estoque</h1>
          <p className="text-muted-foreground">Monitore níveis, validade e reposição</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/inventory/items')}>
            Ver Todos Itens
          </Button>
          <Button onClick={() => navigate('/purchase/orders')}>
            Solicitar Reposição
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="kpi-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total em Estoque
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems.toLocaleString()} un.</div>
            <div className="flex items-center gap-1 text-xs text-success mt-1">
              <ArrowUpRight className="h-3 w-3" />
              <span>+5% vs semana anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`kpi-card ${lowStockItems.length > 0 ? 'border-warning' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estoque Crítico
            </CardTitle>
            <AlertTriangle className={`h-4 w-4 ${lowStockItems.length > 0 ? 'text-warning' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-warning' : ''}`}>
              {lowStockItems.length} itens
            </div>
            <p className="text-xs text-muted-foreground mt-1">Abaixo do mínimo</p>
          </CardContent>
        </Card>

        <Card className={`kpi-card ${expiringItems.length > 0 ? 'border-warning' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Próximo ao Vencimento
            </CardTitle>
            <Clock className={`h-4 w-4 ${expiringItems.length > 0 ? 'text-warning' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${expiringItems.length > 0 ? 'text-warning' : ''}`}>
              {expiringItems.length} lotes
            </div>
            <p className="text-xs text-muted-foreground mt-1">Vencem em até 5 dias</p>
          </CardContent>
        </Card>

        <Card className={`kpi-card ${expiredItems.length > 0 ? 'border-destructive' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Perdas (Mês)
            </CardTitle>
            <TrendingDown className={`h-4 w-4 ${expiredItems.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${expiredItems.length > 0 ? 'text-destructive' : ''}`}>
              {expiredItems.length} lotes
            </div>
            <p className="text-xs text-muted-foreground mt-1">Vencidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          {lowStockItems.length > 0 && (
            <Card className="border-warning/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <CardTitle className="text-base">Estoque Crítico</CardTitle>
                </div>
                <CardDescription>Itens abaixo do estoque mínimo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStockItems.slice(0, 3).map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  return (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          Atual: {item.quantity} | Mínimo: {product?.minStock || 0}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Repor
                      </Button>
                    </div>
                  );
                })}
                {lowStockItems.length > 3 && (
                  <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/inventory/items')}>
                    Ver todos ({lowStockItems.length} itens)
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {expiringItems.length > 0 && (
            <Card className="border-warning/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  <CardTitle className="text-base">Próximo ao Vencimento</CardTitle>
                </div>
                <CardDescription>Lotes que vencem em breve</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {expiringItems.slice(0, 3).map((item) => {
                  const days = getExpiryDays(item.expiryDate);
                  return (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          Lote: {item.batch} | {item.quantity} un.
                        </p>
                      </div>
                      <Badge variant="outline" className="badge-warning">
                        {days === 0 ? 'Hoje' : days === 1 ? 'Amanhã' : `${days} dias`}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Itens em Estoque</CardTitle>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar item..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Local</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const days = getExpiryDays(item.expiryDate);
                  const stockLevel = getStockLevel(item);
                  const product = products.find((p) => p.id === item.productId);
                  const isLowStock = product && item.quantity < product.minStock;

                  return (
                    <TableRow key={item.id} className="table-row-hover">
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.warehouse}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{item.batch}</TableCell>
                      <TableCell>
                        <span className={isLowStock ? 'text-warning font-medium' : ''}>
                          {item.quantity} un.
                        </span>
                      </TableCell>
                      <TableCell className="w-32">
                        <Progress
                          value={stockLevel}
                          className={`h-2 ${isLowStock ? '[&>div]:bg-warning' : ''}`}
                        />
                      </TableCell>
                      <TableCell>
                        {item.expiryDate ? (
                          <Badge
                            variant="outline"
                            className={
                              days !== null && days < 0
                                ? 'badge-danger'
                                : days !== null && days <= 5
                                ? 'badge-warning'
                                : ''
                            }
                          >
                            {new Date(item.expiryDate).toLocaleDateString('pt-BR')}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{item.location}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
