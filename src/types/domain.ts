export type Product = {
  id: string;
  name: string;
  sku?: string;
  price: number;
  family?: string;
  category?: string;
  stock?: number;
  imageUrl?: string;
};

export type Customer = {
  id: string;
  name: string;
  document?: string;
  email?: string;
  address?: string;
  phone1?: string;
  phone2?: string;
};

export type SaleStatus = "pending" | "paid" | "cancelled";

export type Sale = {
  id: string;
  number?: string;
  total: number;
  status: SaleStatus;
  paymentStatus?: "pending" | "authorized" | "captured" | "failed";
  createdAt: string;
  customerName?: string;
};

export type PaymentMethod = "cash" | "card" | "pix";

export type PaymentIntent = {
  id: string;
  saleId: string;
  method: PaymentMethod;
  amount: number;
  status: "authorized" | "captured" | "reversed" | "failed" | "pending";
  createdAt: string;
};
