import { ERPLayout } from "@/components/layout/ERPLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ForgotPassword from "@/pages/ForgotPassword";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

const DashboardPage = lazy(() => import("@/pages/erp/DashboardPage"));
const PedidosListPage = lazy(() => import("@/pages/erp/vendas/PedidosListPage"));
const PedidoNovoPage = lazy(() => import("@/pages/erp/vendas/PedidoNovoPage"));
const ProdutosListPage = lazy(() => import("@/pages/erp/estoque/ProdutosListPage"));
const ProdutoNovoPage = lazy(() => import("@/pages/erp/estoque/ProdutoNovoPage"));
const MovimentacoesPage = lazy(() => import("@/pages/erp/estoque/MovimentacoesPage"));
const ClientesPage = lazy(() => import("@/pages/erp/ClientesPage"));
const FornecedoresPage = lazy(() => import("@/pages/erp/FornecedoresPage"));
const ContasReceberPage = lazy(
  () => import("@/pages/erp/financeiro/ContasReceberPage"),
);
const ContasPagarPage = lazy(
  () => import("@/pages/erp/financeiro/ContasPagarPage"),
);
const RelatoriosPage = lazy(() => import("@/pages/erp/RelatoriosPage"));
const ConfiguracoesPage = lazy(() => import("@/pages/erp/ConfiguracoesPage"));

const queryClient = new QueryClient();

function RouteFallback() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className="h-56 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<ERPLayout />}>
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <DashboardPage />
                  </Suspense>
                }
              />

              <Route
                path="/vendas/pedidos"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <PedidosListPage />
                  </Suspense>
                }
              />
              <Route
                path="/vendas/pedidos/novo"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <PedidoNovoPage />
                  </Suspense>
                }
              />

              <Route
                path="/estoque/produtos"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <ProdutosListPage />
                  </Suspense>
                }
              />
              <Route
                path="/estoque/produtos/novo"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <ProdutoNovoPage />
                  </Suspense>
                }
              />
              <Route
                path="/estoque/movimentacoes"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <MovimentacoesPage />
                  </Suspense>
                }
              />

              <Route
                path="/clientes"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <ClientesPage />
                  </Suspense>
                }
              />
              <Route
                path="/fornecedores"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <FornecedoresPage />
                  </Suspense>
                }
              />

              <Route
                path="/financeiro/contas-a-receber"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <ContasReceberPage />
                  </Suspense>
                }
              />
              <Route
                path="/financeiro/contas-a-pagar"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <ContasPagarPage />
                  </Suspense>
                }
              />

              <Route
                path="/relatorios"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <RelatoriosPage />
                  </Suspense>
                }
              />
              <Route
                path="/configuracoes"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <ConfiguracoesPage />
                  </Suspense>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
