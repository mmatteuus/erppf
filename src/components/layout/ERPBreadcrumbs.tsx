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
  dashboard: "Dashboard",
  vendas: "Vendas",
  pedidos: "Pedidos",
  novo: "Novo",
  estoque: "Estoque",
  produtos: "Produtos",
  movimentacoes: "Movimentações",
  clientes: "Clientes",
  fornecedores: "Fornecedores",
  financeiro: "Financeiro",
  "contas-a-receber": "Contas a receber",
  "contas-a-pagar": "Contas a pagar",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
};

function titleForSegment(segment: string) {
  return LABELS[segment] ?? segment.replace(/-/g, " ");
}

export function ERPBreadcrumbs() {
  const location = useLocation();

  const crumbs = useMemo(() => {
    const raw = location.pathname.split("/").filter(Boolean);
    const segments = raw.length ? raw : ["dashboard"];

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
              <Link to="/dashboard">Vila Bella</Link>
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
