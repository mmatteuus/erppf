import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DeliveriesReport() {
  const cards = [
    { title: 'On-time', value: '94.2%', delta: '-1.3 pp' },
    { title: 'Atrasos', value: '2 entregas', delta: 'priorizar' },
    { title: 'Avaliação', value: '4.8/5', delta: 'clientes' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatório de Entregas</h1>
        <p className="text-muted-foreground">SLA e satisfação (mock)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="kpi-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <Badge variant="outline" className="badge-info mt-2">
                {card.delta}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
