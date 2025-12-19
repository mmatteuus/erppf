import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plug } from 'lucide-react';

const integrations = [
  { name: 'ERP Fiscal', status: 'Em breve' },
  { name: 'Gateway de pagamento', status: 'Em breve' },
  { name: 'Logística', status: 'Em breve' },
];

export default function Integrations() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Integrações</h1>
        <p className="text-muted-foreground">Placeholders para parceiros</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.name} className="card-hover">
            <CardHeader className="flex items-center gap-2 pb-2">
              <Plug className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">{integration.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="badge-warning">
                {integration.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
