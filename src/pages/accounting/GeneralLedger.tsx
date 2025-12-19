import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ledger = [
  { date: '2024-12-18', account: 'Receita de Vendas', debit: 0, credit: 209.7, balance: 209.7 },
  { date: '2024-12-18', account: 'Clientes', debit: 209.7, credit: 0, balance: 209.7 },
  { date: '2024-12-18', account: 'CMV / Insumos', debit: 45.0, credit: 0, balance: 45.0 },
];

export default function GeneralLedger() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Razão Geral</h1>
        <p className="text-muted-foreground">Resumo por conta</p>
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
                  <TableHead>Data</TableHead>
                  <TableHead>Conta</TableHead>
                  <TableHead>Débito</TableHead>
                  <TableHead>Crédito</TableHead>
                  <TableHead>Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledger.map((row, idx) => (
                  <TableRow key={idx} className="table-row-hover">
                    <TableCell>{new Date(row.date).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-medium">{row.account}</TableCell>
                    <TableCell>{row.debit > 0 ? `R$ ${row.debit.toFixed(2)}` : '—'}</TableCell>
                    <TableCell>{row.credit > 0 ? `R$ ${row.credit.toFixed(2)}` : '—'}</TableCell>
                    <TableCell>R$ {row.balance.toFixed(2)}</TableCell>
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
