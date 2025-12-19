import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const timesheets = [
  { employee: 'Carla Florista', hours: 42, status: 'Aprovado', week: '2024-12-16' },
  { employee: 'Pedro Entregador', hours: 38, status: 'Pendente', week: '2024-12-16' },
];

export default function Timesheets() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Timesheets</h1>
        <p className="text-muted-foreground">Registros semanais (mock)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Horas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Semana</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesheets.map((ts) => (
                  <TableRow key={ts.employee} className="table-row-hover">
                    <TableCell className="font-medium">{ts.employee}</TableCell>
                    <TableCell>{ts.week}</TableCell>
                    <TableCell>{ts.hours}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={ts.status === 'Aprovado' ? 'badge-success' : 'badge-warning'}>
                        {ts.status}
                      </Badge>
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
