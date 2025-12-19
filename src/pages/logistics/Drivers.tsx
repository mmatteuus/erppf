import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck } from 'lucide-react';

const drivers = [
  { id: 'DRV-01', name: 'Pedro Entregador', phone: '(11) 99999-0004', status: 'Disponível', route: 'RT-01' },
  { id: 'DRV-02', name: 'Juliana Rota', phone: '(11) 98888-1212', status: 'Em rota', route: 'RT-02' },
];

export default function Drivers() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Entregadores</h1>
          <p className="text-muted-foreground">Atribuição e status de rota</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {drivers.map((driver) => (
          <Card key={driver.id} className="card-hover">
            <CardHeader className="flex items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">{driver.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{driver.phone}</p>
              </div>
              <Badge variant="outline" className={driver.status === 'Disponível' ? 'badge-success' : 'badge-info'}>
                {driver.status}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              Rota atual: {driver.route}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
