import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const coupons = await db.getCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();

    if (!body.code || !body.type || typeof body.value !== "number") {
      return NextResponse.json({ error: "Datos de cupón incompletos" }, { status: 400 });
    }

    const coupon = await db.addCoupon({
      code: body.code,
      type: body.type,
      value: body.value,
      active: body.active ?? true,
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error creando cupón" }, { status: 500 });
  }
}
