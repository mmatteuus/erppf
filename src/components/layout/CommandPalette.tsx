import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DollarSign,
  FileText,
  LayoutDashboard,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const runCommand = (command: () => void) => {
    onOpenChange(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Digite um comando ou busque…" />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Ações rápidas">
          <CommandItem
            onSelect={() => runCommand(() => navigate("/vendas/pedidos/novo"))}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Novo pedido</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate("/estoque/produtos/novo"))}
          >
            <Package className="mr-2 h-4 w-4" />
            <span>Novo produto</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/clientes"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Buscar cliente</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate("/estoque/produtos"))}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Consultar produtos</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate("/vendas/pedidos"))}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Pedidos</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate("/estoque/movimentacoes"))}
          >
            <Warehouse className="mr-2 h-4 w-4" />
            <span>Movimentações</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => navigate("/financeiro/contas-a-receber"))
            }
          >
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Contas a receber</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate("/relatorios"))}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Relatórios</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

