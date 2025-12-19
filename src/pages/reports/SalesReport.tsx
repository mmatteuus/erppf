import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SalesReport() {
  const cards = [
    { title: 'Receita 30d', value: 'R$ 48.200', delta: '+12%' },
    { title: 'Pedidos', value: '154', delta: '+8%' },
    { title: 'Ticket médio', value: 'R$ 313', delta: '+4%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatório de Vendas</h1>
        <p className="text-muted-foreground">Comparativo período vs anterior (mock)</p>
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
