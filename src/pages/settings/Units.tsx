import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

const units = [
  { name: 'Matriz - SP', address: 'Rua das Flores, 123', status: 'Ativa' },
  { name: 'Pop-up Jardins', address: 'Al. Lorena, 400', status: 'Planejada' },
];

export default function Units() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Unidades</h1>
        <p className="text-muted-foreground">Filiais e pop-ups</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {units.map((unit) => (
          <Card key={unit.name} className="card-hover">
            <CardHeader className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">{unit.name}</CardTitle>
              </div>
              <Badge variant="outline" className={unit.status === 'Ativa' ? 'badge-success' : 'badge-info'}>
                {unit.status}
              </Badge>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {unit.address}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
