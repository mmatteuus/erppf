import { http } from "./client";
import type { Product } from "@/types/domain";

export type ProductInput = {
  name: string;
  sku?: string;
  price: number;
  family?: string;
  category?: string;
  stock?: number;
};

export const productsApi = {
  list: () => http.get<Product[]>("/products", []),
  create: (input: ProductInput) =>
    http.post<Product | null>("/products", input, null),
  update: (id: string, input: Partial<ProductInput>) =>
    http.patch<Product | null>(`/products/${id}`, input, null),
};
