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

  const crumbs = useMemo(() => {
    const raw = location.pathname.split("/").filter(Boolean);
    const segments = raw.length ? raw : ["pdv", "sell"];

    return segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      return { segment, href, label: titleForSegment(segment) };
    });
  }, [location.pathname]);

  if (crumbs.length <= 1) return null;

  return (
    <div className="mb-4">
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
    </div>
  );
}
