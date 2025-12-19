import { DataTable } from "@/components/data/DataTable";
import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatCurrencyBRL, formatDateBR } from "@/lib/format";
import type { Order, OrderStatus } from "@/mock";
import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const statusLabel: Record<OrderStatus, string> = {
  novo: "Novo",
  separacao: "Separação",
  producao: "Produção",
  pronto: "Pronto",
  em_rota: "Em rota",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const statusBadge: Record<OrderStatus, string> = {
  novo: "badge-info",
  separacao: "badge-warning",
  producao: "badge-warning",
  pronto: "badge-success",
  em_rota: "badge-info",
  entregue: "badge-success",
  cancelado: "badge-danger",
};

export default function PedidosListPage() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: api.orders.list,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      api.orders.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const statusFilter: FilterFn<Order> = (row, id, value) => {
    if (!value) return true;
    return String(row.getValue(id)) === value;
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "numero",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pedido" />
      ),
      meta: { label: "Pedido", filterVariant: "text", placeholder: "VB-2025-" },
    },
    {
      accessorKey: "cliente",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cliente" />
      ),
      meta: { label: "Cliente", filterVariant: "text" },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      meta: {
        label: "Status",
        filterVariant: "select",
        options: [
          { label: "Novo", value: "novo" },
          { label: "Separação", value: "separacao" },
          { label: "Produção", value: "producao" },
          { label: "Pronto", value: "pronto" },
          { label: "Em rota", value: "em_rota" },
          { label: "Entregue", value: "entregue" },
          { label: "Cancelado", value: "cancelado" },
        ],
      },
      filterFn: statusFilter,
      cell: ({ getValue }) => {
        const status = getValue() as OrderStatus;
        return (
          <Badge variant="outline" className={statusBadge[status]}>
            {statusLabel[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "entregaEm",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Entrega" />
      ),
      cell: ({ getValue }) => formatDateBR(getValue() as string),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
      cell: ({ getValue }) => formatCurrencyBRL(getValue() as number),
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" aria-label="Ações">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  toast("Detalhe (demo)", {
                    description: "Tela de detalhe pode ser adicionada no próximo sprint.",
                  })
                }
              >
                Ver
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Mudar status</DropdownMenuLabel>
              {(
                [
                  "novo",
                  "separacao",
                  "producao",
                  "pronto",
                  "em_rota",
                  "entregue",
                  "cancelado",
                ] as OrderStatus[]
              ).map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => {
                    updateStatusMutation.mutate({ id: order.id, status: s });
                    toast("Status atualizado", {
                      description: `${order.numero} → ${statusLabel[s]}`,
                    });
                  }}
                >
                  {statusLabel[s]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe o fluxo de vendas</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/vendas/pedidos/novo">
            <Plus className="h-4 w-4" />
            Novo pedido
          </Link>
        </Button>
      </div>

      <DataTable<Order>
        data={ordersQuery.data ?? []}
        loading={ordersQuery.isLoading}
        columns={columns}
        globalFilterPlaceholder="Buscar por número, cliente…"
        getRowId={(row) => row.id}
        mobileCard={(o) => (
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{o.numero}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {o.cliente}
                </div>
              </div>
              <div className="text-sm font-semibold whitespace-nowrap">
                {formatCurrencyBRL(o.total)}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className={statusBadge[o.status]}>
                {statusLabel[o.status]}
              </Badge>
              <span>Entrega: {formatDateBR(o.entregaEm)}</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
