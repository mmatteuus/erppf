import { http } from "./client";
import type { PaymentIntent, Sale } from "@/types/domain";

export type NewSaleInput = {
  saleUid: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
  }>;
  customerId?: string;
  total: number;
};

export type PaymentInput = {
  paymentUid: string;
  saleId: string;
  method: PaymentIntent["method"];
  amount: number;
};

export const salesApi = {
  list: (params?: { from?: string; to?: string; status?: Sale["status"] }) => {
    const query = new URLSearchParams();
    if (params?.from) query.set("from", params.from);
    if (params?.to) query.set("to", params.to);
    if (params?.status) query.set("status", params.status);
    const qs = query.toString();
    const path = qs ? `/sales?${qs}` : "/sales";
    return http.get<Sale[]>(path, []);
  },
  create: (input: NewSaleInput) => http.post<Sale | null>("/sales", input, null),
  payment: (input: PaymentInput) =>
    http.post<PaymentIntent | null>("/payments", input, null),
};
