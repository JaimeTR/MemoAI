import { after } from "next/server";
import type { Order } from "@/lib/db";

const ESTADOS: Record<Order["status"], string> = {
  pending: "PENDIENTE",
  paid: "PAGADO",
  shipped: "ENVIADO",
  delivered: "ENTREGADO",
  cancelled: "CANCELADO",
};

const INTENTOS = 3;

export async function sendOrderToErp(order: Order) {
  const base = process.env.ERP_API_URL;
  const secreto = process.env.ERP_TIENDA_SECRET;
  const empresaId = process.env.ERP_EMPRESA_ID;
  if (!base || !secreto || !empresaId) return; // integración apagada

  const cuerpo = {
    empresaId,
    externoId: order.id,
    estado: ESTADOS[order.status],
    clienteNombre: order.customerName,
    clienteCorreo: order.customerEmail,
    clienteTelefono: order.customerPhone,
    dni: order.dni || undefined,
    direccion: order.address,
    ciudad: order.city,
    provincia: order.province || undefined,
    departamento: order.department,
    mapsLink: order.mapsLink || undefined,
    cupon: order.couponCode || undefined,
    total: order.amount,
    metodoPago: order.paymentProvider,
    comprobanteUrl: order.paymentProofUrl || undefined,
    pedidoEn: order.createdAt,
    items: [
      {
        productoExternoId: order.productRef || order.productId || undefined,
        descripcion: order.product,
        cantidad: order.quantity,
        // El pedido no guarda el precio unitario; el total manda.
        precioUnitario: Math.round((order.amount / order.quantity) * 100) / 100,
      },
    ],
  };

  for (let intento = 1; intento <= INTENTOS; intento++) {
    try {
      const res = await fetch(`${base.replace(/\/$/, "")}/api/v1/integraciones/tienda/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-tienda-signature": secreto },
        body: JSON.stringify(cuerpo),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return;
      // 4xx = el ERP rechazó el pedido: reintentar no lo arregla.
      if (res.status < 500) {
        console.error(`ERP rechazó el pedido ${order.id}: ${res.status} ${await res.text()}`);
        return;
      }
    } catch (error) {
      if (intento === INTENTOS) console.error(`ERP no respondió para el pedido ${order.id}:`, error);
    }
    await new Promise((r) => setTimeout(r, 1000 * intento));
  }
  // ponytail: sin cola persistente. Si el ERP está caído los 3 intentos, el pedido se reenvía con su
  // siguiente cambio de estado; si hace falta garantía, agregar columna erp_synced + cron de reintento.
  console.error(`ERP: pedido ${order.id} sin sincronizar tras ${INTENTOS} intentos`);
}

/** Refleja el pedido en el ERP después de responder al cliente; nunca rompe ni retrasa la compra. */
export function syncOrderToErp(order: Order) {
  after(() => sendOrderToErp(order));
}
