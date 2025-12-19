import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const windows = [
  { label: 'Manhã', interval: '08:00 - 11:30' },
  { label: 'Tarde', interval: '12:30 - 17:00' },
  { label: 'Noite', interval: '18:00 - 21:00' },
];

export default function DeliveryWindows() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Janelas de Entrega</h1>
        <p className="text-muted-foreground">Configuração mockada</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {windows.map((win) => (
          <Card key={win.label} className="card-hover">
            <CardHeader className="flex items-center gap-2 pb-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">{win.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="badge-info">
                {win.interval}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
