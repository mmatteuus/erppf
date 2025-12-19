import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClipboardCheck } from 'lucide-react';

const counts = [
  { id: 'INV-001', area: 'Flores Frescas', items: 25, status: 'Em andamento', variance: 2 },
  { id: 'INV-002', area: 'Presentes', items: 18, status: 'Concluído', variance: 0 },
];

export default function Counts() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventário Físico</h1>
          <p className="text-muted-foreground">Divergências e ajustes rápidos</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-primary" />
          <CardTitle>Contagens recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inventário</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Diferença</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {counts.map((c) => (
                  <TableRow key={c.id} className="table-row-hover">
                    <TableCell className="font-medium">{c.id}</TableCell>
                    <TableCell>{c.area}</TableCell>
                    <TableCell>{c.items}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={c.variance === 0 ? 'badge-success' : 'badge-warning'}>
                        {c.variance === 0 ? 'OK' : `${c.variance} itens`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={c.status === 'Concluído' ? 'badge-success' : 'badge-info'}>
                        {c.status}
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
