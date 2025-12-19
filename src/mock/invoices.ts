import type { Invoice } from "./types";

export const invoices: Invoice[] = [
  {
    id: "inv_r_001",
    tipo: "receber",
    numero: "CR-2025-101",
    entidade: "Maria Silva",
    valor: 199.8,
    vencimentoEm: "2025-12-20T00:00:00.000Z",
    status: "aberta",
    criadoEm: "2025-12-19T12:20:00.000Z",
  },
  {
    id: "inv_r_002",
    tipo: "receber",
    numero: "CR-2025-102",
    entidade: "Empresa Alfa LTDA",
    valor: 519.8,
    vencimentoEm: "2025-12-18T00:00:00.000Z",
    status: "paga",
    criadoEm: "2025-12-18T14:00:00.000Z",
  },
  {
    id: "inv_p_001",
    tipo: "pagar",
    numero: "CP-2025-501",
    entidade: "Fazenda das Rosas",
    valor: 624.0,
    vencimentoEm: "2025-12-21T00:00:00.000Z",
    status: "aberta",
    criadoEm: "2025-12-18T09:00:00.000Z",
  },
  {
    id: "inv_p_002",
    tipo: "pagar",
    numero: "CP-2025-502",
    entidade: "Pelúcias Fofas",
    valor: 640.0,
    vencimentoEm: "2025-12-10T00:00:00.000Z",
    status: "atrasada",
    criadoEm: "2025-12-02T11:00:00.000Z",
  },
];

