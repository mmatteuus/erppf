import type { Vendor } from "./types";

export const vendors: Vendor[] = [
  {
    id: "v_fazenda_das_rosas",
    nome: "Fazenda das Rosas",
    contato: "Juliana",
    email: "contato@fazendadasrosas.com",
    telefone: "(11) 98888-1111",
    categoria: "Flores",
    prazoEntregaDias: 1,
    criadoEm: "2025-01-03T10:00:00.000Z",
  },
  {
    id: "v_doces_mel",
    nome: "Doces & Mel",
    contato: "Paulo",
    email: "vendas@docesemel.com",
    telefone: "(11) 97777-2222",
    categoria: "Cestas",
    prazoEntregaDias: 2,
    criadoEm: "2025-01-25T10:00:00.000Z",
  },
  {
    id: "v_pelucias_fofas",
    nome: "Pelúcias Fofas",
    contato: "Bruna",
    email: "atendimento@peluciasfofas.com",
    telefone: "(11) 96666-3333",
    categoria: "Presentes",
    prazoEntregaDias: 3,
    criadoEm: "2025-02-02T10:00:00.000Z",
  },
];

