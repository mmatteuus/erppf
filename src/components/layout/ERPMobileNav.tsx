import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  LayoutDashboard,
  ShoppingCart,
  Users,
  Warehouse,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: "Home", href: "/pdv/sell", icon: LayoutDashboard },
  {
    title: "PDV",
    icon: ShoppingCart,
    children: [
      { title: "Abrir caixa", href: "/pdv/open" },
      { title: "Venda", href: "/pdv/sell" },
      { title: "Pagamento", href: "/pdv/payment" },
      { title: "Fechar caixa", href: "/pdv/close" },
    ],
  },
  {
    title: "Catalogo",
    icon: Warehouse,
    children: [{ title: "Produtos", href: "/products" }],
  },
  {
    title: "Clientes",
    icon: Users,
    children: [{ title: "Clientes", href: "/customers" }],
  },
  {
    title: "Vendas",
    icon: Wallet,
    children: [{ title: "Historico", href: "/sales" }],
  },
  { title: "Relatorios", href: "/reports", icon: BarChart3 },
];

export function ERPMobileNav() {
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <nav className="py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <Collapsible
                  open={openItems.includes(item.title)}
                  onOpenChange={() => toggleItem(item.title)}
                >
                  <CollapsibleTrigger className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-muted/50">
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        openItems.includes(item.title) && "rotate-180",
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8 pt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={cn(
                          "block px-3 py-2.5 rounded-md text-sm transition-colors",
                          isActive(child.href)
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href!)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted/50",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}
