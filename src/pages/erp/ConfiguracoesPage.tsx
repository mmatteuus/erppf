import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type TableDensity, usePreferencesStore } from "@/store/preferences";
import { api } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ConfiguracoesPage() {
  const queryClient = useQueryClient();
  const { tableDensity, setTableDensity } = usePreferencesStore();

  const resetMutation = useMutation({
    mutationFn: api.db.reset,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["products"] }),
        queryClient.invalidateQueries({ queryKey: ["customers"] }),
        queryClient.invalidateQueries({ queryKey: ["vendors"] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({ queryKey: ["movements"] }),
        queryClient.invalidateQueries({ queryKey: ["invoices"] }),
      ]);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Preferências do aplicativo</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Densidade da tabela</Label>
              <Select
                value={tableDensity}
                onValueChange={(v) => setTableDensity(v as TableDensity)}
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfortable">Confortável</SelectItem>
                  <SelectItem value="compact">Compacta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dados mock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Para demos, você pode resetar o banco local (localStorage) para o
              estado inicial.
            </p>
            <Button
              variant="destructive"
              onClick={() => {
                resetMutation.mutate();
                toast("Dados resetados", { description: "Mocks restaurados." });
              }}
              disabled={resetMutation.isPending}
            >
              Resetar dados
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
