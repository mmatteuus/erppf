import type { Order } from "./types";

export const orders: Order[] = [
  {
    id: "o_001",
    numero: "VB-2025-001",
    customerId: "c_maria_silva",
    cliente: "Maria Silva",
    status: "em_rota",
    itens: [
      {
        productId: "p_buque_12_rosas",
        sku: "FLR-BUQ-012",
        nome: "Buquê 12 rosas vermelhas",
        quantidade: 1,
        precoUnitario: 189.9,
      },
      {
        productId: "p_cartao",
        sku: "ADD-CARTAO",
        nome: "Cartão personalizado",
        quantidade: 1,
        precoUnitario: 9.9,
      },
    ],
    total: 199.8,
    criadoEm: "2025-12-19T12:20:00.000Z",
    entregaEm: "2025-12-19T00:00:00.000Z",
  },
  {
    id: "o_002",
    numero: "VB-2025-002",
    customerId: "c_joao_santos",
    cliente: "João Santos",
    status: "novo",
    itens: [
      {
        productId: "p_orquidea",
        sku: "FLR-ORQ-PHAL",
        nome: "Orquídea Phalaenopsis",
        quantidade: 1,
        precoUnitario: 159.9,
      },
    ],
    total: 159.9,
    criadoEm: "2025-12-19T13:05:00.000Z",
    entregaEm: "2025-12-19T00:00:00.000Z",
  },
  {
    id: "o_003",
    numero: "VB-2025-003",
    customerId: "c_empresa_alfa",
    cliente: "Empresa Alfa LTDA",
    status: "entregue",
    itens: [
      {
        productId: "p_cesta_cafe",
        sku: "CST-CAF-001",
        nome: "Cesta Café da Manhã",
        quantidade: 2,
        precoUnitario: 259.9,
      },
    ],
    total: 519.8,
    criadoEm: "2025-12-18T14:00:00.000Z",
    entregaEm: "2025-12-18T00:00:00.000Z",
  },
];

