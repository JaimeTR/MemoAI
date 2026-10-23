import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { syncOrderToErp } from "@/lib/erp";
import { sendOrderConfirmationAfter } from "@/lib/email";
import { isRateLimited, tooManyRequests } from "@/lib/rate-limit";
import { ensureCustomerAccount } from "@/lib/account";
import { DELIVERY_ZONES } from "@/lib/constants";
import { productoParaPedido } from "@/lib/catalogo";
import { validarCupon } from "@/lib/cupones";

export async function POST(request: NextRequest) {
  if (isRateLimited(request, "order", 10, 10 * 60_000)) return tooManyRequests();
  try {
    const body = await request.json();

    const text = (v: unknown, max: number) => typeof v === "string" && v.trim().length > 0 && v.length <= max;
    const valid =
      text(body.customerName, 160) &&
      text(body.customerEmail, 160) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customerEmail) &&
      text(body.customerPhone, 40) &&
      text(body.address, 300) &&
      text(body.city, 120) &&
      text(body.department, 120);
    if (!valid) {
      return NextResponse.json({ error: "Faltan datos del pedido o el correo no es válido" }, { status: 400 });
    }

    const quantity = Math.max(1, Math.min(5, Number(body.quantity) || 1));

    // El precio nunca sale del navegador: se busca el producto en el catalogo (ERP o respaldo).
    const producto = await productoParaPedido(typeof body.productId === "string" ? body.productId : null);
    if (!producto) return NextResponse.json({ error: "Ese producto ya no está disponible" }, { status: 404 });
    if (producto.disponibilidad === "agotado") return NextResponse.json({ error: "Este producto está agotado" }, { status: 409 });
    if (producto.unidades !== null && quantity > producto.unidades) {
      return NextResponse.json({ error: `Solo quedan ${producto.unidades} unidades` }, { status: 409 });
    }
    const unitPrice = producto.precio;
    const productName = producto.nombre;
    let amount = unitPrice * quantity;

    // El cupon tambien se valida aqui (no se confia en el descuento que muestre el navegador).
    let couponCode: string | undefined;
    if (typeof body.couponCode === "string" && body.couponCode.trim()) {
      const r = await validarCupon(body.couponCode, amount);
      if (!r.ok) return NextResponse.json({ error: r.error }, { status: 409 });
      amount = Math.max(0, Math.round((amount - r.cupon.discount) * 100) / 100);
      couponCode = r.cupon.code;
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
      // product_id apunta a la tabla products de Supabase: solo se llena si el producto es de ahi.
      productId: producto.fuente === "tienda" && producto.id ? producto.id : null,
      productRef: producto.id || null,
      product: productName,
      quantity,
      couponCode,
      amount,
      status: "pending",
      paymentProvider: body.paymentProvider || "culqi",
    });

    syncOrderToErp(order);
    sendOrderConfirmationAfter(order);

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders failed:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 }
    );
  }
}
