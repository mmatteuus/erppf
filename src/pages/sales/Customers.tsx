import { useState } from 'react';
import { Search, Plus, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { useERPStore } from '@/store/mockData';

export default function Customers() {
  const { customers } = useERPStore();
  const [search, setSearch] = useState('');

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">CRM simples para pedidos e recorrência</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Clientes ativos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{customers.length}</CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">VIP</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {customers.filter((c) => c.tags.includes('VIP')).length}
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Corporativo</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {customers.filter((c) => c.tags.includes('Corporativo')).length}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, e-mail ou telefone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Desde</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((customer) => (
                  <TableRow key={customer.id} className="table-row-hover">
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {customer.phone}
                      </div>
                    </TableCell>
                    <TableCell className="space-x-2">
                      {customer.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell>
                      {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
