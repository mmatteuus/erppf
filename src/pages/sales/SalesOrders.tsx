import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Copy,
  Printer,
  Truck,
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useERPStore, OrderStatus } from '@/store/mockData';
import { toast } from '@/hooks/use-toast';

const statusLabels: Record<OrderStatus, string> = {
  new: 'Novo',
  separation: 'Separação',
  production: 'Produção',
  ready: 'Pronto',
  in_route: 'Em Rota',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
  failed: 'Falha',
};

const statusStyles: Record<OrderStatus, string> = {
  new: 'badge-info',
  separation: 'badge-warning',
  production: 'badge-warning',
  ready: 'badge-success',
  in_route: 'badge-info',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
  failed: 'badge-danger',
};

export default function SalesOrders() {
  const navigate = useNavigate();
  const { salesOrders, updateOrderStatus } = useERPStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = salesOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    toast({
      title: 'Status atualizado',
      description: `Pedido atualizado para ${statusLabels[newStatus]}`,
    });
  };

  const handleDuplicate = (orderId: string) => {
    toast({
      title: 'Pedido duplicado',
      description: 'O pedido foi duplicado com sucesso.',
    });
  };

  // Summary cards
  const summary = {
    total: salesOrders.length,
    pending: salesOrders.filter((o) => ['new', 'separation', 'production'].includes(o.status)).length,
    inRoute: salesOrders.filter((o) => o.status === 'in_route').length,
    delivered: salesOrders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pedidos de Venda</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos da sua loja</p>
        </div>
        <Button onClick={() => navigate('/sales/orders/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Pedido
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{summary.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Em Rota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">{summary.inRoute}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Entregues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{summary.delivered}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="new">Novo</SelectItem>
            <SelectItem value="separation">Separação</SelectItem>
            <SelectItem value="production">Produção</SelectItem>
            <SelectItem value="ready">Pronto</SelectItem>
            <SelectItem value="in_route">Em Rota</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum pedido encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="cursor-pointer table-row-hover"
                      onClick={() => navigate(`/sales/orders/${order.id}`)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {new Date(order.deliveryDate).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {order.deliveryWindow === 'morning'
                              ? 'Manhã'
                              : order.deliveryWindow === 'afternoon'
                              ? 'Tarde'
                              : 'Noite'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          R$ {order.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusStyles[order.status]}>
                          {statusLabels[order.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            order.paymentStatus === 'paid'
                              ? 'badge-success'
                              : order.paymentStatus === 'pending'
                              ? 'badge-warning'
                              : 'badge-danger'
                          }
                        >
                          {order.paymentStatus === 'paid'
                            ? 'Pago'
                            : order.paymentStatus === 'pending'
                            ? 'Pendente'
                            : 'Reembolsado'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/sales/orders/${order.id}`);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicate(order.id);
                              }}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Printer className="mr-2 h-4 w-4" />
                              Imprimir
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Alterar Status</DropdownMenuLabel>
                            {order.status === 'new' && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(order.id, 'separation');
                                }}
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Enviar para Separação
                              </DropdownMenuItem>
                            )}
                            {order.status === 'separation' && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(order.id, 'production');
                                }}
                              >
                                Enviar para Produção
                              </DropdownMenuItem>
                            )}
                            {order.status === 'production' && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(order.id, 'ready');
                                }}
                              >
                                Marcar como Pronto
                              </DropdownMenuItem>
                            )}
                            {order.status === 'ready' && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(order.id, 'in_route');
                                }}
                              >
                                Iniciar Entrega
                              </DropdownMenuItem>
                            )}
                            {order.status === 'in_route' && (
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(order.id, 'delivered');
                                }}
                              >
                                Confirmar Entrega
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
