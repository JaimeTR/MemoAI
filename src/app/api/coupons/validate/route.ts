import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const code = (body.code || "").trim();
  const amount = typeof body.amount === "number" ? body.amount : 0;

  if (!code) {
    return NextResponse.json({ valid: false, error: "Ingresa un código" }, { status: 400 });
  }

  const coupon = await db.getCoupon(code);

  if (!coupon || !coupon.active) {
    return NextResponse.json({ valid: false, error: "Cupón inválido o vencido" }, { status: 404 });
  }

  const discount =
    coupon.type === "percent"
      ? Math.round((amount * coupon.value) / 100)
      : Math.min(coupon.value, amount);

  return NextResponse.json({ valid: true, coupon, discount });
}
