import { NextRequest, NextResponse } from "next/server";
import { db, type Order } from "@/lib/db";
import { sendStatusEmailAfter } from "@/lib/email";
import { firmaDelErpValida } from "@/lib/erp-api";

const DESDE_ERP: Record<string, Order["status"]> = {
  PENDIENTE: "pending",
  PAGADO: "paid",
  ENVIADO: "shipped",
  ENTREGADO: "delivered",
  CANCELADO: "cancelled",
};

/**
 * El ERP avisa aqui cada cambio de estado que se hace en su panel. Se actualiza el pedido (el cliente lo
 * ve en su cuenta) y se le escribe. No se le reenvia al ERP: el estado ya es el suyo.
 */
export async function POST(request: NextRequest) {
  if (!firmaDelErpValida(request.headers.get("x-tienda-signature"))) {
    return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const externoId = typeof body.externoId === "string" ? body.externoId : "";
  const status = DESDE_ERP[body.estado as string];
  if (!externoId || !status) return NextResponse.json({ error: "Faltan externoId o estado" }, { status: 400 });

  const anterior = await db.getOrder(externoId);
  if (!anterior) return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  if (anterior.status === status) return NextResponse.json({ ok: true, sinCambios: true });

  const order = await db.updateOrderStatus(externoId, status);
  if (!order) return NextResponse.json({ error: "No se pudo actualizar" }, { status: 500 });
  sendStatusEmailAfter(order);
  return NextResponse.json({ ok: true });
}
