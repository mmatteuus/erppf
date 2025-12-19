import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  Flower2,
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
import { usePreferencesStore } from "@/store/preferences";

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

export function ERPSidebar() {
  const { sidebarCollapsed } = usePreferencesStore();
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>(["PDV", "Catalogo", "Clientes", "Vendas"]);

  if (sidebarCollapsed) return null;

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children?: { href: string }[]) =>
    children?.some((child) => location.pathname.startsWith(child.href));

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 border-r bg-sidebar h-screen sticky top-0">
      <div className="h-16 flex items-center gap-3 px-6 border-b">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <Flower2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">ERP PDV</h1>
          <p className="text-xs text-muted-foreground">Varejo fiscal</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <Collapsible
                  open={openItems.includes(item.title)}
                  onOpenChange={() => toggleItem(item.title)}
                >
                  <CollapsibleTrigger
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isParentActive(item.children)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        openItems.includes(item.title) && "rotate-180",
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-7 pt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={cn(
                          "block px-3 py-2 rounded-md text-sm transition-colors",
                          isActive(child.href)
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
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
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive(item.href!)
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-muted-foreground">Operador</p>
          </div>
        </div>
        <span className="mt-3 block text-xs font-medium text-primary">
          PDV seguro - LGPD ready
        </span>
      </div>
    </aside>
  );
}
