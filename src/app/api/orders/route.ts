import { requireAdmin } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureCustomerAccount } from "@/lib/account";
import { PRODUCT, DELIVERY_ZONES } from "@/lib/constants";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const orders = await db.getOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const quantity = Math.max(1, Math.min(5, Number(body.quantity) || 1));

    // Never trust a client-sent price — look up the real product server-side when one is given.
    const catalogProduct = body.productId ? await db.getProduct(body.productId) : null;
    const unitPrice = catalogProduct ? catalogProduct.salePrice : PRODUCT.salePrice;
    const productName = catalogProduct ? catalogProduct.name : "MemoAI - Grabadora Inteligente";
    let amount = unitPrice * quantity;

    let couponCode: string | undefined;
    if (body.couponCode) {
      const coupon = await db.getCoupon(body.couponCode);
      if (coupon && coupon.active) {
        const discount =
          coupon.type === "percent" ? Math.round((amount * coupon.value) / 100) : Math.min(coupon.value, amount);
        amount = Math.max(0, amount - discount);
        couponCode = coupon.code;
      }
    }

    const zone = DELIVERY_ZONES.find((z) => z.id === body.deliveryZone) || DELIVERY_ZONES[0];
    amount += zone.shippingCost;

    const customerId = body.customerEmail
      ? await ensureCustomerAccount(body.customerEmail, body.customerName, body.customerPhone)
      : null;

    const order = await db.addOrder({
      customerId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      address: body.address,
      dni: body.dni || undefined,
      mapsLink: body.mapsLink || undefined,
      city: body.city,
      province: body.province || undefined,
      department: body.department,
      productId: catalogProduct?.id ?? null,
      product: productName,
      quantity,
      couponCode,
      amount,
      status: "pending",
      paymentProvider: body.paymentProvider || "culqi",
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders failed:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
