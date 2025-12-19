import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, Plus } from 'lucide-react';

const bundles = [
  { id: 'KIT-LOVE', name: 'Kit Love', items: ['Buquê de rosas', 'Pelúcia', 'Chocolate'], price: 279.9, margin: 62 },
  { id: 'KIT-BREAKFAST', name: 'Cesta Café Premium', items: ['Cesta café', 'Balão', 'Cartão'], price: 359.9, margin: 65 },
  { id: 'KIT-CORP', name: 'Corporate Flowers', items: ['Arranjo tropical', 'Cartão premium'], price: 199.9, margin: 68 },
];

export default function Bundles() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kits e Bundles</h1>
          <p className="text-muted-foreground">Agrupe flores, presentes e adicionais</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo kit
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bundles.map((bundle) => (
          <Card key={bundle.id} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>{bundle.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{bundle.id}</p>
              </div>
              <Gift className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {bundle.items.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">R$ {bundle.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Margem alvo: {bundle.margin}%</p>
                </div>
                <Button size="sm" variant="outline">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
