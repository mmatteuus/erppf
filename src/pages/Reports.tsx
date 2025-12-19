import { useQuery } from "@tanstack/react-query";
import { reportsApi } from "@/api/reports";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePDVStore } from "@/store/pdv";

export default function Reports() {
  const { pendingSales } = usePDVStore();
  const { data: summary } = useQuery({
    queryKey: ["reports", "summary"],
    queryFn: reportsApi.summary,
  });
  const { data: salesByDay = [] } = useQuery({
    queryKey: ["reports", "sales-by-day"],
    queryFn: reportsApi.salesByDay,
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Relatorios basicos</h2>
        <p className="text-sm text-muted-foreground">Resumo de venda, fiscal e pagamentos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo do dia</CardTitle>
            <CardDescription>Valores vindos da API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row label="Total vendas" value={`R$ ${(summary?.salesTotal ?? 0).toFixed(2)}`} />
            <Row
              label="Total pagamentos"
              value={`R$ ${(summary?.paymentsTotal ?? 0).toFixed(2)}`}
            />
            <Row label="NFC-e pendentes" value={summary?.nfcePending ?? 0} />
            <Row label="NFC-e rejeitadas" value={summary?.nfceRejected ?? 0} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fila pendente</CardTitle>
            <CardDescription>O que ainda nao sincronizou</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingSales.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem pendencias.</p>
            ) : (
              pendingSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between border rounded-md px-2 py-2">
                  <div>
                    <div className="font-medium">{sale.saleUid}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(sale.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right font-semibold">R$ {sale.total.toFixed(2)}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendas por dia</CardTitle>
          <CardDescription>Feed da API /reports/sales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Separator />
          {salesByDay.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sem dados para o periodo.</p>
          ) : (
            salesByDay.map((row) => (
              <div key={row.date} className="flex items-center justify-between px-2 py-2 border rounded-md">
                <div className="font-medium">{row.date}</div>
                <div className="text-right text-sm">
                  R$ {row.sales.toFixed(2)} · {row.tickets} tickets
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
