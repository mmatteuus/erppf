import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sparkles } from 'lucide-react';

const rfqs = [
  { id: 'RFQ-1001', vendor: 'Flores do Campo', items: 3, total: 1200, status: 'Aguardando aprovação' },
  { id: 'RFQ-1002', vendor: 'Embalagens Express', items: 2, total: 340, status: 'Enviado' },
];

export default function RFQs() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cotações (RFQ)</h1>
          <p className="text-muted-foreground">Gere pedidos a partir de ruptura</p>
        </div>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Auto-repor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFQ</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Estimado</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfqs.map((rfq) => (
                  <TableRow key={rfq.id} className="table-row-hover">
                    <TableCell className="font-medium">{rfq.id}</TableCell>
                    <TableCell>{rfq.vendor}</TableCell>
                    <TableCell>{rfq.items}</TableCell>
                    <TableCell>R$ {rfq.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="badge-info">
                        {rfq.status}
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
