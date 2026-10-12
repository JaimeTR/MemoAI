import { after } from "next/server";
import { createTransport } from "nodemailer";
import { db, type Order } from "@/lib/db";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function payInstructions(order: Order, s: Awaited<ReturnType<typeof db.getSettings>>) {
  if (order.paymentProvider === "yape") return `Paga con Yape al ${esc(s.yapeNumber)} a nombre de ${esc(s.yapeName)}.`;
  if (order.paymentProvider === "plin") return `Paga con Plin al ${esc(s.plinNumber)} a nombre de ${esc(s.yapeName)}.`;
  return "Te contactaremos por WhatsApp para coordinar el pago.";
}

/** Sends the order confirmation over SMTP (same SMTP_* variables as the ERP, but the store mailbox). Does nothing when they are missing. */
export async function sendOrderConfirmation(order: Order) {
  const { SMTP_HOST: host, SMTP_PORT: port, SMTP_USER: user, SMTP_PASS: pass, SMTP_FROM: from } = process.env;
  if (!host || !port || !user || !pass || !from) return;

  try {
    const settings = await db.getSettings();
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
      subject: "Recibimos tu pedido de MemoAI",
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
