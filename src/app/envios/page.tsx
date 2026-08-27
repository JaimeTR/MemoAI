import { PolicyLayout } from "@/components/layout/PolicyLayout";

export const metadata = {
  title: "Política de Envíos — MemoAI",
};

export default function EnviosPage() {
  return (
    <PolicyLayout
      title="Política de Envíos"
      updated="Agosto 2026"
      sections={[
        {
          heading: "1. Envío gratis a todo el Perú",
          body: [
            "Todo pedido incluye envío gratis, sin monto mínimo de compra.",
          ],
        },
        {
          heading: "2. Tiempos de entrega",
          body: [
            "Lima Metropolitana (zona cercada): hasta 2 días hábiles, en algunos casos el mismo día vía courier local.",
            "Provincias: aproximadamente 3 días hábiles, vía Shalom u otra agencia de tu elección — recoges en la agencia más cercana con tu DNI.",
          ],
        },
        {
          heading: "3. Pago contraentrega",
          body: [
            "Si prefieres pagar al recibir tu pedido, coordínalo con nosotros por WhatsApp antes de confirmar el checkout.",
          ],
        },
        {
          heading: "4. Seguimiento",
          body: [
            "Te avisamos por WhatsApp cuando tu pedido sale y cuando llega a tu agencia o dirección. Si compraste con tu correo, también puedes ver el estado desde tu cuenta.",
          ],
        },
      ]}
    />
  );
}
