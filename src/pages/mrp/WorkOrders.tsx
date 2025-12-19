import { useERPStore } from '@/store/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Factory } from 'lucide-react';

const statusBadge: Record<string, string> = {
  pending: 'badge-info',
  in_progress: 'badge-warning',
  quality_check: 'badge-info',
  completed: 'badge-success',
};

export default function WorkOrders() {
  const { workOrders } = useERPStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ordens de Produção</h1>
        <p className="text-muted-foreground">MRP Lite conectado aos pedidos de venda</p>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <Factory className="h-4 w-4 text-primary" />
          <CardTitle>Ordens</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((wo) => (
                  <TableRow key={wo.id} className="table-row-hover">
                    <TableCell className="font-medium">{wo.orderNumber}</TableCell>
                    <TableCell>{wo.productName}</TableCell>
                    <TableCell>{wo.quantity}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge[wo.status]}>
                        {wo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{wo.assignedTo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
