import { useERPStore } from '@/store/mockData';
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
import { Truck, Sparkles } from 'lucide-react';

export default function Replenishment() {
  const { products, inventoryItems } = useERPStore();

  const lowStock = inventoryItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product || item.quantity >= product.minStock) return null;
      const suggested = Math.max(product.minStock * 2 - item.quantity, product.minStock);
      return {
        id: item.id,
        name: item.productName,
        qty: item.quantity,
        min: product.minStock,
        suggested,
      };
    })
    .filter(Boolean) as { id: string; name: string; qty: number; min: number; suggested: number }[];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reposição</h1>
          <p className="text-muted-foreground">Sugestões com base em ruptura e mínimo</p>
        </div>
        <Button className="gap-2">
          <Sparkles className="h-4 w-4" />
          Auto-repor
        </Button>
      </div>

      <Card>
        <CardHeader className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" />
          <CardTitle>Itens sugeridos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Atual</TableHead>
                  <TableHead>Mínimo</TableHead>
                  <TableHead>Sugerido</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                      Nenhum item crítico no momento
                    </TableCell>
                  </TableRow>
                )}
                {lowStock.map((item) => (
                  <TableRow key={item.id} className="table-row-hover">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.qty} un.</TableCell>
                    <TableCell>{item.min} un.</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="badge-info">
                        Comprar {item.suggested} un.
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        Gerar compra
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
