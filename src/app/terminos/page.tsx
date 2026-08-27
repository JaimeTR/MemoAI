import { PolicyLayout } from "@/components/layout/PolicyLayout";

export const metadata = {
  title: "Términos y Condiciones — MemoAI",
};

export default function TerminosPage() {
  return (
    <PolicyLayout
      title="Términos y Condiciones"
      updated="Agosto 2026"
      sections={[
        {
          heading: "1. Sobre esta tienda",
          body: [
            "MemoAI es una tienda online que vende la grabadora inteligente MemoAI a clientes en todo el Perú. Al comprar en este sitio aceptas estos términos.",
          ],
        },
        {
          heading: "2. Precio y forma de pago",
          body: [
            "El precio de lanzamiento actual es S/ 299 (precio regular S/ 755). El precio final que pagas es el que se muestra en el checkout al momento de tu compra.",
            "Aceptamos pago por Yape, Plin, coordinación por WhatsApp y, cuando esté habilitado, tarjeta vía pasarela de pago. El pedido se confirma y se agenda para envío una vez verificado el pago.",
          ],
        },
        {
          heading: "3. Sin devoluciones",
          body: [
            "Por tratarse de un producto electrónico de venta directa, no se aceptan devoluciones por cambio de opinión. Si tu producto llega con un defecto de fábrica o dañado por el transporte, contáctanos por WhatsApp dentro de las 48 horas de recibido y evaluamos el caso.",
          ],
        },
        {
          heading: "4. Garantía",
          body: [
            "MemoAI no ofrece garantía extendida de fábrica sobre el dispositivo. Cualquier falla de funcionamiento reportada poco después de la entrega se evalúa caso por caso escribiéndonos por WhatsApp.",
          ],
        },
        {
          heading: "5. Contacto",
          body: [
            "Para cualquier consulta sobre tu pedido, escríbenos por WhatsApp desde el botón flotante del sitio o desde el enlace que recibes al confirmar tu compra.",
          ],
        },
      ]}
    />
  );
}
