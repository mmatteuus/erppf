import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const items = [
  { id: 'CN-001', description: 'Pagamento PIX - VB-2024-005', value: 429.8, status: 'Conciliado' },
  { id: 'CN-002', description: 'Tarifa bancária', value: -9.9, status: 'Pendente' },
];

export default function Reconciliation() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Conciliação</h1>
        <p className="text-muted-foreground">Conciliação mock para demo</p>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <CardTitle>Movimentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="table-row-hover">
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={item.status === 'Conciliado' ? 'badge-success' : 'badge-warning'}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg border bg-muted/40 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <div>
          <p className="font-medium">Integração mockada</p>
          <p className="text-sm text-muted-foreground">Conexões reais podem ser plugadas em produção.</p>
        </div>
      </div>
    </div>
  );
}
