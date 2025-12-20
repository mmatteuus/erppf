import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Customer, PaymentMethod } from "@/types/domain";

export type CashStatus = "open" | "closed";

export type CartItem = {
  id: string;
  code: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
};

export type PaymentEntry = {
  id: string;
  method: PaymentMethod;
  amount: number;
  change?: number;
  status: "pending" | "authorized" | "captured" | "failed";
};

export type PendingSale = {
  id: string;
  saleUid: string;
  total: number;
  createdAt: string;
  status: "pending" | "failed";
};

export type DiscountRequest = {
  id: string;
  itemId: string;
  requestedBy: string;
  percent: number;
  status: "pending" | "approved" | "rejected";
};

type PDVState = {
  cashStatus: CashStatus;
  cashOpeningAmount: number;
  cashOpenedAt?: string;
  cartItems: CartItem[];
  selectedCustomer?: Customer;
  payments: PaymentEntry[];
  pendingSales: PendingSale[];
  offline: boolean;
  discountRequests: DiscountRequest[];

  openCash: (amount: number) => void;
  closeCash: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyDiscount: (id: string, discount: number) => void;
  clearSale: () => void;
  setCustomer: (customer?: Customer) => void;
  addPayment: (entry: Omit<PaymentEntry, "id" | "status">) => void;
  setOffline: (flag: boolean) => void;
  enqueuePendingSale: (input: { saleUid: string; total: number }) => void;
  markPendingSale: (saleUid: string, status: PendingSale["status"]) => void;
  requestDiscount: (input: { itemId: string; percent: number; requestedBy: string }) => void;
  approveDiscount: (requestId: string) => void;
  rejectDiscount: (requestId: string) => void;
};

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export const usePDVStore = create<PDVState>()(
  persist(
    (set) => ({
      cashStatus: "closed",
      cashOpeningAmount: 0,
      cartItems: [],
      payments: [],
      pendingSales: [],
      offline: false,
      discountRequests: [],

      openCash: (amount: number) =>
        set({
          cashStatus: "open",
          cashOpeningAmount: amount,
          cashOpenedAt: new Date().toISOString(),
        }),

      closeCash: () =>
        set({
          cashStatus: "closed",
          cashOpeningAmount: 0,
          cashOpenedAt: undefined,
          cartItems: [],
          payments: [],
          selectedCustomer: undefined,
        }),

      addItem: (item) =>
        set((state) => ({
          cartItems: [...state.cartItems, { ...item, id: makeId("item") }],
        })),

      removeItem: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(quantity, 0) } : item,
          ),
        })),

      applyDiscount: (id, discount) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === id ? { ...item, discount: Math.max(discount, 0) } : item,
          ),
        })),

      clearSale: () =>
        set({
          cartItems: [],
          payments: [],
          selectedCustomer: undefined,
        }),

      setCustomer: (customer) => set({ selectedCustomer: customer }),

      addPayment: (entry) =>
        set((state) => ({
          payments: [
            ...state.payments,
            { ...entry, id: makeId("pay"), status: "pending" },
          ],
        })),

      setOffline: (flag) => set({ offline: flag }),

      enqueuePendingSale: ({ saleUid, total }) =>
        set((state) => ({
          pendingSales: [
            ...state.pendingSales,
            { id: makeId("sale"), saleUid, total, createdAt: new Date().toISOString(), status: "pending" },
          ],
        })),

      markPendingSale: (saleUid, status) =>
        set((state) => ({
          pendingSales: state.pendingSales.map((sale) =>
            sale.saleUid === saleUid ? { ...sale, status } : sale,
          ),
        })),

      requestDiscount: ({ itemId, percent, requestedBy }) =>
        set((state) => ({
          discountRequests: [
            ...state.discountRequests,
            { id: makeId("disc"), itemId, percent, requestedBy, status: "pending" },
          ],
        })),

      approveDiscount: (requestId) =>
        set((state) => {
          const req = state.discountRequests.find((r) => r.id === requestId);
          if (!req) return state;
          return {
            ...state,
            cartItems: state.cartItems.map((item) =>
              item.id === req.itemId ? { ...item, discount: req.percent } : item,
            ),
            discountRequests: state.discountRequests.map((r) =>
              r.id === requestId ? { ...r, status: "approved" } : r,
            ),
          };
        }),

      rejectDiscount: (requestId) =>
        set((state) => ({
          discountRequests: state.discountRequests.map((r) =>
            r.id === requestId ? { ...r, status: "rejected" } : r,
          ),
        })),
    }),
    {
      name: "pdv-store-v1",
      partialize: (state) => ({
        cashStatus: state.cashStatus,
        cashOpeningAmount: state.cashOpeningAmount,
        cashOpenedAt: state.cashOpenedAt,
        cartItems: state.cartItems,
        selectedCustomer: state.selectedCustomer,
        payments: state.payments,
        pendingSales: state.pendingSales,
        offline: state.offline,
        discountRequests: state.discountRequests,
      }),
    },
  ),
);
