import type {
  Customer,
  Invoice,
  Order,
  Product,
  StockMovement,
  Vendor,
} from "@/mock";
import {
  customers as seedCustomers,
  invoices as seedInvoices,
  movements as seedMovements,
  orders as seedOrders,
  products as seedProducts,
  stockBalances as seedStockBalances,
  vendors as seedVendors,
} from "@/mock";

type DbState = {
  products: Product[];
  customers: Customer[];
  vendors: Vendor[];
  orders: Order[];
  movements: StockMovement[];
  stockBalances: Array<{
    productId: string;
    sku: string;
    produto: string;
    saldo: number;
  }>;
  invoices: Invoice[];
};

const STORAGE_KEY = "erpvilabella-db-v1";

function nowIso() {
  return new Date().toISOString();
}

function safeParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function seedState(): DbState {
  return {
    products: seedProducts,
    customers: seedCustomers,
    vendors: seedVendors,
    orders: seedOrders,
    movements: seedMovements,
    stockBalances: seedStockBalances,
    invoices: seedInvoices,
  };
}

function loadState(): DbState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedState();
  const parsed = safeParse(raw);
  if (!parsed || typeof parsed !== "object") return seedState();
  const candidate = parsed as Partial<DbState>;
  if (!Array.isArray(candidate.products)) return seedState();
  if (!Array.isArray(candidate.customers)) return seedState();
  if (!Array.isArray(candidate.vendors)) return seedState();
  if (!Array.isArray(candidate.orders)) return seedState();
  if (!Array.isArray(candidate.movements)) return seedState();
  if (!Array.isArray(candidate.stockBalances)) return seedState();
  if (!Array.isArray(candidate.invoices)) return seedState();
  return candidate as DbState;
}

function saveState(state: DbState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function nextOrderNumber(orders: Order[]) {
  const next = orders.length + 1;
  return `VB-2025-${String(next).padStart(3, "0")}`;
}

export const fakeDb = {
  reset() {
    const state = seedState();
    saveState(state);
    return state;
  },

  snapshot(): DbState {
    return loadState();
  },

  products: {
    list(): Product[] {
      return loadState().products;
    },
    create(input: Omit<Product, "id" | "criadoEm">): Product {
      const state = loadState();
      const product: Product = { ...input, id: randomId("p"), criadoEm: nowIso() };
      const nextState: DbState = { ...state, products: [product, ...state.products] };
      saveState(nextState);
      return product;
    },
    update(id: string, patch: Partial<Omit<Product, "id" | "criadoEm">>): Product | null {
      const state = loadState();
      const current = state.products.find((p) => p.id === id);
      if (!current) return null;
      const updated: Product = { ...current, ...patch };
      const nextState: DbState = {
        ...state,
        products: state.products.map((p) => (p.id === id ? updated : p)),
      };
      saveState(nextState);
      return updated;
    },
    remove(id: string): boolean {
      const state = loadState();
      const next = state.products.filter((p) => p.id !== id);
      if (next.length === state.products.length) return false;
      saveState({ ...state, products: next });
      return true;
    },
  },

  customers: {
    list(): Customer[] {
      return loadState().customers;
    },
    create(input: Omit<Customer, "id" | "criadoEm">): Customer {
      const state = loadState();
      const customer: Customer = { ...input, id: randomId("c"), criadoEm: nowIso() };
      const nextState: DbState = { ...state, customers: [customer, ...state.customers] };
      saveState(nextState);
      return customer;
    },
  },

  vendors: {
    list(): Vendor[] {
      return loadState().vendors;
    },
    create(input: Omit<Vendor, "id" | "criadoEm">): Vendor {
      const state = loadState();
      const vendor: Vendor = { ...input, id: randomId("v"), criadoEm: nowIso() };
      const nextState: DbState = { ...state, vendors: [vendor, ...state.vendors] };
      saveState(nextState);
      return vendor;
    },
  },

  orders: {
    list(): Order[] {
      return loadState().orders;
    },
    create(input: Omit<Order, "id" | "numero" | "criadoEm" | "total">): Order {
      const state = loadState();
      const total = input.itens.reduce(
        (sum, item) => sum + item.precoUnitario * item.quantidade,
        0,
      );
      const order: Order = {
        ...input,
        id: randomId("o"),
        numero: nextOrderNumber(state.orders),
        total,
        criadoEm: nowIso(),
      };

      const nextState: DbState = { ...state, orders: [order, ...state.orders] };
      saveState(nextState);
      return order;
    },
    update(id: string, patch: Partial<Omit<Order, "id" | "numero" | "criadoEm">>): Order | null {
      const state = loadState();
      const current = state.orders.find((o) => o.id === id);
      if (!current) return null;
      const updated: Order = { ...current, ...patch };
      const nextState: DbState = {
        ...state,
        orders: state.orders.map((o) => (o.id === id ? updated : o)),
      };
      saveState(nextState);
      return updated;
    },
  },

  movements: {
    list(): StockMovement[] {
      return loadState().movements;
    },
    create(input: Omit<StockMovement, "id" | "criadoEm">): StockMovement {
      const state = loadState();
      const movement: StockMovement = { ...input, id: randomId("m"), criadoEm: nowIso() };
      const delta =
        movement.tipo === "entrada" ? movement.quantidade : movement.tipo === "saida" ? -movement.quantidade : 0;

      const nextBalances = state.stockBalances.map((b) =>
        b.productId === movement.productId ? { ...b, saldo: b.saldo + delta } : b,
      );
      const nextState: DbState = {
        ...state,
        movements: [movement, ...state.movements],
        stockBalances: nextBalances,
      };
      saveState(nextState);
      return movement;
    },
  },

  stock: {
    listBalances() {
      return loadState().stockBalances;
    },
  },

  invoices: {
    list(): Invoice[] {
      return loadState().invoices;
    },
    update(
      id: string,
      patch: Partial<Omit<Invoice, "id" | "criadoEm">>,
    ): Invoice | null {
      const state = loadState();
      const current = state.invoices.find((i) => i.id === id);
      if (!current) return null;
      const updated: Invoice = { ...current, ...patch };
      const nextState: DbState = {
        ...state,
        invoices: state.invoices.map((i) => (i.id === id ? updated : i)),
      };
      saveState(nextState);
      return updated;
    },
  },
};
