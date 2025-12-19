import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { customersApi } from "@/api/customers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { Customer } from "@/types/domain";

export default function Customers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: customers = [], isFetching } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: customersApi.list,
  });

  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");

  const filtered = customers.filter((customer) => {
    const term = filter.toLowerCase();
    return (
      customer.name.toLowerCase().includes(term) ||
      (customer.document ? customer.document.includes(filter) : false)
    );
  });

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    await customersApi.create({ name, document, phone });
    toast({ title: "Cliente cadastrado (stub)", description: "Integre com API para persistir." });
    setOpen(false);
    setName("");
    setDocument("");
    setPhone("");
    queryClient.invalidateQueries({ queryKey: ["customers"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Clientes</h2>
          <p className="text-sm text-muted-foreground">Selecione clientes para a venda</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo cliente</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar cliente</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doc">CPF/CNPJ</Label>
                <Input id="doc" value={document} onChange={(e) => setDocument(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista</CardTitle>
          <CardDescription>Busca por nome ou documento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Buscar cliente"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="space-y-2">
            {isFetching && <p className="text-sm text-muted-foreground">Carregando...</p>}
            {filtered.length === 0 && !isFetching ? (
              <p className="text-sm text-muted-foreground">Nenhum cliente encontrado.</p>
            ) : (
              filtered.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between border rounded-md px-2 py-2">
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {customer.document || "Sem documento"} {customer.phone ? `· ${customer.phone}` : ""}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Selecionar
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
