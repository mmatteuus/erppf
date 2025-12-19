import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const wastes = [
  { id: 'WT-001', item: 'Rosas Vermelhas', qty: 6, reason: 'Vencido', date: '2024-12-18' },
  { id: 'WT-002', item: 'Flores Tropicais', qty: 4, reason: 'Dano em transporte', date: '2024-12-19' },
];

export default function Waste() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Perdas & Descarte</h1>
          <p className="text-muted-foreground">Controle de perecíveis e motivos de baixa</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <CardTitle>Registro de perdas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wastes.map((w) => (
                  <TableRow key={w.id} className="table-row-hover">
                    <TableCell className="font-medium">{w.id}</TableCell>
                    <TableCell>{w.item}</TableCell>
                    <TableCell>{w.qty} un.</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="badge-warning">
                        {w.reason}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(w.date).toLocaleDateString('pt-BR')}
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
