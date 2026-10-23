import { db } from "@/lib/db";
import { erpConfig, erpGet } from "@/lib/erp-api";

export type CuponAplicado = { code: string; type: "percent" | "fixed"; value: number; discount: number };
export type ResultadoCupon = { ok: true; cupon: CuponAplicado } | { ok: false; error: string };

/**
 * Valida un cupon para un subtotal (sin envio). Con el ERP conectado la respuesta es del ERP, al
 * momento (vigencia, usos y monto); sin el, se usa la tabla coupons de Supabase.
 */
export async function validarCupon(codigo: string, subtotal: number): Promise<ResultadoCupon> {
  const limpio = codigo.trim().toUpperCase().replace(/\s+/g, "");
  if (!limpio) return { ok: false, error: "Ingresa un código" };

  if (erpConfig()) {
    try {
      const res = await erpGet(`cupones/${encodeURIComponent(limpio)}?subtotal=${subtotal}`, { fresco: true });
      if (res?.ok) {
        const c = (await res.json()) as { codigo: string; tipo: "PORCENTAJE" | "MONTO"; valor: number; descuento: number };
        return { ok: true, cupon: { code: c.codigo, type: c.tipo === "PORCENTAJE" ? "percent" : "fixed", value: c.valor, discount: c.descuento } };
      }
      if (res?.status === 404) {
        const j = await res.json().catch(() => ({}));
        return { ok: false, error: typeof j.message === "string" ? j.message : "Cupón inválido o vencido" };
      }
      return { ok: false, error: "No pudimos validar el cupón ahora. Intenta en un momento." };
    } catch (error) {
      console.error("Cupón: el ERP no respondió", error);
      return { ok: false, error: "No pudimos validar el cupón ahora. Intenta en un momento." };
    }
  }

  const c = await db.getCoupon(limpio);
  if (!c || !c.active) return { ok: false, error: "Cupón inválido o vencido" };
  const discount = c.type === "percent" ? Math.round(subtotal * c.value) / 100 : Math.min(c.value, subtotal);
  return { ok: true, cupon: { code: c.code, type: c.type, value: c.value, discount: Math.min(discount, subtotal) } };
}
