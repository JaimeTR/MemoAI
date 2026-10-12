import { isAdmin, requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { syncOrderToErp } from "@/lib/erp";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await db.getOrder(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // The id works as a receipt link, so the public view omits phone, DNI and street address.
  if (!(await isAdmin())) {
    const { id: orderId, status, product, quantity, amount, city, department, createdAt, customerEmail } = order;
    return NextResponse.json({ order: { id: orderId, status, product, quantity, amount, city, department, createdAt, customerEmail } });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json();

  const order = await db.updateOrderStatus(id, body.status);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  syncOrderToErp(order);

  return NextResponse.json({ order });
}
