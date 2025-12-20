import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  Flower2,
  LayoutDashboard,
  MessageSquare,
  ShoppingCart,
  Users,
  Warehouse,
  Wallet,
  BadgeDollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMemo, useState } from "react";
import { usePreferencesStore } from "@/store/preferences";
import { useAuthStore } from "@/store/auth";
import type { Permission } from "@/store/auth";

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  required?: Permission;
  children?: { title: string; href: string; required?: Permission }[];
}

const navItems: NavItem[] = [
  { title: "Home", href: "/pdv/sell", icon: LayoutDashboard, required: "PDV_OPERATE" },
  {
    title: "PDV",
    icon: ShoppingCart,
    required: "PDV_OPERATE",
    children: [
      { title: "Abrir caixa", href: "/pdv/open", required: "CASH_OPEN_CLOSE" },
      { title: "Venda", href: "/pdv/sell", required: "PDV_OPERATE" },
      { title: "Pagamento", href: "/pdv/payment", required: "PDV_OPERATE" },
      { title: "Fechar caixa", href: "/pdv/close", required: "CASH_OPEN_CLOSE" },
    ],
  },
  {
    title: "Catalogo",
    icon: Warehouse,
    required: "CATALOG_VIEW",
    children: [
      { title: "Produtos", href: "/products", required: "CATALOG_VIEW" },
      { title: "Precificacao", href: "/pricing", required: "PRICING_TOOL", icon: BadgeDollarSign },
    ],
  },
  {
    title: "Clientes",
    icon: Users,
    required: "CATALOG_VIEW",
    children: [{ title: "Clientes", href: "/customers", required: "CATALOG_VIEW" }],
  },
  {
    title: "Vendas",
    icon: Wallet,
    required: "PDV_OPERATE",
    children: [{ title: "Historico", href: "/sales", required: "PDV_OPERATE" }],
  },
  { title: "Relatorios", href: "/reports", icon: BarChart3 },
  { title: "Chat", href: "/chat", icon: MessageSquare, required: "CHAT_INTERNAL" },
];

export function ERPSidebar() {
  const { sidebarCollapsed } = usePreferencesStore();
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const { user, hasPermission } = useAuthStore();

  if (sidebarCollapsed) return null;

  const toggleItem = (title: string) => {
    setOpenItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isParentActive = (children?: { href: string }[]) =>
    children?.some((child) => location.pathname.startsWith(child.href));

  const visibleNav = useMemo(
    () =>
      navItems
        .filter((item) => !item.required || hasPermission(item.required))
        .map((item) => ({
          ...item,
          children: item.children?.filter((child) => !child.required || hasPermission(child.required)),
        }))
        .filter((item) => !item.children || item.children.length > 0),
    [hasPermission],
  );

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
          {visibleNav.map((item) => (
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
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Nao autenticado</p>
        )}
        <span className="mt-3 block text-xs font-medium text-primary">
          PDV seguro - LGPD ready
        </span>
      </div>
    </aside>
  );
}
