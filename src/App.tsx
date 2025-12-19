import { ERPLayout } from "@/components/layout/ERPLayout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ForgotPassword from "@/pages/ForgotPassword";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import OpenCash from "@/pages/pdv/OpenCash";
import Sell from "@/pages/pdv/Sell";
import Payment from "@/pages/pdv/Payment";
import CloseCash from "@/pages/pdv/CloseCash";
import Products from "@/pages/Products";
import Customers from "@/pages/Customers";
import Sales from "@/pages/Sales";
import Reports from "@/pages/Reports";

const queryClient = new QueryClient();

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
            <Route path="/" element={<Navigate to="/pdv/sell" replace />} />

            <Route element={<ERPLayout />}>
              <Route path="/pdv/open" element={<OpenCash />} />
              <Route path="/pdv/sell" element={<Sell />} />
              <Route path="/pdv/payment" element={<Payment />} />
              <Route path="/pdv/close" element={<CloseCash />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/reports" element={<Reports />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
