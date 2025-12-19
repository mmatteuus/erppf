import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const payroll = [
  { period: 'Dez/2024', employees: 6, gross: 18200, status: 'Processado' },
  { period: 'Jan/2025', employees: 6, gross: 0, status: 'Em preparação' },
];

export default function Payroll() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Folha (mock)</h1>
        <p className="text-muted-foreground">Resumo de processamento</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Competências</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Colaboradores</TableHead>
                  <TableHead>Bruto</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payroll.map((row) => (
                  <TableRow key={row.period} className="table-row-hover">
                    <TableCell className="font-medium">{row.period}</TableCell>
                    <TableCell>{row.employees}</TableCell>
                    <TableCell>R$ {row.gross.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={row.status === 'Processado' ? 'badge-success' : 'badge-warning'}>
                        {row.status}
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
