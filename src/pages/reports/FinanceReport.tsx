import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FinanceReport() {
  const cards = [
    { title: 'Fluxo 30d', value: 'R$ 112.300', delta: '+18%' },
    { title: 'Recebíveis', value: 'R$ 3.420', delta: 'pendentes' },
    { title: 'Pagáveis', value: 'R$ 2.650', delta: 'próx. 15d' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatório Financeiro</h1>
        <p className="text-muted-foreground">Resumo de caixa e vencimentos (mock)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="kpi-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <Badge variant="outline" className="badge-success mt-2">
                {card.delta}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
