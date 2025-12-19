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
import { Button } from '@/components/ui/button';

export default function AccountsPayable() {
  const { invoices } = useERPStore();
  const payables = invoices.filter((i) => i.type === 'payable');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contas a Pagar</h1>
          <p className="text-muted-foreground">Insumos, fornecedores e vencimentos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagáveis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fatura</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payables.map((inv) => (
                  <TableRow key={inv.id} className="table-row-hover">
                    <TableCell className="font-medium">{inv.number}</TableCell>
                    <TableCell>{inv.entityName}</TableCell>
                    <TableCell>{new Date(inv.dueDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>R$ {inv.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          inv.status === 'paid'
                            ? 'badge-success'
                            : inv.status === 'overdue'
                            ? 'badge-danger'
                            : 'badge-warning'
                        }
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Pagar
                      </Button>
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
