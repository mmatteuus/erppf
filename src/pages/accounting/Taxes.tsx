import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';

const taxes = [
  { id: 'TX-ISS', name: 'ISS', rate: 3.0, basis: 'Serviços' },
  { id: 'TX-ICMS', name: 'ICMS', rate: 12.0, basis: 'Produtos' },
];

export default function Taxes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Impostos (mock)</h1>
          <p className="text-muted-foreground">Regras simplificadas para a demo</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          <CardTitle>Regras básicas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {taxes.map((tax) => (
            <div key={tax.id} className="p-4 rounded-lg border bg-muted/30 card-hover">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">{tax.name}</p>
                  <p className="text-sm text-muted-foreground">{tax.id}</p>
                </div>
                <Badge variant="outline" className="badge-info">
                  {tax.rate}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Base: {tax.basis}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
