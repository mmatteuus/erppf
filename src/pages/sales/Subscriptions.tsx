import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Repeat, Plus } from 'lucide-react';

const subscriptions = [
  { id: 'SUB-001', customer: 'Maria Silva', plan: 'Flores semanais', value: 219.9, status: 'Ativa', next: '2024-12-27' },
  { id: 'SUB-002', customer: 'Empresa XYZ', plan: 'Cestas mensais', value: 890.0, status: 'Ativa', next: '2025-01-05' },
  { id: 'SUB-003', customer: 'João Santos', plan: 'Buquê quinzenal', value: 149.9, status: 'Pausada', next: '—' },
];

export default function Subscriptions() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assinaturas</h1>
          <p className="text-muted-foreground">Recorrência de flores, cestas e presentes</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova assinatura
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ativas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {subscriptions.filter((s) => s.status === 'Ativa').length}
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">MRR mock</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            R$ {subscriptions.reduce((sum, s) => sum + s.value, 0).toLocaleString('pt-BR')}
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Próximos envios</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">7 dias</CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assinatura</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Próximo envio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id} className="table-row-hover">
                    <TableCell className="font-medium">{sub.id}</TableCell>
                    <TableCell>{sub.customer}</TableCell>
                    <TableCell>{sub.plan}</TableCell>
                    <TableCell>R$ {sub.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{sub.next}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={sub.status === 'Ativa' ? 'badge-success' : 'badge-warning'}>
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost">
                        <Repeat className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
