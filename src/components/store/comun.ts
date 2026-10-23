import type { ProductoCatalogo } from "@/lib/catalogo";

export const simbolo = (moneda: string) => (moneda === "USD" ? "US$" : "S/");

/** "S/ 299" sin decimales si son cero; "S/ 299.90" si no. */
export function precioTexto(valor: number, moneda: string) {
  const n = Number.isInteger(valor) ? valor.toLocaleString("es-PE") : valor.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${simbolo(moneda)} ${n}`;
}

export const descuentoDe = (p: Pick<ProductoCatalogo, "precio" | "precioAnterior">) =>
  p.precioAnterior && p.precioAnterior > p.precio ? Math.round((1 - p.precio / p.precioAnterior) * 100) : 0;

export function whatsappHref(numero: string, mensaje: string) {
  return `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;
}

export const ETIQUETA_DISPONIBILIDAD: Record<ProductoCatalogo["disponibilidad"], string | null> = {
  sin_control: null,
  disponible: "En stock",
  ultimas: "Últimas unidades",
  agotado: "Agotado",
};
