import { db, type Product } from "@/lib/db";
import { PRODUCT } from "@/lib/constants";

/**
 * Catalogo de la tienda. La fuente es el ERP Devmark (productos, precios, stock y fotos se gestionan ahi);
 * la tienda solo lo lee. Mientras el ERP no este conectado (faltan ERP_API_URL, ERP_TIENDA_SECRET o
 * ERP_EMPRESA_ID) o no responda, se usa la tabla `products` de Supabase y, si tampoco hay nada, MemoAI.
 */

export type Disponibilidad = "sin_control" | "agotado" | "ultimas" | "disponible";

export interface ProductoCatalogo {
  /** Id que vuelve en cada pedido: el del ERP (externoId) o el de Supabase. */
  id: string;
  slug: string;
  nombre: string;
  tagline: string | null;
  descripcion: string | null;
  categoria: string | null;
  precio: number;
  precioAnterior: number | null;
  /** Codigo ISO ("PEN", "USD"). */
  moneda: string;
  disponibilidad: Disponibilidad;
  unidades: number | null;
  destacado: boolean;
  imagenes: { url: string; alt: string }[];
  videoUrl: string | null;
  beneficios: { titulo: string; texto: string }[];
  especificaciones: { nombre: string; valor: string }[];
  faq: { pregunta: string; respuesta: string }[];
  /** Landing hecha a mano (p. ej. "memoai"); null = plantilla general. */
  landing: string | null;
  fuente: "erp" | "tienda";
}

/** Cada cuanto se vuelve a pedir el catalogo al ERP (segundos). */
const REVALIDAR = 300;

export const simboloDe = (moneda: string) => (moneda === "USD" ? "US$" : "S/");

function erpConfigurado() {
  const base = process.env.ERP_API_URL;
  const secreto = process.env.ERP_TIENDA_SECRET;
  const empresaId = process.env.ERP_EMPRESA_ID;
  return base && secreto && empresaId ? { base: base.replace(/\/$/, ""), secreto, empresaId } : null;
}

/** MemoAI sin fotos subidas en el ERP usa la imagen de su landing, para no mostrar una tarjeta sin producto. */
const fotoPorDefecto = (p: { landing: string | null; nombre: string }) => (p.landing === "memoai" ? [{ url: "/images/memoai-producto.webp", alt: p.nombre }] : []);

async function desdeErp(fresco = false): Promise<ProductoCatalogo[] | null> {
  const erp = erpConfigurado();
  if (!erp) return null;
  try {
    const res = await fetch(`${erp.base}/api/v1/integraciones/tienda/catalogo?empresaId=${erp.empresaId}`, {
      headers: { "x-tienda-signature": erp.secreto },
      // Las paginas usan el catalogo cacheado; un pedido lo pide al momento (precio y stock reales).
      ...(fresco ? { cache: "no-store" as const } : { next: { revalidate: REVALIDAR, tags: ["catalogo"] } }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) throw new Error(`ERP respondio ${res.status}`);
    const { productos } = (await res.json()) as { productos: Omit<ProductoCatalogo, "fuente">[] };
    return productos.map((p) => ({ ...p, imagenes: p.imagenes.length ? p.imagenes : fotoPorDefecto(p), fuente: "erp" as const }));
  } catch (error) {
    console.error("Catalogo: no se pudo leer del ERP, se usa el respaldo", error);
    return null;
  }
}

const deSupabase = (p: Product): ProductoCatalogo => ({
  id: p.id,
  slug: p.slug,
  nombre: p.name,
  tagline: p.tagline ?? null,
  descripcion: p.description ?? null,
  categoria: p.slug === "memoai" ? "Grabadoras con IA" : null,
  precio: p.salePrice,
  precioAnterior: p.originalPrice ?? null,
  moneda: p.currency === "US$" || p.currency === "USD" ? "USD" : "PEN",
  disponibilidad: p.stock == null ? "sin_control" : p.stock <= 0 ? "agotado" : p.stock <= 5 ? "ultimas" : "disponible",
  unidades: p.stock != null && p.stock > 0 && p.stock <= 5 ? p.stock : null,
  destacado: p.slug === "memoai",
  imagenes: p.images.length ? p.images.map((url) => ({ url, alt: p.name })) : fotoPorDefecto({ landing: p.slug === "memoai" ? "memoai" : null, nombre: p.name }),
  videoUrl: null,
  beneficios: [],
  especificaciones: [],
  faq: [],
  landing: p.slug === "memoai" ? "memoai" : null,
  fuente: "tienda",
});

/** MemoAI con los datos de la landing: el ultimo respaldo para que la tienda nunca quede vacia. */
const MEMOAI: ProductoCatalogo = {
  id: "",
  slug: "memoai",
  nombre: "MemoAI — Grabadora inteligente con IA",
  tagline: PRODUCT.tagline,
  descripcion: "Graba reuniones, clases y entrevistas; la IA transcribe, resume y organiza tus notas.",
  categoria: "Grabadoras con IA",
  precio: PRODUCT.salePrice,
  precioAnterior: PRODUCT.originalPrice,
  moneda: "PEN",
  disponibilidad: "sin_control",
  unidades: null,
  destacado: true,
  imagenes: [{ url: "/images/memoai-producto.webp", alt: "Grabadora MemoAI" }],
  videoUrl: "/video/memoai-demo.mp4",
  beneficios: [],
  especificaciones: [],
  faq: [],
  landing: "memoai",
  fuente: "tienda",
};

async function respaldo(): Promise<ProductoCatalogo[]> {
  try {
    const productos = (await db.getProducts()).filter((p) => p.active).map(deSupabase);
    if (productos.length > 0) return productos;
  } catch (error) {
    console.error("Catalogo: no se pudo leer Supabase", error);
  }
  return [MEMOAI];
}

/** Productos publicados: destacados primero (el ERP ya los ordena). */
export async function listarProductos(): Promise<ProductoCatalogo[]> {
  return (await desdeErp()) ?? (await respaldo());
}

export async function productoPorSlug(slug: string): Promise<ProductoCatalogo | null> {
  return (await listarProductos()).find((p) => p.slug === slug) ?? null;
}

/**
 * Producto por el id que manda el checkout. El precio de un pedido SIEMPRE sale de aqui, nunca del navegador.
 * Sin id (la landing de MemoAI antes del catalogo) se toma MemoAI.
 */
export async function productoParaPedido(id: string | undefined | null): Promise<ProductoCatalogo | null> {
  const productos = (await desdeErp(true)) ?? (await respaldo());
  if (!id) return productos.find((p) => p.slug === "memoai") ?? null;
  return productos.find((p) => p.id === id) ?? null;
}
