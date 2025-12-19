import { http } from "./client";
import type { Customer } from "@/types/domain";

export type CustomerInput = {
  name: string;
  document?: string;
  email?: string;
  phone?: string;
};

export const customersApi = {
  list: () => http.get<Customer[]>("/customers", []),
  create: (input: CustomerInput) =>
    http.post<Customer | null>("/customers", input, null),
};
