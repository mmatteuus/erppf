import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle2 } from 'lucide-react';

const payments = [
  { id: 'PAY-001', method: 'PIX', amount: 429.8, entity: 'Fernanda Lima', status: 'Confirmado' },
  { id: 'PAY-002', method: 'Cartão', amount: 259.9, entity: 'João Santos', status: 'Pendente' },
];

export default function Payments() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pagamentos</h1>
          <p className="text-muted-foreground">Baixa em 1 clique (mock)</p>
        </div>
        <Button className="gap-2">
          <CreditCard className="h-4 w-4" />
          Registrar pagamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagamentos recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {payments.map((pay) => (
            <div
              key={pay.id}
              className="p-4 rounded-lg border bg-muted/40 flex items-center justify-between card-hover"
            >
              <div>
                <p className="font-semibold">{pay.entity}</p>
                <p className="text-sm text-muted-foreground">
                  {pay.method} • {pay.id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold">R$ {pay.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <Badge variant="outline" className={pay.status === 'Confirmado' ? 'badge-success' : 'badge-warning'}>
                  {pay.status}
                </Badge>
                <Button size="sm" variant="outline" className="gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Baixar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
