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
import { ArrowRightLeft, CheckCircle2, Clock } from 'lucide-react';

const transfers = [
  { id: 'TR-101', from: 'Depósito Principal', to: 'Sala Fria', item: 'Rosas Vermelhas', qty: 40, status: 'Em trânsito', eta: 'Hoje' },
  { id: 'TR-102', from: 'Sala Fria', to: 'Depósito Principal', item: 'Chocolates', qty: 20, status: 'Concluída', eta: 'Ontem' },
];

export default function Transfers() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transferências</h1>
          <p className="text-muted-foreground">Movimentação entre depósitos</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-primary" />
          <CardTitle>Transferências recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transferência</TableHead>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfers.map((tr) => (
                  <TableRow key={tr.id} className="table-row-hover">
                    <TableCell className="font-medium">{tr.id}</TableCell>
                    <TableCell>{tr.from}</TableCell>
                    <TableCell>{tr.to}</TableCell>
                    <TableCell>{tr.item}</TableCell>
                    <TableCell>{tr.qty} un.</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={tr.status === 'Concluída' ? 'badge-success' : 'badge-info'}>
                        {tr.status}
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
