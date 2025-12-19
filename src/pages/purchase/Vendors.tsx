import { useERPStore } from '@/store/mockData';
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
import { Phone, Mail } from 'lucide-react';

export default function Vendors() {
  const { vendors } = useERPStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fornecedores</h1>
        <p className="text-muted-foreground">SLA, contato e categorias</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fornecedores cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Nota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id} className="table-row-hover">
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {vendor.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        {vendor.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="badge-info">
                        {vendor.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{vendor.sla}</TableCell>
                    <TableCell>{vendor.rating.toFixed(1)}/5</TableCell>
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
