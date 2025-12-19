import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

const accounts = [
  { id: '001', bank: 'Nubank PJ', balance: 15230.45, status: 'Conciliado' },
  { id: '033', bank: 'Santander', balance: 8420.12, status: 'A conciliar' },
];

export default function Banks() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contas Bancárias</h1>
          <p className="text-muted-foreground">Saldo e status de conciliação</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map((acc) => (
          <Card key={acc.id} className="card-hover">
            <CardHeader className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{acc.bank}</CardTitle>
              </div>
              <Badge variant="outline" className={acc.status === 'Conciliado' ? 'badge-success' : 'badge-warning'}>
                {acc.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Saldo</p>
              <p className="text-xl font-semibold">
                R$ {acc.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
