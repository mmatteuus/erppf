import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map } from 'lucide-react';

const routes = [
  { id: 'RT-01', name: 'Zona Sul', stops: 6, status: 'Em rota', eta: '11:30' },
  { id: 'RT-02', name: 'Zona Oeste', stops: 4, status: 'Planejada', eta: '14:00' },
];

export default function Routes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rotas</h1>
          <p className="text-muted-foreground">Agrupe entregas por região e janela</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <Map className="h-4 w-4 text-primary" />
          <CardTitle>Rotas de hoje</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {routes.map((route) => (
            <div key={route.id} className="p-4 rounded-lg border bg-muted/30 card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{route.id}</p>
                  <p className="font-semibold">{route.name}</p>
                </div>
                <Badge variant="outline" className={route.status === 'Em rota' ? 'badge-info' : 'badge-warning'}>
                  {route.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{route.stops} paradas • ETA {route.eta}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
