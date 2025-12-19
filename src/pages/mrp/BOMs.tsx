import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';

const boms = [
  { id: 'BOM-001', product: 'Buquê de Rosas Vermelhas', components: ['12 rosas', 'Fita de cetim', 'Embalagem'], cost: 45 },
  { id: 'BOM-002', product: 'Cesta Café Especial', components: ['Cesta café', 'Suco', 'Frutas', 'Cartão'], cost: 120 },
];

export default function BOMs() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fichas Técnicas (BOM)</h1>
          <p className="text-muted-foreground">Explosão de materiais para arranjos e cestas</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {boms.map((bom) => (
          <Card key={bom.id} className="card-hover">
            <CardHeader className="flex items-center justify-between pb-2">
              <div>
                <CardTitle>{bom.product}</CardTitle>
                <p className="text-sm text-muted-foreground">{bom.id}</p>
              </div>
              <Badge variant="outline" className="badge-info">
                Custo R$ {bom.cost.toFixed(2)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {bom.components.map((comp) => (
                  <Badge key={comp} variant="outline">
                    {comp}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wrench className="h-4 w-4" />
                Consumo automático de estoque ao iniciar a ordem
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
