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
import { Check } from 'lucide-react';

const receipts = [
  { id: 'RC-1001', po: 'PC-2024-001', vendor: 'Flores do Campo', items: 1, status: 'Recebido', date: '2024-12-18' },
  { id: 'RC-1002', po: 'PC-2024-002', vendor: 'Chocolates Artesanais', items: 1, status: 'Conferindo', date: '2024-12-22' },
];

export default function Receipts() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recebimento</h1>
        <p className="text-muted-foreground">Check-in de notas e volumes</p>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" />
          <CardTitle>Recebimentos recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recebimento</TableHead>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipts.map((rc) => (
                  <TableRow key={rc.id} className="table-row-hover">
                    <TableCell className="font-medium">{rc.id}</TableCell>
                    <TableCell>{rc.po}</TableCell>
                    <TableCell>{rc.vendor}</TableCell>
                    <TableCell>{rc.items}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={rc.status === 'Recebido' ? 'badge-success' : 'badge-info'}>
                        {rc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(rc.date).toLocaleDateString('pt-BR')}
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
