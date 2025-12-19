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
import { Wallet } from 'lucide-react';

const bills = [
  { id: 'BL-1001', vendor: 'Flores do Campo', due: '2024-12-27', amount: 700, status: 'Pendente' },
  { id: 'BL-1002', vendor: 'Chocolates Artesanais', due: '2025-01-05', amount: 1050, status: 'Pendente' },
  { id: 'BL-1003', vendor: 'Distribuidora Café Fino', due: '2024-12-28', amount: 900, status: 'Pago' },
];

export default function Bills() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contas a Pagar (Compras)</h1>
        <p className="text-muted-foreground">Faturamento gerado a partir dos pedidos</p>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          <CardTitle>Boletos / faturas</CardTitle>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id} className="table-row-hover">
                    <TableCell className="font-medium">{bill.id}</TableCell>
                    <TableCell>{bill.vendor}</TableCell>
                    <TableCell>{new Date(bill.due).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={bill.status === 'Pago' ? 'badge-success' : 'badge-warning'}>
                        {bill.status}
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
