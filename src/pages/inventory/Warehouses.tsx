import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Warehouse as WarehouseIcon, MapPin } from 'lucide-react';

const warehouses = [
  { id: 'W-01', name: 'Depósito Principal', location: 'São Paulo - SP', capacity: '80%', temperature: '18°C', critical: 4 },
  { id: 'W-02', name: 'Sala Fria', location: 'São Paulo - SP', capacity: '55%', temperature: '8°C', critical: 1 },
];

export default function Warehouses() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Depósitos & Armazéns</h1>
          <p className="text-muted-foreground">Visão de capacidade, temperatura e alertas</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {warehouses.map((wh) => (
          <Card key={wh.id} className="card-hover">
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <WarehouseIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{wh.name}</CardTitle>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {wh.location}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="badge-info">
                Capacidade {wh.capacity}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Temperatura</p>
                <p className="text-lg font-semibold">{wh.temperature}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm text-muted-foreground">Itens críticos</p>
                <p className="text-lg font-semibold text-warning">{wh.critical}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
