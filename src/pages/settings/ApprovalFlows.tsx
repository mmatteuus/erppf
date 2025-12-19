import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';

const flows = [
  { name: 'Compras', rule: 'Aprovar acima de R$ 500', approver: 'Admin' },
  { name: 'Financeiro', rule: 'Pagamentos > R$ 1.000', approver: 'Marina Financeiro' },
];

export default function ApprovalFlows() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fluxos de Aprovação</h1>
        <p className="text-muted-foreground">Regras simples para demo</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {flows.map((flow) => (
          <Card key={flow.name} className="card-hover">
            <CardHeader className="flex items-center gap-2 pb-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">{flow.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm text-muted-foreground">{flow.rule}</p>
              <Badge variant="outline" className="badge-info">
                Aprovador: {flow.approver}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
