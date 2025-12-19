import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MarginsReport() {
  const cards = [
    { title: 'Margem média', value: '68.5%', delta: '+2.1 pp' },
    { title: 'Top margem', value: 'Orquídea • 74%', delta: '' },
    { title: 'Baixa margem', value: 'Cesta Café • 61%', delta: '' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatório de Margens</h1>
        <p className="text-muted-foreground">Resumo por categoria (mock)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="kpi-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.delta && (
                <Badge variant="outline" className="badge-success mt-2">
                  {card.delta}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
