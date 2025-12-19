import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Customer, Product } from "@/mock";
import { formatCurrencyBRL } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";

const schema = z.object({
  customerId: z.string().min(1, "Selecione um cliente"),
  entregaEm: z.string().min(10, "Informe a data de entrega"),
  itens: z
    .array(
      z.object({
        productId: z.string().min(1, "Selecione um produto"),
        quantidade: z.coerce.number().int().positive("Qtd. deve ser > 0"),
      }),
    )
    .min(1, "Adicione ao menos 1 item"),
});

type FormValues = z.infer<typeof schema>;

function toIsoDate(dateInputValue: string) {
  return new Date(`${dateInputValue}T00:00:00`).toISOString();
}

export default function PedidoNovoPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: api.customers.list,
  });

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: api.products.list,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerId: "",
      entregaEm: new Date().toISOString().slice(0, 10),
      itens: [{ productId: "", quantidade: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const customers = customersQuery.data ?? [];
      const products = productsQuery.data ?? [];

      const customer = customers.find((c) => c.id === values.customerId);
      if (!customer) throw new Error("Cliente inválido");

      const itens = values.itens.map((i) => {
        const product = products.find((p) => p.id === i.productId);
        if (!product) throw new Error("Produto inválido");
        return {
          productId: product.id,
          sku: product.sku,
          nome: product.nome,
          quantidade: i.quantidade,
          precoUnitario: product.preco,
        };
      });

      return api.orders.create({
        customerId: customer.id,
        cliente: customer.nome,
        status: "novo",
        entregaEm: toIsoDate(values.entregaEm),
        itens,
      });
    },
    onSuccess: async (order) => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast("Pedido criado", { description: order.numero });
      navigate("/vendas/pedidos");
    },
  });

  const totalPreview = useMemo(() => {
    const products = productsQuery.data ?? [];
    const itens = form.watch("itens");
    return itens.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + product.preco * (item.quantidade || 0);
    }, 0);
  }, [form, productsQuery.data]);

  const errorCount = useMemo(
    () => Object.keys(form.formState.errors).length,
    [form.formState.errors],
  );

  const customers = customersQuery.data ?? [];
  const products = (productsQuery.data ?? []).filter((p) => p.ativo);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo pedido</h1>
        <p className="text-muted-foreground">
          Criação de pedido com itens (React Hook Form + Zod)
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Dados do pedido</CardTitle>
          <Button variant="outline" onClick={() => navigate("/vendas/pedidos")}>
            Voltar
          </Button>
        </CardHeader>
        <CardContent>
          {errorCount > 0 && (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              Corrija {errorCount} campo(s) antes de salvar.
            </div>
          )}

          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit((values) =>
                createMutation.mutate(values),
              )}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((c: Customer) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.nome}
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
                  name="entregaEm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de entrega</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">Itens</div>
                    <div className="text-sm text-muted-foreground">
                      Adicione produtos e quantidades
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => append({ productId: "", quantidade: 1 })}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar item
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((f, index) => (
                    <div key={f.id} className="rounded-lg border p-4">
                      <div className="grid gap-4 md:grid-cols-6 md:items-end">
                        <FormField
                          control={form.control}
                          name={`itens.${index}.productId`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-4">
                              <FormLabel>Produto</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um produto" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {products.map((p: Product) => (
                                    <SelectItem key={p.id} value={p.id}>
                                      {p.nome} ({formatCurrencyBRL(p.preco)})
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
                          name={`itens.${index}.quantidade`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <FormLabel>Qtd.</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" step="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          className="md:col-span-1 justify-start text-destructive"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Total (prévia):{" "}
                  <span className="font-semibold text-foreground">
                    {formatCurrencyBRL(totalPreview)}
                  </span>
                </div>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Salvando…" : "Salvar pedido"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
