import type { Product, Customer, Sale, PaymentIntent } from "@/types/domain";

type CashState = {
  status: "open" | "closed";
  openedAt?: string;
  openingAmount?: number;
  operator?: string;
  entries: Array<{ method: PaymentIntent["method"]; amount: number }>;
};

type DbState = {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  cash: CashState;
};

const STORAGE_KEY = "provenca-mockdb-v1";

function nowIso() {
  return new Date().toISOString();
}

function loadState(): DbState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seed();
  try {
    const parsed = JSON.parse(raw) as DbState;
    if (!parsed.products || !parsed.customers || !parsed.sales || !parsed.cash) return seed();
    return parsed;
  } catch {
    return seed();
  }
}

function saveState(next: DbState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function seed(): DbState {
  const products: Product[] = [
    {
      id: "p-001",
      name: "Rosa Vermelha",
      sku: "789000000001",
      price: 29.9,
      cost: 10,
      stock: 42,
    },
    {
      id: "p-002",
      name: "Buque Primavera",
      sku: "789000000002",
      price: 89.9,
      cost: 35,
      stock: 10,
    },
  ];

  const customers: Customer[] = [
    { id: "c-001", name: "Maria Silva", document: "12345678900", phone1: "11999990000" },
    { id: "c-002", name: "Joao Souza", document: "98765432100", phone1: "11911112222" },
  ];

  return {
    products,
    customers,
    sales: [],
    cash: { status: "closed", entries: [] },
  };
}

export const mockDb = {
  listProducts(): Product[] {
    return loadState().products;
  },
  createProduct(input: Partial<Product>): Product {
    const state = loadState();
    const product: Product = {
      id: input.id ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10),
      name: input.name ?? "Produto",
      sku: input.sku,
      price: input.price ?? 0,
      cost: input.cost,
      stock: input.stock ?? 0,
      family: input.family,
      category: input.category,
      pricing: input.pricing,
      tax: input.tax,
    };
    const next = { ...state, products: [product, ...state.products] };
    saveState(next);
    return product;
  },
  updateProduct(id: string, patch: Partial<Product>): Product | null {
    const state = loadState();
    const current = state.products.find((p) => p.id === id);
    if (!current) return null;
    const updated = { ...current, ...patch };
    const next = { ...state, products: state.products.map((p) => (p.id === id ? updated : p)) };
    saveState(next);
    return updated;
  },
  listCustomers(): Customer[] {
    return loadState().customers;
  },
  createCustomer(input: Partial<Customer>): Customer {
    const state = loadState();
    const customer: Customer = {
      id: input.id ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10),
      name: input.name ?? "Cliente",
      document: input.document,
      email: input.email,
      address: input.address,
      phone1: input.phone1,
      phone2: input.phone2,
    };
    const next = { ...state, customers: [customer, ...state.customers] };
    saveState(next);
    return customer;
  },
  listSales(): Sale[] {
    return loadState().sales;
  },
  createSale(input: {
    id?: string;
    total: number;
    customerName?: string;
    status?: Sale["status"];
  }): Sale {
    const state = loadState();
    const sale: Sale = {
      id: input.id ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10),
      number: `S-${state.sales.length + 1}`.padStart(6, "0"),
      total: input.total,
      status: input.status ?? "pending",
      paymentStatus: "pending",
      createdAt: nowIso(),
      customerName: input.customerName,
    };
    const next = { ...state, sales: [sale, ...state.sales] };
    saveState(next);
    return sale;
  },
  updateSale(id: string, patch: Partial<Sale>): Sale | null {
    const state = loadState();
    const current = state.sales.find((s) => s.id === id);
    if (!current) return null;
    const updated = { ...current, ...patch };
    const next = { ...state, sales: state.sales.map((s) => (s.id === id ? updated : s)) };
    saveState(next);
    return updated;
  },
  cashStatus(): CashState {
    return loadState().cash;
  },
  openCash(input: { openingAmount: number; operator: string }): CashState {
    const state = loadState();
    const cash: CashState = {
      status: "open",
      openedAt: nowIso(),
      openingAmount: input.openingAmount,
      operator: input.operator,
      entries: [],
    };
    const next = { ...state, cash };
    saveState(next);
    return cash;
  },
  closeCash(): CashState {
    const state = loadState();
    const cash: CashState = { status: "closed", entries: [] };
    const next = { ...state, cash };
    saveState(next);
    return cash;
  },
  addCashEntry(entry: { method: PaymentIntent["method"]; amount: number }) {
    const state = loadState();
    const cash = state.cash.status === "open" ? state.cash : { status: "open", entries: [] };
    const nextCash = { ...cash, entries: [...(cash.entries ?? []), entry] };
    saveState({ ...state, cash: nextCash });
    return nextCash;
  },
  reset() {
    const seeded = seed();
    saveState(seeded);
    return seeded;
  },
};
