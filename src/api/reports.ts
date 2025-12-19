import { http } from "./client";

export type ReportSummary = {
  salesTotal: number;
  paymentsTotal: number;
  nfcePending: number;
  nfceRejected: number;
};

export type SalesReportRow = {
  date: string;
  sales: number;
  tickets: number;
};

export const reportsApi = {
  summary: () =>
    http.get<ReportSummary>("/reports/summary", {
      salesTotal: 0,
      paymentsTotal: 0,
      nfcePending: 0,
      nfceRejected: 0,
    }),
  salesByDay: () => http.get<SalesReportRow[]>("/reports/sales", []),
};
