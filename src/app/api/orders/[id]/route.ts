import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Estado de un pedido para la pagina /pedido/[id]. El id funciona como enlace de recibo, asi que no
 * devuelve telefono, DNI ni direccion. El estado se cambia en el ERP, no aqui.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await db.getOrder(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const { id: orderId, status, product, quantity, amount, city, department, createdAt, customerEmail } = order;
  return NextResponse.json({ order: { id: orderId, status, product, quantity, amount, city, department, createdAt, customerEmail } });
}
