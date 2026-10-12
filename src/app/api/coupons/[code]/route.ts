import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { code } = await params;
  const body = await request.json();

  const existing = await db.getCoupon(code);
  if (!existing) {
    return NextResponse.json({ error: "Cupón no encontrado" }, { status: 404 });
  }

  const coupon = await db.addCoupon({ ...existing, active: body.active ?? existing.active });
  return NextResponse.json({ coupon });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { code } = await params;
  const deleted = await db.deleteCoupon(code);

  if (!deleted) {
    return NextResponse.json({ error: "Cupón no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
