import { DataTable } from "@/components/data/DataTable";
import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyBRL, formatDateBR } from "@/lib/format";
import type { Invoice, InvoiceStatus } from "@/mock";
import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { toast } from "sonner";

const statusLabel: Record<InvoiceStatus, string> = {
  aberta: "Aberta",
  paga: "Paga",
  atrasada: "Atrasada",
};

const statusBadge: Record<InvoiceStatus, string> = {
  aberta: "badge-info",
  paga: "badge-success",
  atrasada: "badge-danger",
};

export default function ContasPagarPage() {
  const queryClient = useQueryClient();

  const invoicesQuery = useQuery({
    queryKey: ["invoices"],
    queryFn: api.invoices.list,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: InvoiceStatus }) =>
      api.invoices.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });

  const statusFilter: FilterFn<Invoice> = (row, id, value) => {
    if (!value) return true;
    return String(row.getValue(id)) === value;
  };

  const data = (invoicesQuery.data ?? []).filter((i) => i.tipo === "pagar");

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "numero",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Título" />
      ),
      meta: { label: "Título", filterVariant: "text" },
    },
    {
      accessorKey: "entidade",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Fornecedor" />
      ),
      meta: { label: "Fornecedor", filterVariant: "text" },
    },
    {
      accessorKey: "vencimentoEm",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vencimento" />
      ),
      cell: ({ getValue }) => formatDateBR(getValue() as string),
    },
    {
      accessorKey: "valor",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Valor" />
      ),
      cell: ({ getValue }) => formatCurrencyBRL(getValue() as number),
    },
    {
      accessorKey: "status",
      header: "Status",
      meta: {
        label: "Status",
        filterVariant: "select",
        options: [
          { label: "Aberta", value: "aberta" },
          { label: "Paga", value: "paga" },
          { label: "Atrasada", value: "atrasada" },
        ],
      },
      filterFn: statusFilter,
      cell: ({ row }) => (
        <Badge variant="outline" className={statusBadge[row.original.status]}>
          {statusLabel[row.original.status]}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            updateMutation.mutate({
              id: row.original.id,
              status: row.original.status === "paga" ? "aberta" : "paga",
            });
            toast("Status atualizado", { description: row.original.numero });
          }}
        >
          {row.original.status === "paga" ? "Reabrir" : "Marcar paga"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contas a pagar</h1>
        <p className="text-muted-foreground">Pagáveis e fornecedores</p>
      </div>

      <DataTable<Invoice>
        data={data}
        loading={invoicesQuery.isLoading}
        columns={columns}
        globalFilterPlaceholder="Buscar por título, fornecedor…"
        getRowId={(row) => row.id}
        mobileCard={(i) => (
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{i.numero}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {i.entidade}
                </div>
              </div>
              <div className="text-sm font-semibold whitespace-nowrap">
                {formatCurrencyBRL(i.valor)}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Badge variant="outline" className={statusBadge[i.status]}>
                {statusLabel[i.status]}
              </Badge>
              <span>Venc.: {formatDateBR(i.vencimentoEm)}</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
