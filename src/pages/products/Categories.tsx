import { useMemo } from 'react';
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
import { useERPStore } from '@/store/mockData';

export default function Categories() {
  const { products } = useERPStore();

  const categories = useMemo(() => {
    const map = new Map<string, { count: number; perishable: number; revenue: number }>();
    products.forEach((p) => {
      const existing = map.get(p.category) || { count: 0, perishable: 0, revenue: 0 };
      map.set(p.category, {
        count: existing.count + 1,
        perishable: existing.perishable + (p.isPerishable ? 1 : 0),
        revenue: existing.revenue + p.price,
      });
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, ...data }));
  }, [products]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground">Agrupe flores, presentes e serviços</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Categorias ativas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{categories.length}</CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Itens perecíveis</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {products.filter((p) => p.isPerishable).length}
          </CardContent>
        </Card>
        <Card className="kpi-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ticket médio mock</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            R$ {(products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Perecíveis</TableHead>
                  <TableHead>Preço médio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.name} className="table-row-hover">
                    <TableCell className="font-medium flex items-center gap-2">
                      <Badge variant="outline" className="badge-info">
                        {cat.name}
                      </Badge>
                    </TableCell>
                    <TableCell>{cat.count}</TableCell>
                    <TableCell>{cat.perishable}</TableCell>
                    <TableCell>
                      R$ {(cat.revenue / cat.count).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
