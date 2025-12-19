import type { StockMovement } from "./types";

export const stockBalances: Array<{
  productId: string;
  sku: string;
  produto: string;
  saldo: number;
}> = [
  {
    productId: "p_rosa_vermelha",
    sku: "FLR-ROSA-VERM",
    produto: "Rosa vermelha (un.)",
    saldo: 96,
  },
  {
    productId: "p_orquidea",
    sku: "FLR-ORQ-PHAL",
    produto: "Orquídea Phalaenopsis",
    saldo: 5,
  },
  {
    productId: "p_cesta_cafe",
    sku: "CST-CAF-001",
    produto: "Cesta Café da Manhã",
    saldo: 3,
  },
  {
    productId: "p_buque_12_rosas",
    sku: "FLR-BUQ-012",
    produto: "Buquê 12 rosas vermelhas",
    saldo: 7,
  },
  {
    productId: "p_urso_pelucia",
    sku: "PRS-URSO-PEQ",
    produto: "Urso de pelúcia (P)",
    saldo: 12,
  },
  {
    productId: "p_cartao",
    sku: "ADD-CARTAO",
    produto: "Cartão personalizado",
    saldo: 64,
  },
];

export const movements: StockMovement[] = [
  {
    id: "m_001",
    tipo: "entrada",
    productId: "p_rosa_vermelha",
    sku: "FLR-ROSA-VERM",
    produto: "Rosa vermelha (un.)",
    quantidade: 120,
    motivo: "Compra - Fazenda das Rosas",
    criadoEm: "2025-12-18T09:00:00.000Z",
  },
  {
    id: "m_002",
    tipo: "saida",
    productId: "p_rosa_vermelha",
    sku: "FLR-ROSA-VERM",
    produto: "Rosa vermelha (un.)",
    quantidade: 24,
    motivo: "Pedido VB-2025-001",
    criadoEm: "2025-12-19T12:30:00.000Z",
  },
  {
    id: "m_003",
    tipo: "entrada",
    productId: "p_urso_pelucia",
    sku: "PRS-URSO-PEQ",
    produto: "Urso de pelúcia (P)",
    quantidade: 20,
    motivo: "Reposição - Pelúcias Fofas",
    criadoEm: "2025-12-15T11:10:00.000Z",
  },
];
