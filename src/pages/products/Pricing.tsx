import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

const rules = [
  { id: 'R-001', name: 'Margem padrão flores', targetMargin: 70, category: 'Buquês' },
  { id: 'R-002', name: 'Presentes premium', targetMargin: 65, category: 'Presentes' },
  { id: 'R-003', name: 'Cestas café', targetMargin: 67, category: 'Cestas' },
];

export default function Pricing() {
  const [globalMargin, setGlobalMargin] = useState([65]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Precificação</h1>
          <p className="text-muted-foreground">Regras rápidas de margem e promoções</p>
        </div>
        <Button>Recalcular preços</Button>
      </div>

      <Card className="kpi-card">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Margem alvo global</CardTitle>
            <p className="text-sm text-muted-foreground">Aplica sobre itens sem regra específica</p>
          </div>
          <Badge variant="outline" className="badge-info">
            {globalMargin[0]}%
          </Badge>
        </CardHeader>
        <CardContent>
          <Slider
            value={globalMargin}
            onValueChange={setGlobalMargin}
            min={40}
            max={80}
            step={1}
            className="max-w-xl"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {rules.map((rule) => (
          <Card key={rule.id} className="card-hover">
            <CardHeader className="flex items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">{rule.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{rule.category}</p>
              </div>
              <Badge variant="outline" className="badge-success">
                {rule.targetMargin}% margem
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Regra aplicada a todos os itens de {rule.category}
              </div>
              <Button size="sm" variant="outline">
                Editar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
