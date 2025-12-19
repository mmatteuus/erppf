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
import { Button } from '@/components/ui/button';
import { FileText, Send } from 'lucide-react';

const quotes = [
  {
    id: 'Q-1201',
    customer: 'Maria Silva',
    items: 3,
    total: 780.5,
    status: 'Aguardando aprovação',
    validUntil: '2024-12-30',
  },
  {
    id: 'Q-1202',
    customer: 'Empresa XYZ',
    items: 5,
    total: 2450,
    status: 'Enviado',
    validUntil: '2025-01-05',
  },
  {
    id: 'Q-1203',
    customer: 'João Santos',
    items: 2,
    total: 320.9,
    status: 'Rascunho',
    validUntil: '2024-12-28',
  },
];

export default function Quotes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
          <p className="text-muted-foreground">Pipeline rápido de propostas para clientes</p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Novo orçamento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Em aberto</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {quotes.filter((q) => q.status !== 'Convertido').length}
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Valor potencial</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            R$ {quotes.reduce((s, q) => s + q.total, 0).toLocaleString('pt-BR')}
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Conversão mock</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">32%</CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orçamento</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id} className="table-row-hover">
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.customer}</TableCell>
                    <TableCell>{quote.items}</TableCell>
                    <TableCell>
                      R$ {quote.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="badge-info">
                        {quote.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Send className="h-4 w-4" />
                        Enviar
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
