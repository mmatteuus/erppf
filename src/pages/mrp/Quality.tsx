import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

const checklists = [
  { id: 'QC-001', order: 'OP-2024-001', product: 'Buquê de Rosas', items: ['Checar frescor', 'Amarração', 'Cartão assinado'], status: 'Aprovado' },
  { id: 'QC-002', order: 'OP-2024-002', product: 'Cesta Café', items: ['Itens completos', 'Lacres', 'Etiqueta de entrega'], status: 'Em revisão' },
];

export default function Quality() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Qualidade</h1>
          <p className="text-muted-foreground">Checklist antes da entrega</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {checklists.map((qc) => (
          <Card key={qc.id} className="card-hover">
            <CardHeader className="flex items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">{qc.product}</CardTitle>
                <p className="text-sm text-muted-foreground">{qc.order}</p>
              </div>
              <Badge variant="outline" className={qc.status === 'Aprovado' ? 'badge-success' : 'badge-info'}>
                {qc.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {qc.items.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
