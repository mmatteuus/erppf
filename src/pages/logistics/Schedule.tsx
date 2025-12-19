import { useERPStore } from '@/store/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock } from 'lucide-react';

export default function LogisticsSchedule() {
  const { deliveries } = useERPStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agenda de Entregas</h1>
          <p className="text-muted-foreground">Manhã / Tarde / Noite com SLA</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          <CardTitle>Próximas saídas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="p-4 rounded-lg border bg-muted/30 card-hover">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">Pedido</p>
                  <p className="font-semibold">{delivery.salesOrderId}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    delivery.status === 'delivered'
                      ? 'badge-success'
                      : delivery.status === 'in_route'
                      ? 'badge-info'
                      : 'badge-warning'
                  }
                >
                  {delivery.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{delivery.address}</p>
              <p className="text-sm">
                Horário: {new Date(delivery.scheduledTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-sm">Motorista: {delivery.driverName}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
