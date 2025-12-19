import { DataTable } from "@/components/data/DataTable";
import { DataTableColumnHeader } from "@/components/data/DataTableColumnHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatDateBR } from "@/lib/format";
import type { MovementType, StockMovement } from "@/mock";
import { api } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const typeLabel: Record<MovementType, string> = {
  entrada: "Entrada",
  saida: "Saída",
  ajuste: "Ajuste",
};

const typeBadge: Record<MovementType, string> = {
  entrada: "badge-success",
  saida: "badge-danger",
  ajuste: "badge-warning",
};

export default function MovimentacoesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const movementsQuery = useQuery({
    queryKey: ["movements"],
    queryFn: api.movements.list,
  });

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: api.products.list,
  });

  const movementSchema = z.object({
    tipo: z.enum(["entrada", "saida", "ajuste"]),
    productId: z.string().min(1, "Selecione um produto"),
    quantidade: z.coerce.number().int().positive("Qtd. deve ser > 0"),
    motivo: z.string().min(3, "Informe um motivo"),
  });

  type MovementFormValues = z.infer<typeof movementSchema>;

  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementSchema),
    defaultValues: { tipo: "entrada", productId: "", quantidade: 1, motivo: "" },
  });

  const createMutation = useMutation({
    mutationFn: async (values: MovementFormValues) => {
      const products = productsQuery.data ?? [];
      const product = products.find((p) => p.id === values.productId);
      if (!product) throw new Error("Produto inválido");

      return api.movements.create({
        tipo: values.tipo,
        productId: product.id,
        sku: product.sku,
        produto: product.nome,
        quantidade: values.quantidade,
        motivo: values.motivo,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["movements"] });
      toast("Movimentação registrada", { description: "Registro mock adicionado." });
      form.reset({ tipo: "entrada", productId: "", quantidade: 1, motivo: "" });
      setOpen(false);
    },
  });

  const typeFilter: FilterFn<StockMovement> = (row, id, value) => {
    if (!value) return true;
    return String(row.getValue(id)) === value;
  };

  const columns: ColumnDef<StockMovement>[] = [
    {
      accessorKey: "criadoEm",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data" />
      ),
      cell: ({ getValue }) => formatDateBR(getValue() as string),
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
          { label: "Entrada", value: "entrada" },
          { label: "Saída", value: "saida" },
          { label: "Ajuste", value: "ajuste" },
        ],
      },
      filterFn: typeFilter,
      cell: ({ getValue }) => {
        const t = getValue() as MovementType;
        return (
          <Badge variant="outline" className={typeBadge[t]}>
            {typeLabel[t]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "produto",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Produto" />
      ),
      meta: { label: "Produto", filterVariant: "text" },
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-medium truncate">{row.original.produto}</div>
          <div className="text-xs text-muted-foreground truncate">{row.original.sku}</div>
        </div>
      ),
    },
    {
      accessorKey: "quantidade",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Qtd." />
      ),
    },
    {
      accessorKey: "motivo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Motivo" />
      ),
      meta: { label: "Motivo", filterVariant: "text" },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Movimentações</h1>
          <p className="text-muted-foreground">Entradas, saídas e ajustes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova movimentação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Registrar movimentação</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={form.handleSubmit((values) =>
                  createMutation.mutate(values),
                )}
              >
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entrada">Entrada</SelectItem>
                          <SelectItem value="saida">Saída</SelectItem>
                          <SelectItem value="ajuste">Ajuste</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Produto</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um produto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(productsQuery.data ?? [])
                            .filter((p) => p.ativo)
                            .map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.nome} ({p.sku})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motivo"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Motivo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex.: Compra, ajuste, devolução…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Salvando…" : "Registrar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable<StockMovement>
        data={movementsQuery.data ?? []}
        loading={movementsQuery.isLoading}
        columns={columns}
        globalFilterPlaceholder="Buscar por produto, SKU, motivo…"
        getRowId={(row) => row.id}
        mobileCard={(m) => (
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{m.produto}</div>
                <div className="text-xs text-muted-foreground truncate">{m.sku}</div>
              </div>
              <div className="text-sm font-semibold whitespace-nowrap">
                {m.quantidade}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <Badge variant="outline" className={typeBadge[m.tipo]}>
                {typeLabel[m.tipo]}
              </Badge>
              <span>{formatDateBR(m.criadoEm)}</span>
            </div>
          </div>
        )}
      />
    </div>
  );
}
