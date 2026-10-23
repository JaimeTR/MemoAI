import { createElement } from "react";
import { Bot, Glasses, Headphones, Mic, Sparkles, ToyBrick, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONOS: [RegExp, LucideIcon][] = [
  [/grabad|memo|voz/i, Mic],
  [/lente|gafa/i, Glasses],
  [/aud[ií]fono|auricular/i, Headphones],
  [/juguete|robot/i, ToyBrick],
  [/asistente|ia\b/i, Bot],
];

export function iconoDe(texto: string | null | undefined): LucideIcon {
  return ICONOS.find(([re]) => re.test(texto ?? ""))?.[1] ?? Sparkles;
}

/** Icono segun la categoria o el nombre (sin crear componentes durante el render). */
export function IconoCategoria({ texto, className }: { texto: string | null | undefined; className?: string }) {
  return createElement(iconoDe(texto), { className });
}

/** Foto del producto o, si aun no tiene, una ilustracion con la marca (nunca una caja vacia). */
export function ProductoVisual({ imagen, nombre, categoria, className, prioridad }: { imagen?: { url: string; alt: string }; nombre: string; categoria: string | null; className?: string; prioridad?: boolean }) {
  if (imagen) {
    return (
      // Las fotos llegan del Storage del ERP (dominio variable): <img> simple, con carga diferida.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imagen.url} alt={imagen.alt || nombre} loading={prioridad ? "eager" : "lazy"} className={cn("h-full w-full object-cover", className)} />
    );
  }
  return (
    <div aria-hidden className={cn("relative grid h-full w-full place-items-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#3d34bc,#110c29_70%)]", className)}>
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:28px_28px]" />
      <span className="relative grid h-20 w-20 place-items-center rounded-2xl bg-white/10 text-periwinkle ring-1 ring-white/15 backdrop-blur">
        <IconoCategoria texto={categoria ?? nombre} className="h-9 w-9" />
      </span>
    </div>
  );
}
