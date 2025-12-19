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
import { formatCurrencyBRL } from "@/lib/format";
import type { Product } from "@/mock";
import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";

const tipoLabel: Record<Product["tipo"], string> = {
  flor: "Flor",
  cesta: "Cesta",
  presente: "Presente",
  complemento: "Complemento",
};

export default function ProdutosListPage() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: api.products.list,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => api.products.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const duplicateMutation = useMutation({
    mutationFn: async (product: Product) => {
      const copy = await api.products.create({
        sku: `${product.sku}-COPIA`,
        nome: `${product.nome} (cópia)`,
        tipo: product.tipo,
        categoria: product.categoria,
        preco: product.preco,
        custo: product.custo,
        ativo: false,
        estoqueMinimo: product.estoqueMinimo,
      });
      return copy;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const ativoFilter: FilterFn<Product> = (row, id, value) => {
    if (!value) return true;
    return String(row.getValue(id)) === value;
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SKU" />
      ),
      meta: { label: "SKU", filterVariant: "text", placeholder: "Ex.: FLR-" },
    },
    {
      accessorKey: "nome",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produto" />
      ),
      meta: { label: "Produto", filterVariant: "text" },
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-medium truncate">{row.original.nome}</div>
          <div className="text-xs text-muted-foreground truncate">
            {row.original.categoria}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "tipo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tipo" />
      ),
      meta: {
        label: "Tipo",
        filterVariant: "select",
        options: [
          { label: "Flor", value: "flor" },
          { label: "Cesta", value: "cesta" },
          { label: "Presente", value: "presente" },
          { label: "Complemento", value: "complemento" },
        ],
      },
      cell: ({ getValue }) => tipoLabel[getValue() as Product["tipo"]],
    },
    {
      accessorKey: "preco",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Preço" />
      ),
      cell: ({ getValue }) => formatCurrencyBRL(getValue() as number),
    },
    {
      accessorKey: "ativo",
      header: "Ativo",
      meta: {
        label: "Ativo",
        filterVariant: "select",
        options: [
          { label: "Sim", value: "true" },
          { label: "Não", value: "false" },
        ],
      },
      cell: ({ getValue }) => ((getValue() as boolean) ? "Sim" : "Não"),
      filterFn: ativoFilter,
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original as Product;
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
                  toast("Editar (demo)", {
                    description: "Tela de edição pode ser adicionada no próximo sprint.",
                  })
                }
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  duplicateMutation.mutate(product);
                  toast("Produto duplicado", { description: product.nome });
                }}
              >
                Duplicar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  removeMutation.mutate(product.id);
                  toast("Produto excluído", { description: product.nome });
                }}
              >
                Excluir
              </DropdownMenuItem>
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
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Catálogo de flores, cestas e presentes
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/estoque/produtos/novo">
            <Plus className="h-4 w-4" />
            Novo produto
          </Link>
        </Button>
      </div>

      <DataTable<Product>
        data={productsQuery.data ?? []}
        loading={productsQuery.isLoading}
        columns={columns}
        globalFilterPlaceholder="Buscar por SKU, produto, categoria…"
        getRowId={(row) => row.id}
        mobileCard={(p) => (
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{p.nome}</div>
                <div className="text-xs text-muted-foreground">{p.sku}</div>
              </div>
              <div className="text-sm font-semibold whitespace-nowrap">
                {formatCurrencyBRL(p.preco)}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {tipoLabel[p.tipo]} • {p.categoria} • {p.ativo ? "Ativo" : "Inativo"}
            </div>
          </div>
        )}
      />
    </div>
  );
}
