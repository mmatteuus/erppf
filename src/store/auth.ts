import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "ADMIN" | "GERENTE" | "CAIXA" | "VENDEDOR";

export type Permission =
  | "PDV_OPERATE"
  | "CASH_OPEN_CLOSE"
  | "CATALOG_VIEW"
  | "CATALOG_EDIT"
  | "PRICING_TOOL"
  | "DISCOUNT_APPROVE"
  | "CHAT_INTERNAL";

type User = {
  id: string;
  name: string;
  role: Role;
};

type AuthState = {
  user: User | null;
  login: (input: { email: string; name?: string; role: Role }) => void;
  logout: () => void;
  hasPermission: (perm: Permission) => boolean;
};

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
    "PDV_OPERATE",
    "CASH_OPEN_CLOSE",
    "CATALOG_VIEW",
    "CATALOG_EDIT",
    "PRICING_TOOL",
    "DISCOUNT_APPROVE",
    "CHAT_INTERNAL",
  ],
  GERENTE: [
    "PDV_OPERATE",
    "CASH_OPEN_CLOSE",
    "CATALOG_VIEW",
    "CATALOG_EDIT",
    "PRICING_TOOL",
    "DISCOUNT_APPROVE",
    "CHAT_INTERNAL",
  ],
  CAIXA: ["PDV_OPERATE", "CASH_OPEN_CLOSE", "CATALOG_VIEW", "CHAT_INTERNAL"],
  VENDEDOR: ["PDV_OPERATE", "CATALOG_VIEW", "CHAT_INTERNAL"],
};

function hasPerm(role: Role | null | undefined, perm: Permission) {
  if (!role) return false;
  return rolePermissions[role]?.includes(perm) ?? false;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: ({ email, name, role }) =>
        set({
          user: {
            id: email || crypto.randomUUID?.() || Math.random().toString(36).slice(2, 10),
            name: name || email,
            role,
          },
        }),
      logout: () => set({ user: null }),
      hasPermission: (perm) => hasPerm(get().user?.role, perm),
    }),
    { name: "provenca-auth-v1" },
  ),
);

export { hasPerm as canRole };***
