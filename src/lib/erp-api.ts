import { timingSafeEqual } from "node:crypto";

/**
 * Conexion con la API del ERP Devmark, que es el panel de la tienda: catalogo, cupones, ajustes de
 * pago y estados de pedido se gestionan alla. Todas las llamadas van firmadas con ERP_TIENDA_SECRET
 * (el ERP lo compara con su TIENDA_SIGNING_SECRET). Sin las tres variables la conexion esta apagada.
 */
export function erpConfig() {
  const base = process.env.ERP_API_URL;
  const secreto = process.env.ERP_TIENDA_SECRET;
  const empresaId = process.env.ERP_EMPRESA_ID;
  return base && secreto && empresaId ? { base: base.replace(/\/$/, ""), secreto, empresaId } : null;
}

/** GET firmado a /api/v1/integraciones/tienda/<ruta>. `fresco` evita la cache (precios, stock, cupones). */
export async function erpGet(ruta: string, { fresco = false, revalidar = 300 }: { fresco?: boolean; revalidar?: number } = {}): Promise<Response | null> {
  const erp = erpConfig();
  if (!erp) return null;
  const sep = ruta.includes("?") ? "&" : "?";
  return fetch(`${erp.base}/api/v1/integraciones/tienda/${ruta}${sep}empresaId=${erp.empresaId}`, {
    headers: { "x-tienda-signature": erp.secreto },
    ...(fresco ? { cache: "no-store" as const } : { next: { revalidate: revalidar, tags: ["erp"] } }),
    signal: AbortSignal.timeout(8_000),
  });
}

/** Compara la firma que manda el ERP al avisar un cambio, sin filtrar por tiempo de respuesta. */
export function firmaDelErpValida(firma: string | null): boolean {
  const secreto = process.env.ERP_TIENDA_SECRET;
  if (!secreto || !firma) return false;
  const a = Buffer.from(firma);
  const b = Buffer.from(secreto);
  return a.length === b.length && timingSafeEqual(a, b);
}
