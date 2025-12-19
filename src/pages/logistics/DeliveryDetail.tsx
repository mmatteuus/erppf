import { useParams } from 'react-router-dom';
import { useERPStore } from '@/store/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, CheckCircle2 } from 'lucide-react';

export default function DeliveryDetail() {
  const { id } = useParams();
  const { deliveries } = useERPStore();
  const delivery = deliveries.find((d) => d.id === id);

  if (!delivery) {
    return <p className="p-6 text-muted-foreground">Entrega não encontrada</p>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Entrega {delivery.id}</h1>
          <p className="text-muted-foreground">Pedido {delivery.salesOrderId}</p>
        </div>
        <Badge variant="outline" className={delivery.status === 'delivered' ? 'badge-success' : 'badge-info'}>
          {delivery.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {delivery.address}
          </div>
          <p className="text-sm text-muted-foreground">
            Horário agendado:{' '}
            {new Date(delivery.scheduledTime).toLocaleString('pt-BR', {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </p>
          <p className="text-sm text-muted-foreground">Motorista: {delivery.driverName}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Iniciar rota
            </Button>
            <Button size="sm" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Confirmar entrega
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
