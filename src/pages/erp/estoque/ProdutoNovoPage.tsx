import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import type { ProductType } from "@/mock";

const schema = z.object({
  sku: z.string().min(3, "Informe um SKU válido"),
  nome: z.string().min(3, "Informe o nome do produto"),
  tipo: z.enum(["flor", "cesta", "presente", "complemento"]),
  categoria: z.string().min(2, "Informe a categoria"),
  preco: z.coerce.number().positive("Preço deve ser maior que zero"),
  custo: z.coerce.number().min(0, "Custo deve ser >= 0"),
  estoqueMinimo: z.coerce.number().int().min(0, "Estoque mínimo deve ser >= 0"),
  ativo: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const tipoLabel: Record<ProductType, string> = {
  flor: "Flor",
  cesta: "Cesta",
  presente: "Presente",
  complemento: "Complemento",
};

export default function ProdutoNovoPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sku: "",
      nome: "",
      tipo: "flor",
      categoria: "Flores",
      preco: 0,
      custo: 0,
      estoqueMinimo: 0,
      ativo: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) =>
      api.products.create({
        sku: values.sku,
        nome: values.nome,
        tipo: values.tipo,
        categoria: values.categoria,
        preco: values.preco,
        custo: values.custo,
        estoqueMinimo: values.estoqueMinimo,
        ativo: values.ativo,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast("Produto criado", { description: "Registro mock adicionado." });
      navigate("/estoque/produtos");
    },
  });

  const errorCount = useMemo(
    () => Object.keys(form.formState.errors).length,
    [form.formState.errors],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Novo produto</h1>
        <p className="text-muted-foreground">
          Cadastro padrão com validação e submit simulado
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Dados do produto</CardTitle>
          <Button variant="outline" onClick={() => navigate("/estoque/produtos")}>
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
              className="grid gap-4 md:grid-cols-2"
              onSubmit={form.handleSubmit((values) =>
                createMutation.mutate(values),
              )}
            >
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: FLR-ROSA-VERM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Buquê 12 rosas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        {(Object.keys(tipoLabel) as ProductType[]).map((t) => (
                          <SelectItem key={t} value={t}>
                            {tipoLabel[t]}
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
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Flores" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="custo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custo (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estoqueMinimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque mínimo</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
                    <div className="space-y-0.5">
                      <FormLabel>Ativo</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Produtos inativos não aparecem em novos pedidos.
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Salvando…" : "Salvar produto"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
