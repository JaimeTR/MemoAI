import { db, type ShopSettings } from "@/lib/db";
import { erpGet } from "@/lib/erp-api";

type AjustesErp = {
  whatsapp: string | null;
  yapeNumero: string | null;
  yapeNombre: string | null;
  plinNumero: string | null;
  enlacePago: string | null;
  enlacePagoActivo: boolean;
};

/**
 * Datos de pago y contacto (WhatsApp, Yape, Plin). Vienen del ERP (Ajustes de tienda), cacheados 5
 * minutos; lo que el ERP no tenga cargado, y todo si el ERP no esta conectado, sale de Supabase.
 */
export async function obtenerAjustes(): Promise<ShopSettings> {
  const respaldo = await db.getSettings();
  try {
    const res = await erpGet("ajustes");
    if (!res?.ok) return respaldo;
    const a = (await res.json()) as AjustesErp;
    return {
      whatsappNumber: a.whatsapp ?? respaldo.whatsappNumber,
      yapeNumber: a.yapeNumero ?? respaldo.yapeNumber,
      yapeName: a.yapeNombre ?? respaldo.yapeName,
      plinNumber: a.plinNumero ?? respaldo.plinNumber,
      paymentLink: a.enlacePago ?? "",
      paymentLinkEnabled: Boolean(a.enlacePago && a.enlacePagoActivo),
    };
  } catch (error) {
    console.error("Ajustes: no se pudo leer del ERP, se usa Supabase", error);
    return respaldo;
  }
}
