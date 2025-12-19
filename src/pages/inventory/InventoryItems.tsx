import { useState } from 'react';
import { Search, MapPin, AlertTriangle } from 'lucide-react';
import { useERPStore } from '@/store/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function InventoryItems() {
  const { inventoryItems, products } = useERPStore();
  const [search, setSearch] = useState('');

  const lowStock = inventoryItems.filter((item) => {
    const product = products.find((p) => p.id === item.productId);
    return product && item.quantity < product.minStock;
  });

  const filtered = inventoryItems.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Itens de Estoque</h1>
          <p className="text-muted-foreground">Controle por lote, validade e depósito</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Itens distintos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{inventoryItems.length}</CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Crítico</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-warning">{lowStock.length}</CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Depósitos</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">1</CardContent>
        </Card>
      </div>

      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar item ou lote..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Depósito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  const isLow = product && item.quantity < product.minStock;
                  return (
                    <TableRow key={item.id} className="table-row-hover">
                      <TableCell className="font-medium flex items-center gap-2">
                        {item.productName}
                        {product?.isPerishable && (
                          <Badge variant="outline" className="badge-warning">
                            Perecível
                          </Badge>
                        )}
                        {isLow && (
                          <Badge variant="outline" className="badge-danger">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Crítico
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.batch}</TableCell>
                      <TableCell>{item.quantity} un.</TableCell>
                      <TableCell>
                        {item.expiryDate
                          ? new Date(item.expiryDate).toLocaleDateString('pt-BR')
                          : '—'}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {item.warehouse} • {item.location}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
