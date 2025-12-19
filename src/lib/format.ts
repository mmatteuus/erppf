export function formatCurrencyBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDateBR(dateIso: string) {
  const d = new Date(dateIso);
  return d.toLocaleDateString("pt-BR");
}

