import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const entries = [
  { id: 'JE-001', date: '2024-12-18', desc: 'Venda VB-2024-001', debit: 'Clientes', credit: 'Receita de Vendas', amount: 209.7 },
  { id: 'JE-002', date: '2024-12-18', desc: 'CMV VB-2024-001', debit: 'CMV / Insumos', credit: 'Estoque', amount: 45.0 },
];

export default function JournalEntries() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lançamentos Contábeis</h1>
        <p className="text-muted-foreground">Simulados a partir de vendas/compras</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lançamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Débito</TableHead>
                  <TableHead>Crédito</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id} className="table-row-hover">
                    <TableCell className="font-medium">{entry.id}</TableCell>
                    <TableCell>{new Date(entry.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{entry.desc}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.debit}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.credit}</Badge>
                    </TableCell>
                    <TableCell>R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
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
