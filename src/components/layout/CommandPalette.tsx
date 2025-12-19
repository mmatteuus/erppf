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
  BarChart3,
  DollarSign,
  LayoutDashboard,
  Package,
  Search,
  ShoppingCart,
  Users,
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
      <CommandInput placeholder="Digite um comando ou busque" />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Acoes rapidas">
          <CommandItem onSelect={() => runCommand(() => navigate("/pdv/sell"))}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Nova venda</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/pdv/payment"))}>
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Ir para pagamento</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/pdv/open"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Abrir caixa</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navegacao">
          <CommandItem onSelect={() => runCommand(() => navigate("/products"))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Produtos</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/customers"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Clientes</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/sales"))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Vendas realizadas</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/reports"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Relatorios</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
