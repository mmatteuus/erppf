import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CalendarClock } from 'lucide-react';

const capacity = [
  { line: 'Arranjos', load: 70 },
  { line: 'Cestas', load: 55 },
  { line: 'Cartões premium', load: 35 },
];

export default function Planning() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Planejamento de Capacidade</h1>
          <p className="text-muted-foreground">MRP lite com filas por linha</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {capacity.map((c) => (
          <Card key={c.line} className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle>{c.line}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Carga</span>
                <span>{c.load}%</span>
              </div>
              <Progress value={c.load} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" />
          <CardTitle>Capacidade semanal</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Distribua as ordens por janela (manhã/tarde/noite) e acompanhe gargalos por time.
        </CardContent>
      </Card>
    </div>
  );
}
