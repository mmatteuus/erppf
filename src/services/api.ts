import { fakeDb } from "./fakeDb";
import type {
  Customer,
  Invoice,
  Order,
  Product,
  StockMovement,
  Vendor,
} from "@/mock";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function simulate<T>(fn: () => T, ms = 650): Promise<T> {
  await delay(ms);
  return fn();
}

export const api = {
  products: {
    list: () => simulate<Product[]>(() => fakeDb.products.list()),
    create: (input: Omit<Product, "id" | "criadoEm">) =>
      simulate<Product>(() => fakeDb.products.create(input)),
    update: (id: string, patch: Partial<Omit<Product, "id" | "criadoEm">>) =>
      simulate<Product | null>(() => fakeDb.products.update(id, patch)),
    remove: (id: string) => simulate<boolean>(() => fakeDb.products.remove(id)),
  },

  customers: {
    list: () => simulate<Customer[]>(() => fakeDb.customers.list()),
    create: (input: Omit<Customer, "id" | "criadoEm">) =>
      simulate<Customer>(() => fakeDb.customers.create(input)),
  },

  vendors: {
    list: () => simulate<Vendor[]>(() => fakeDb.vendors.list()),
    create: (input: Omit<Vendor, "id" | "criadoEm">) =>
      simulate<Vendor>(() => fakeDb.vendors.create(input)),
  },

  orders: {
    list: () => simulate<Order[]>(() => fakeDb.orders.list()),
    create: (input: Omit<Order, "id" | "numero" | "criadoEm" | "total">) =>
      simulate<Order>(() => fakeDb.orders.create(input), 900),
    update: (id: string, patch: Partial<Omit<Order, "id" | "numero" | "criadoEm">>) =>
      simulate<Order | null>(() => fakeDb.orders.update(id, patch)),
  },

  movements: {
    list: () => simulate<StockMovement[]>(() => fakeDb.movements.list()),
    create: (input: Omit<StockMovement, "id" | "criadoEm">) =>
      simulate<StockMovement>(() => fakeDb.movements.create(input), 850),
  },

  stock: {
    listBalances: () => simulate(() => fakeDb.stock.listBalances()),
  },

  invoices: {
    list: () => simulate<Invoice[]>(() => fakeDb.invoices.list()),
    update: (id: string, patch: Partial<Omit<Invoice, "id" | "criadoEm">>) =>
      simulate<Invoice | null>(() => fakeDb.invoices.update(id, patch)),
  },

  db: {
    reset: () => simulate(() => fakeDb.reset(), 350),
  },
};
