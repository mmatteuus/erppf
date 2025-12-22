import { mockDb } from "@/lib/mockDb";

type HttpMethod = "GET" | "POST" | "PATCH";

export const apiMode = {
  mode: "mock" as const,
};

export async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
): Promise<T> {
  // Simple router to mockDb
  if (path.startsWith("/products")) {
    if (method === "GET") return mockDb.listProducts() as unknown as T;
    if (method === "POST") return mockDb.createProduct(body as any) as unknown as T;
    if (method === "PATCH") {
      const [, , id] = path.split("/");
      return mockDb.updateProduct(id, body as any) as unknown as T;
    }
  }
  if (path.startsWith("/customers")) {
    if (method === "GET") return mockDb.listCustomers() as unknown as T;
    if (method === "POST") return mockDb.createCustomer(body as any) as unknown as T;
  }
  if (path.startsWith("/sales")) {
    if (method === "GET") return mockDb.listSales() as unknown as T;
    if (method === "POST") return mockDb.createSale(body as any) as unknown as T;
    if (method === "PATCH") {
      const [, , id] = path.split("/");
      return mockDb.updateSale(id, body as any) as unknown as T;
    }
  }
  if (path.startsWith("/cash/status")) {
    return mockDb.cashStatus() as unknown as T;
  }
  if (path.startsWith("/cash/open")) {
    return mockDb.openCash(body as any) as unknown as T;
  }
  if (path.startsWith("/cash/close")) {
    return mockDb.closeCash() as unknown as T;
  }
  throw new Error(`Mock API path not handled: ${method} ${path}`);
}
