import { useERPStore } from '@/store/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle } from 'lucide-react';

export default function Batches() {
  const { inventoryItems, products } = useERPStore();

  const expiring = inventoryItems.filter((item) => {
    if (!item.expiryDate) return false;
    const days = Math.ceil(
      (new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return days <= 7;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lotes & Validade</h1>
          <p className="text-muted-foreground">Controle perecíveis e alertas de vencimento</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Lotes ativos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{inventoryItems.length}</CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Perto do vencimento</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-warning">{expiring.length}</CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Perecíveis</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {inventoryItems.filter((i) => products.find((p) => p.id === i.productId)?.isPerishable).length}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  const isExpiring = expiring.some((e) => e.id === item.id);
                  return (
                    <TableRow key={item.id} className="table-row-hover">
                      <TableCell className="font-medium">{item.batch}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.productName}
                          {product?.isPerishable && (
                            <Badge variant="outline" className="badge-warning">
                              Perecível
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity} un.</TableCell>
                      <TableCell>
                        {item.expiryDate
                          ? new Date(item.expiryDate).toLocaleDateString('pt-BR')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        {isExpiring ? (
                          <Badge variant="outline" className="badge-danger">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Vence em <Clock className="h-3 w-3 ml-1" />
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="badge-success">
                            Ok
                          </Badge>
                        )}
                      </TableCell>
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
