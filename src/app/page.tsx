import { listarProductos } from "@/lib/catalogo";
import { obtenerAjustes } from "@/lib/ajustes";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";
import { StoreHome } from "@/components/store/StoreHome";

// El catalogo se vuelve a leer del ERP cada 5 minutos.
export const revalidate = 300;

export default async function Inicio() {
  const [productos, ajustes] = await Promise.all([listarProductos(), obtenerAjustes()]);
  return (
    <div className="store">
      <StoreHeader whatsapp={ajustes.whatsappNumber} />
      <StoreHome productos={productos} whatsapp={ajustes.whatsappNumber} />
      <StoreFooter />
    </div>
  );
}
