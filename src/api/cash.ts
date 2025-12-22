import { http } from "./client";

export type CashStatusResponse = {
  status: "open" | "closed";
  openedAt?: string;
  openingAmount?: number;
  operator?: string;
  entries?: Array<{ method: PaymentIntentMethod; amount: number }>;
};

export type OpenCashInput = {
  openingAmount: number;
  operator: string;
};

export type CloseCashInput = {
  cashCount: number;
  notes?: string;
};

type PaymentIntentMethod = "cash" | "card" | "pix";

export const cashApi = {
  status: () => http.get<CashStatusResponse>("/cash/status", { status: "closed" }),
  open: (input: OpenCashInput) =>
    http.post<CashStatusResponse>("/cash/open", input, { status: "open" }),
  close: (input: CloseCashInput) =>
    http.post<CashStatusResponse>("/cash/close", input, { status: "closed" }),
};
