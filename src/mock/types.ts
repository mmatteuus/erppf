export type ProductType = "flor" | "cesta" | "presente" | "complemento";

export interface Product {
  id: string;
  sku: string;
  nome: string;
  tipo: ProductType;
  categoria: string;
  preco: number;
  custo: number;
  ativo: boolean;
  estoqueMinimo: number;
  criadoEm: string; // ISO
}

export interface Customer {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cidade: string;
  tags: string[];
  criadoEm: string; // ISO
}

export interface Vendor {
  id: string;
  nome: string;
  contato?: string;
  email?: string;
  telefone?: string;
  categoria: string;
  prazoEntregaDias: number;
  criadoEm: string; // ISO
}

export type OrderStatus =
  | "novo"
  | "separacao"
  | "producao"
  | "pronto"
  | "em_rota"
  | "entregue"
  | "cancelado";

export interface OrderItem {
  productId: string;
  sku: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Order {
  id: string;
  numero: string;
  customerId: string;
  cliente: string;
  status: OrderStatus;
  itens: OrderItem[];
  total: number;
  criadoEm: string; // ISO
  entregaEm: string; // ISO (date)
}

export type MovementType = "entrada" | "saida" | "ajuste";

export interface StockMovement {
  id: string;
  tipo: MovementType;
  productId: string;
  sku: string;
  produto: string;
  quantidade: number; // positiva
  motivo: string;
  criadoEm: string; // ISO
}

export type InvoiceType = "receber" | "pagar";
export type InvoiceStatus = "aberta" | "paga" | "atrasada";

export interface Invoice {
  id: string;
  tipo: InvoiceType;
  numero: string;
  entidade: string;
  valor: number;
  vencimentoEm: string; // ISO date
  status: InvoiceStatus;
  criadoEm: string; // ISO
}

