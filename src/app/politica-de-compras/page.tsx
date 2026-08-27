import { PolicyLayout } from "@/components/layout/PolicyLayout";

export const metadata = {
  title: "Política de Compras — MemoAI",
};

export default function PoliticaDeComprasPage() {
  return (
    <PolicyLayout
      title="Política de Compras"
      updated="Agosto 2026"
      sections={[
        {
          heading: "1. Cómo se confirma tu pedido",
          body: [
            "Tu pedido queda registrado apenas completas el checkout. Se confirma como pagado cuando verificamos tu Yape, Plin, o transferencia — usualmente en minutos, en horario de atención.",
          ],
        },
        {
          heading: "2. Sin devoluciones ni cambio de opinión",
          body: [
            "MemoAI se vende únicamente online y no aceptamos devoluciones por cambio de opinión, una vez confirmado el pago. Revisa bien las especificaciones del producto antes de comprar.",
            "Si el producto llega con un defecto de fábrica o daño de transporte, contáctanos por WhatsApp dentro de las 48 horas de recibido.",
          ],
        },
        {
          heading: "3. Precio de lanzamiento",
          body: [
            "El precio S/ 299 (regular S/ 755) es promocional y puede cambiar sin previo aviso. El precio válido es el mostrado en tu checkout al momento de pagar.",
          ],
        },
        {
          heading: "4. Pago único",
          body: [
            "No hay suscripciones ni cobros recurrentes — pagas una vez por el dispositivo.",
          ],
        },
      ]}
    />
  );
}
