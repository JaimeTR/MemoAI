import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listarProductos, productoPorSlug, simboloDe } from "@/lib/catalogo";
import { db } from "@/lib/db";
import { LandingMemoAI } from "@/components/memoai/LandingMemoAI";
import { ProductoLanding } from "@/components/store/ProductoLanding";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreFooter } from "@/components/store/StoreFooter";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await listarProductos()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await productoPorSlug(slug);
  if (!p) return { title: "Producto no encontrado" };
  const descripcion = p.tagline ?? p.descripcion?.slice(0, 160) ?? `${p.nombre} con envío gratis a todo el Perú.`;
  return {
    title: p.nombre,
    description: descripcion,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: { title: p.nombre, description: descripcion, images: p.imagenes[0] ? [{ url: p.imagenes[0].url, alt: p.imagenes[0].alt }] : undefined },
  };
}

export default async function PaginaProducto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [producto, ajustes] = await Promise.all([productoPorSlug(slug), db.getSettings()]);
  if (!producto) notFound();

  // Datos estructurados para Google: producto, precio y disponibilidad.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.tagline ?? producto.descripcion ?? undefined,
    image: producto.imagenes.map((i) => i.url),
    brand: { "@type": "Brand", name: "DevmarkPE Store" },
    offers: {
      "@type": "Offer",
      price: producto.precio.toFixed(2),
      priceCurrency: producto.moneda,
      availability: producto.disponibilidad === "agotado" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      url: `${process.env.SITE_URL ?? "https://devmarkpe.store"}/producto/${producto.slug}`,
    },
  };
  const ld = <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />;

  if (producto.landing === "memoai") {
    return (
      <>
        {ld}
        <LandingMemoAI
          producto={{ id: producto.id || undefined, name: producto.nombre, salePrice: producto.precio, originalPrice: producto.precioAnterior ?? producto.precio, currency: simboloDe(producto.moneda) }}
        />
      </>
    );
  }

  return (
    <div className="store">
      {ld}
      <StoreHeader whatsapp={ajustes.whatsappNumber} claro />
      <ProductoLanding producto={producto} whatsapp={ajustes.whatsappNumber} />
      <StoreFooter />
    </div>
  );
}
