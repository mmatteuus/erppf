import { DataTable } from "@/components/data/DataTable";
import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import type { Vendor } from "@/mock";
import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function FornecedoresPage() {
  const queryClient = useQueryClient();

  const vendorsQuery = useQuery({
    queryKey: ["vendors"],
    queryFn: api.vendors.list,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      api.vendors.create({
        nome: "Fornecedor (demo)",
        categoria: "Flores",
        prazoEntregaDias: 2,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendors"] }),
  });

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fornecedor" />
      ),
      meta: { label: "Fornecedor", filterVariant: "text" },
    },
    {
      accessorKey: "categoria",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria" />
      ),
      meta: {
        label: "Categoria",
        filterVariant: "select",
        options: [
          { label: "Flores", value: "Flores" },
          { label: "Cestas", value: "Cestas" },
          { label: "Presentes", value: "Presentes" },
        ],
      },
    },
    {
      accessorKey: "prazoEntregaDias",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Prazo (dias)" />
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: { label: "Email", filterVariant: "text" },
      cell: ({ getValue }) => (getValue() as string | undefined) ?? "—",
    },
    {
      accessorKey: "telefone",
      header: "Telefone",
      meta: { label: "Telefone", filterVariant: "text" },
      cell: ({ getValue }) => (getValue() as string | undefined) ?? "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">Compras e cadeia de suprimentos</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            createMutation.mutate();
            toast("Fornecedor criado", { description: "Registro mock adicionado." });
          }}
          disabled={createMutation.isPending}
        >
          <Plus className="h-4 w-4" />
          Novo fornecedor
        </Button>
      </div>

      <DataTable<Vendor>
        data={vendorsQuery.data ?? []}
        loading={vendorsQuery.isLoading}
        columns={columns}
        globalFilterPlaceholder="Buscar por fornecedor, email…"
        getRowId={(row) => row.id}
        mobileCard={(v) => (
          <div className="space-y-2">
            <div className="font-medium">{v.nome}</div>
            <div className="text-xs text-muted-foreground">
              {v.categoria} • prazo {v.prazoEntregaDias} dias
            </div>
            <div className="text-xs text-muted-foreground">
              {v.email ?? "—"} • {v.telefone ?? "—"}
            </div>
          </div>
        )}
      />
    </div>
  );
}
