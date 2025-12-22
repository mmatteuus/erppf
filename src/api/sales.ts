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
  list: () => http.get<Sale[]>("/sales", []),
  create: (input: NewSaleInput) => http.post<Sale | null>("/sales", input, null),
  payment: (input: PaymentInput) =>
    http.post<PaymentIntent | null>("/payments", input, null),
};
