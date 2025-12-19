import { useQuery } from "@tanstack/react-query";
import { salesApi } from "@/api/sales";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePDVStore } from "@/store/pdv";
import type { Sale } from "@/types/domain";

export default function Sales() {
  const { pendingSales } = usePDVStore();
  const { data: sales = [], isFetching } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: () => salesApi.list(),
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Vendas realizadas</h2>
        <p className="text-sm text-muted-foreground">Filtros por data/status e fila offline</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Dados vindos da API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {isFetching && <p className="text-sm text-muted-foreground">Carregando...</p>}
          {sales.length === 0 && !isFetching ? (
            <p className="text-sm text-muted-foreground">Nenhuma venda encontrada.</p>
          ) : (
            sales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between border rounded-md px-3 py-2">
                <div>
                  <div className="font-medium">
                    {sale.number || sale.id} - {sale.customerName || "Cliente"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(sale.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">R$ {sale.total.toFixed(2)}</div>
                  <Badge variant="outline">{sale.status}</Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fila offline/pendente</CardTitle>
          <CardDescription>Vendas aguardando sincronizacao</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Separator />
          {pendingSales.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma venda pendente.</p>
          ) : (
            pendingSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between px-2 py-2 border rounded-md">
                <div>
                  <div className="font-medium">{sale.saleUid}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(sale.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">R$ {sale.total.toFixed(2)}</div>
                  <Badge variant={sale.status === "pending" ? "default" : "destructive"}>
                    {sale.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
