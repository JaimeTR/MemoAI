import { NextRequest, NextResponse } from "next/server";
import { validarCupon } from "@/lib/cupones";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";

/** El checkout valida el cupon antes de pedir. El descuento real se vuelve a calcular al crear el pedido. */
export async function POST(request: NextRequest) {
  if (isRateLimited(request, "coupon", 30, 10 * 60_000)) return tooManyRequests();
  const body = await request.json().catch(() => ({}));
  const code = typeof body.code === "string" ? body.code : "";
  const amount = typeof body.amount === "number" && body.amount > 0 ? body.amount : 0;
  const r = await validarCupon(code, amount);
  if (!r.ok) return NextResponse.json({ valid: false, error: r.error }, { status: code.trim() ? 404 : 400 });
  return NextResponse.json({ valid: true, coupon: r.cupon, discount: r.cupon.discount });
}
