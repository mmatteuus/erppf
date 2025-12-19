import { DataTable } from "@/components/data/DataTable";
import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Customer } from "@/mock";
import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast } from "sonner";

export default function ClientesPage() {
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: api.customers.list,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      api.customers.create({
        nome: "Novo cliente (demo)",
        cidade: "São Paulo",
        tags: ["Novo"],
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cliente" />
      ),
      meta: { label: "Cliente", filterVariant: "text" },
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-medium truncate">{row.original.nome}</div>
          <div className="text-xs text-muted-foreground truncate">
            {row.original.email ?? "—"} • {row.original.telefone ?? "—"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "cidade",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cidade" />
      ),
      meta: {
        label: "Cidade",
        filterVariant: "select",
        options: [
          { label: "São Paulo", value: "São Paulo" },
          { label: "Santo André", value: "Santo André" },
        ],
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      enableSorting: false,
      cell: ({ getValue }) => {
        const tags = (getValue() as string[]) ?? [];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.length === 0 ? (
              <span className="text-muted-foreground text-sm">—</span>
            ) : (
              tags.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => (
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
                toast("Editar (demo)", { description: row.original.nome })
              }
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() =>
                toast("Excluir (demo)", {
                  description: "A remoção pode ser ligada no próximo sprint.",
                })
              }
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Base de clientes e segmentação</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            createMutation.mutate();
            toast("Cliente criado", { description: "Registro mock adicionado." });
          }}
          disabled={createMutation.isPending}
        >
          <Plus className="h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      <DataTable<Customer>
        data={customersQuery.data ?? []}
        loading={customersQuery.isLoading}
        columns={columns}
        globalFilterPlaceholder="Buscar por nome, email…"
        getRowId={(row) => row.id}
        mobileCard={(c) => (
          <div className="space-y-2">
            <div className="font-medium">{c.nome}</div>
            <div className="text-xs text-muted-foreground">
              {c.email ?? "—"} • {c.telefone ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground">{c.cidade}</div>
          </div>
        )}
      />
    </div>
  );
}
