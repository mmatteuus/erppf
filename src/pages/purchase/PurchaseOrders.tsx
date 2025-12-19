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

const statusBadge: Record<string, string> = {
  draft: 'badge-info',
  pending_approval: 'badge-warning',
  approved: 'badge-success',
  received: 'badge-success',
  invoiced: 'badge-success',
};

export default function PurchaseOrders() {
  const { purchaseOrders } = useERPStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pedidos de Compra</h1>
        <p className="text-muted-foreground">Workflow: Rascunho → Aprovação → Recebido</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Entrega</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((po) => (
                  <TableRow key={po.id} className="table-row-hover">
                    <TableCell className="font-medium">{po.orderNumber}</TableCell>
                    <TableCell>{po.vendorName}</TableCell>
                    <TableCell>{po.items.length}</TableCell>
                    <TableCell>R$ {po.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge[po.status]}>
                        {po.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(po.expectedDate).toLocaleDateString('pt-BR')}
                    </TableCell>
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
