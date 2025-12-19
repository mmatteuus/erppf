import { http } from "./client";
import type { PaymentIntent, PaymentMethod } from "@/types/domain";

export type PaymentIntentInput = {
  paymentUid: string;
  saleId: string;
  method: PaymentMethod;
  amount: number;
};

export const paymentsApi = {
  intent: (input: PaymentIntentInput) =>
    http.post<PaymentIntent | null>("/payments", input, null),
  status: (id: string) =>
    http.get<PaymentIntent | null>(`/payments/${id}`, null),
};
