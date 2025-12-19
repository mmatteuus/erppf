import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InventoryReport() {
  const cards = [
    { title: 'Rupturas', value: '4 itens', delta: '-2 vs semana anterior' },
    { title: 'Vencimento em 7d', value: '3 lotes', delta: 'ação imediata' },
    { title: 'Valor estimado', value: 'R$ 18.900', delta: '+5%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatório de Estoque</h1>
        <p className="text-muted-foreground">Resumo de ruptura, validade e valor (mock)</p>
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
