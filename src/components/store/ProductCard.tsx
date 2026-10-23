import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductoCatalogo } from "@/lib/catalogo";
import { cn } from "@/lib/utils";
import { descuentoDe, ETIQUETA_DISPONIBILIDAD, precioTexto } from "./comun";
import { ProductoVisual } from "./ProductoVisual";

export function ProductCard({ producto, grande }: { producto: ProductoCatalogo; grande?: boolean }) {
  const descuento = descuentoDe(producto);
  const estado = ETIQUETA_DISPONIBILIDAD[producto.disponibilidad];
  const agotado = producto.disponibilidad === "agotado";
  return (
    <Link
      href={`/producto/${producto.slug}`}
      className={cn("s-lift group flex flex-col overflow-hidden rounded-2xl bg-mist text-ink", grande && "md:col-span-2 md:grid md:grid-cols-[1.1fr_1fr]")}
    >
      <div className={cn("relative aspect-square overflow-hidden bg-ink", grande && "md:aspect-auto md:min-h-[380px]")}>
        <ProductoVisual imagen={producto.imagenes[0]} nombre={producto.nombre} categoria={producto.categoria} prioridad={grande} className="transition-transform duration-700 group-hover:scale-[1.04]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {descuento > 0 && <span className="rounded-lg bg-periwinkle px-2 py-1 text-xs font-semibold text-ink">-{descuento}%</span>}
          {producto.destacado && <span className="s-glass-dark rounded-lg px-2 py-1 text-xs text-white">Destacado</span>}
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col p-5", grande && "md:p-8")}>
        {producto.categoria && <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{producto.categoria}</p>}
        <h3 className={cn("s-headline mt-1.5 text-2xl", grande && "md:text-4xl")}>{producto.nombre}</h3>
        {producto.tagline && <p className={cn("mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink/65", grande && "md:line-clamp-3 md:text-[17px]")}>{producto.tagline}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {producto.precioAnterior && producto.precioAnterior > producto.precio && <p className="text-sm text-ink/45 line-through">{precioTexto(producto.precioAnterior, producto.moneda)}</p>}
            <p className={cn("s-headline text-2xl tabular-nums", agotado && "text-ink/40")}>{precioTexto(producto.precio, producto.moneda)}</p>
            {estado && <p className={cn("mt-1 text-xs", agotado ? "text-red-600" : producto.disponibilidad === "ultimas" ? "text-amber-700" : "text-emerald-700")}>{estado}</p>}
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-white transition-colors group-hover:bg-indigo">
            <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
          </span>
        </div>
      </div>
    </Link>
  );
}
