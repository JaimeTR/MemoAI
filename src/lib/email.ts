import { after } from "next/server";
import { createTransport } from "nodemailer";
import type { Order } from "@/lib/db";
import { obtenerAjustes } from "@/lib/ajustes";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function payInstructions(order: Order, s: Awaited<ReturnType<typeof obtenerAjustes>>) {
  if (order.paymentProvider === "yape") return `Paga con Yape al ${esc(s.yapeNumber)} a nombre de ${esc(s.yapeName)}.`;
  if (order.paymentProvider === "plin") return `Paga con Plin al ${esc(s.plinNumber)} a nombre de ${esc(s.yapeName)}.`;
  return "Te contactaremos por WhatsApp para coordinar el pago.";
}

/** Sends the order confirmation over SMTP (same SMTP_* variables as the ERP, but the store mailbox). Does nothing when they are missing. */
export async function sendOrderConfirmation(order: Order) {
  const { SMTP_HOST: host, SMTP_PORT: port, SMTP_USER: user, SMTP_PASS: pass, SMTP_FROM: from } = process.env;
  if (!host || !port || !user || !pass || !from) return;

  try {
    const settings = await obtenerAjustes();
    const site = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
    const wa = settings.whatsappNumber.replace(/\D/g, "");
    const waLink = `https://wa.me/${wa}?text=${encodeURIComponent(`Hola, quiero confirmar mi pedido ${order.id}.`)}`;
    const trackLink = `${site}/pedido/${order.id}`;

    const html = `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;color:#0a0a0a">
<h1 style="font-size:20px">Recibimos tu pedido</h1>
<p>Hola ${esc(order.customerName)}, estos son los datos de tu compra.</p>
<p><strong>${esc(order.product)}</strong> × ${order.quantity}<br>Total: S/ ${order.amount.toFixed(2)}<br>Número de pedido: ${esc(order.id)}</p>
<p>${payInstructions(order, settings)} Luego envíanos la captura por WhatsApp para confirmar el pago.</p>
<p><a href="${waLink}">Enviar captura por WhatsApp</a><br><a href="${trackLink}">Seguir mi pedido</a></p>
<p style="color:#5f6672;font-size:13px">Envío a ${esc(order.city)}, ${esc(order.department)}. Si no hiciste este pedido, ignora este correo.</p>
</div>`;

    await createTransport({ host, port: Number(port), secure: Number(port) === 465, auth: { user, pass } }).sendMail({
      from,
      to: order.customerEmail,
      subject: `Recibimos tu pedido ${order.id} — DevmarkPE Store`,
      html,
      headers: { "Content-Language": "es" },
    });
  } catch (error) {
    console.error(`Correo de confirmación falló para ${order.id}:`, error);
  }
}

/** Fire-and-forget after the response, so a mail outage never blocks a purchase. */
export function sendOrderConfirmationAfter(order: Order) {
  after(() => sendOrderConfirmation(order));
}

const TEXTO_ESTADO: Partial<Record<Order["status"], { asunto: string; titulo: string; texto: string }>> = {
  paid: { asunto: "Confirmamos tu pago", titulo: "Pago confirmado", texto: "Recibimos tu pago. Estamos preparando tu pedido para enviarlo." },
  shipped: { asunto: "Tu pedido va en camino", titulo: "Pedido enviado", texto: "Tu pedido ya salió. Te avisaremos por WhatsApp cuando esté por llegar o listo para recoger." },
  delivered: { asunto: "Tu pedido fue entregado", titulo: "Pedido entregado", texto: "Tu pedido figura como entregado. Gracias por comprar en DevmarkPE Store." },
  cancelled: { asunto: "Tu pedido fue cancelado", titulo: "Pedido cancelado", texto: "Tu pedido fue cancelado. Si no lo pediste o tienes dudas, escríbenos por WhatsApp." },
};

/** Avisa al cliente un cambio de estado hecho en el ERP. Mismo SMTP que la confirmacion; apagado si falta. */
export async function sendStatusEmail(order: Order) {
  const texto = TEXTO_ESTADO[order.status];
  const { SMTP_HOST: host, SMTP_PORT: port, SMTP_USER: user, SMTP_PASS: pass, SMTP_FROM: from } = process.env;
  if (!texto || !host || !port || !user || !pass || !from) return;
  try {
    const settings = await obtenerAjustes();
    const site = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
    const wa = settings.whatsappNumber.replace(/\D/g, "");
    const waLink = `https://wa.me/${wa}?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi pedido ${order.id}.`)}`;
    const html = `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;color:#110c29">
<h1 style="font-size:20px">${texto.titulo}</h1>
<p>Hola ${esc(order.customerName)}, ${texto.texto}</p>
<p><strong>${esc(order.product)}</strong> × ${order.quantity}<br>Número de pedido: ${esc(order.id)}</p>
<p><a href="${site}/pedido/${encodeURIComponent(order.id)}">Ver mi pedido</a><br><a href="${waLink}">Escribirnos por WhatsApp</a></p>
</div>`;
    await createTransport({ host, port: Number(port), secure: Number(port) === 465, auth: { user, pass } }).sendMail({
      from,
      to: order.customerEmail,
      subject: `${texto.asunto} — pedido ${order.id}`,
      html,
      headers: { "Content-Language": "es" },
    });
  } catch (error) {
    console.error(`Correo de estado falló para ${order.id}:`, error);
  }
}

export function sendStatusEmailAfter(order: Order) {
  after(() => sendStatusEmail(order));
}
