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

export default function Invoices() {
  const { invoices } = useERPStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faturas</h1>
          <p className="text-muted-foreground">Pagáveis e recebíveis em um só lugar</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fatura</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Entidade</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} className="table-row-hover">
                    <TableCell className="font-medium">{inv.number}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={inv.type === 'receivable' ? 'badge-success' : 'badge-warning'}>
                        {inv.type === 'receivable' ? 'Receber' : 'Pagar'}
                      </Badge>
                    </TableCell>
                    <TableCell>{inv.entityName}</TableCell>
                    <TableCell>{new Date(inv.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={inv.status === 'paid' ? 'badge-success' : inv.status === 'overdue' ? 'badge-danger' : 'badge-warning'}>
                        {inv.status}
                      </Badge>
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
