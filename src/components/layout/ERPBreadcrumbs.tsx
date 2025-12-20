import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

const LABELS: Record<string, string> = {
  pdv: "PDV",
  open: "Abrir caixa",
  sell: "Venda",
  payment: "Pagamento",
  close: "Fechar caixa",
  products: "Produtos",
  customers: "Clientes",
  sales: "Vendas",
  reports: "Relatorios",
};

function titleForSegment(segment: string) {
  return LABELS[segment] ?? segment.replace(/-/g, " ");
}

export function ERPBreadcrumbs() {
  const location = useLocation();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const crumbs = useMemo(() => {
    const raw = location.pathname.split("/").filter(Boolean);
    const base = raw.length ? raw : ["pdv", "sell"];
    return base
      .map((segment, index) => {
        const href = `/${base.slice(0, index + 1).join("/")}`;
        return { segment, href, label: titleForSegment(segment), skip: index === 0 && segment === "pdv" };
      })
      .filter((item) => !item.skip);
  }, [location.pathname]);

  if (crumbs.length <= 1) return null;

  return (
    <div className="mb-4 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/pdv/sell">PDV</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <Fragment key={crumb.href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-wrap gap-2">
          <QuickLink href="/pdv/sell" label="PDV" visible />
          <QuickLink href="/pdv/payment" label="Pagamento" visible={hasPermission("PDV_OPERATE")} />
          <QuickLink href="/products" label="Produtos" visible={hasPermission("CATALOG_VIEW")} />
          <QuickLink href="/customers" label="Clientes" visible={hasPermission("CATALOG_VIEW")} />
          <QuickLink href="/sales" label="Vendas" visible={hasPermission("PDV_OPERATE")} />
          <QuickLink href="/pricing" label="Precificacao" visible={hasPermission("PRICING_TOOL")} />
          <QuickLink href="/reports" label="Relatorios" visible />
          <QuickLink href="/chat" label="Chat" visible={hasPermission("CHAT_INTERNAL")} />
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, label, visible }: { href: string; label: string; visible?: boolean }) {
  if (visible === false) return null;
  return (
    <Button asChild size="sm" variant="outline">
      <Link to={href}>{label}</Link>
    </Button>
  );
}
