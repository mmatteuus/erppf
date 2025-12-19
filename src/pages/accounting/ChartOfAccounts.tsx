import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const accounts = [
  { code: '1.1.1', name: 'Caixa', type: 'Ativo' },
  { code: '1.1.2', name: 'Bancos', type: 'Ativo' },
  { code: '1.2.1', name: 'Clientes', type: 'Ativo' },
  { code: '2.1.1', name: 'Fornecedores', type: 'Passivo' },
  { code: '3.1.1', name: 'Receita de Vendas', type: 'Receita' },
  { code: '4.1.1', name: 'CMV / Insumos', type: 'Despesa' },
];

export default function ChartOfAccounts() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Plano de Contas</h1>
        <p className="text-muted-foreground">Estrutura contábil mockada</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((acc) => (
                  <TableRow key={acc.code} className="table-row-hover">
                    <TableCell className="font-medium">{acc.code}</TableCell>
                    <TableCell>{acc.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="badge-info">
                        {acc.type}
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
