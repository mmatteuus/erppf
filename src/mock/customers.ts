import type { Customer } from "./types";

export const customers: Customer[] = [
  {
    id: "c_maria_silva",
    nome: "Maria Silva",
    email: "maria@email.com",
    telefone: "(11) 99999-1111",
    cidade: "São Paulo",
    tags: ["VIP", "Recorrente"],
    criadoEm: "2025-01-08T10:00:00.000Z",
  },
  {
    id: "c_joao_santos",
    nome: "João Santos",
    email: "joao@email.com",
    telefone: "(11) 99999-2222",
    cidade: "São Paulo",
    tags: ["Recorrente"],
    criadoEm: "2025-01-14T10:00:00.000Z",
  },
  {
    id: "c_ana_costa",
    nome: "Ana Costa",
    email: "ana@email.com",
    telefone: "(11) 99999-3333",
    cidade: "Santo André",
    tags: ["Novo"],
    criadoEm: "2025-02-04T10:00:00.000Z",
  },
  {
    id: "c_empresa_alfa",
    nome: "Empresa Alfa LTDA",
    email: "compras@empresa-alfa.com",
    telefone: "(11) 4000-1234",
    cidade: "São Paulo",
    tags: ["Corporativo"],
    criadoEm: "2025-02-20T10:00:00.000Z",
  },
];

