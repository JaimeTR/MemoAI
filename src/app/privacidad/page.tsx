import { PolicyLayout } from "@/components/layout/PolicyLayout";

export const metadata = {
  title: "Política de Privacidad — MemoAI",
};

export default function PrivacidadPage() {
  return (
    <PolicyLayout
      title="Política de Privacidad"
      updated="Agosto 2026"
      sections={[
        {
          heading: "1. Qué datos recogemos",
          body: [
            "Al comprar, pedimos nombre, DNI, teléfono, correo, y dirección o agencia de recojo — lo mínimo necesario para procesar tu pedido y coordinar el envío.",
          ],
        },
        {
          heading: "2. Para qué usamos tus datos",
          body: [
            "Usamos tus datos únicamente para procesar tu pedido, coordinar el envío por WhatsApp, confirmarte el pago, y crear tu cuenta de cliente (acceso sin contraseña por link a tu correo) para que puedas ver el estado de tus compras.",
            "No vendemos ni compartimos tus datos con terceros para fines de marketing.",
          ],
        },
        {
          heading: "3. Dónde se guardan",
          body: [
            "Tus datos se almacenan en una base de datos con acceso restringido. Los pagos por Yape/Plin se verifican manualmente con el número de operación que nos das; no almacenamos datos de tarjetas — eso lo maneja directamente la pasarela de pago cuando esté disponible.",
          ],
        },
        {
          heading: "4. Tus derechos",
          body: [
            "Puedes pedirnos en cualquier momento que te confirmemos, corrijamos o eliminemos tus datos escribiéndonos por WhatsApp.",
          ],
        },
      ]}
    />
  );
}
