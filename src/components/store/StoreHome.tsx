"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownRight, Bell, ChevronDown, CreditCard, PackageCheck, ShieldCheck, Truck, Wallet } from "lucide-react";
import type { ProductoCatalogo } from "@/lib/catalogo";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { IconoCategoria, ProductoVisual } from "./ProductoVisual";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { descuentoDe, precioTexto, whatsappHref } from "./comun";

/** Lineas que la tienda va a sumar. Las que ya tienen productos no se muestran como "pronto". */
const PROXIMAS = [
  { nombre: "Lentes inteligentes", texto: "Lentes con cámara, audio y asistente con IA." },
  { nombre: "Audífonos con IA", texto: "Traducción en tiempo real y resúmenes de llamadas." },
  { nombre: "Juguetes con IA", texto: "Robots y compañeros que conversan y enseñan." },
  { nombre: "Asistentes de voz", texto: "Altavoces y dispositivos que responden y organizan." },
];

const CONFIANZA = [
  { icono: Truck, titulo: "Envío gratis a todo el Perú", texto: "Lima hasta 2 días · provincia aprox. 3 días" },
  { icono: Wallet, titulo: "Paga con Yape o Plin", texto: "O contraentrega donde esté disponible" },
  { icono: PackageCheck, titulo: "Sigue tu pedido", texto: "Con tu cuenta, desde el correo de confirmación" },
  { icono: ShieldCheck, titulo: "Respaldo de DEVMARK", texto: "Empresa de tecnología en Lima" },
];

const PASOS = [
  { n: "01", titulo: "Elige tu producto", texto: "Revisa la ficha, el video y las preguntas frecuentes. Si tienes dudas, escríbenos." },
  { n: "02", titulo: "Haz tu pedido", texto: "Completa tus datos y la dirección. Paga con Yape o Plin, o elige contraentrega." },
  { n: "03", titulo: "Recíbelo en casa", texto: "Te avisamos por correo y WhatsApp. Lima hasta 2 días, provincia aprox. 3 días." },
];

const PREGUNTAS = [
  { p: "¿Cuánto demora el envío?", r: "En Lima Metropolitana hasta 2 días. A provincia aproximadamente 3 días, por Shalom u otra agencia que elijas. El envío es gratis a todo el Perú." },
  { p: "¿Cómo pago?", r: "Con Yape o Plin: al terminar tu pedido ves el número y el QR, y nos envías la captura por WhatsApp. También puedes elegir contraentrega donde esté disponible." },
  { p: "¿Cómo sigo mi pedido?", r: "Al comprar te llega un correo con el número de pedido y un enlace a tu cuenta, donde ves el estado. También puedes escribirnos por WhatsApp con tu número de pedido." },
  { p: "¿Quién está detrás de la tienda?", r: "DEVMARK, una empresa de desarrollo de software y tecnología de Lima, Perú. Elegimos cada producto que vendemos y te atendemos directo por WhatsApp." },
];

export function StoreHome({ productos, whatsapp }: { productos: ProductoCatalogo[]; whatsapp: string }) {
  const [categoria, setCategoria] = useState<string | null>(null);
  const [abierta, setAbierta] = useState<number | null>(0);
  const categorias = useMemo(() => [...new Set(productos.map((p) => p.categoria).filter((c): c is string => !!c))], [productos]);
  const visibles = categoria ? productos.filter((p) => p.categoria === categoria) : productos;
  const estrella = productos.find((p) => p.destacado) ?? productos[0];
  const proximas = PROXIMAS.filter((c) => !categorias.some((k) => k.toLowerCase() === c.nombre.toLowerCase()));
  const banda = [...new Set([...categorias, ...PROXIMAS.map((c) => c.nombre)])];

  return (
    <main id="contenido" className="flex flex-col gap-2 sm:gap-3">
      {/* Portada */}
      <section className="s-panel mt-2 bg-ink text-white sm:mt-3">
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-24 h-[560px] w-[560px] rounded-full bg-indigo/40 blur-[130px]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_30%,#000,transparent_70%)]" />
        <div className="s-inner relative grid items-center gap-12 pb-16 pt-32 lg:grid-cols-[1.15fr_1fr] lg:pb-24 lg:pt-40">
          <div className="s-rise">
            <p className="s-glass-dark inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Tecnología con IA · envío gratis a todo el Perú
            </p>
            <h1 className="s-display mt-6 text-[clamp(2.75rem,6.6vw,5.5rem)]">
              Gadgets con IA que <em>trabajan por ti.</em>
            </h1>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-ink-muted">
              Grabadoras que transcriben solas, lentes y audífonos con asistente, juguetes que conversan. Tecnología elegida por DEVMARK, con pago fácil y entrega en todo el país.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#productos" className="s-btn s-btn-primary">
                <span className="s-tile"><ArrowDownRight className="h-5 w-5" /></span>
                Ver productos
              </a>
              <a href={whatsappHref(whatsapp, "Hola DevmarkPE Store, quiero información sobre sus productos.")} target="_blank" rel="noopener noreferrer" className="s-btn s-btn-glass">
                <span className="s-tile"><WhatsAppIcon /></span>
                Escríbenos
              </a>
            </div>
          </div>

          {estrella && (
            <Link href={`/producto/${estrella.slug}`} className="s-rise group relative mx-auto w-full max-w-[460px]" style={{ animationDelay: "0.15s" }}>
              <div className="s-glass-dark overflow-hidden rounded-3xl p-2">
                <div className="aspect-square overflow-hidden rounded-[18px]">
                  <ProductoVisual imagen={estrella.imagenes[0]} nombre={estrella.nombre} categoria={estrella.categoria} prioridad className="transition-transform duration-700 group-hover:scale-[1.04]" />
                </div>
              </div>
              <div className="s-glass-light absolute -bottom-6 left-4 right-4 flex items-center justify-between gap-3 rounded-2xl p-4 text-ink sm:left-8 sm:right-8">
                <div className="min-w-0">
                  <p className="text-xs text-ink/55">{estrella.categoria ?? "Destacado"}</p>
                  <p className="truncate font-medium">{estrella.nombre}</p>
                </div>
                <div className="text-right">
                  {descuentoDe(estrella) > 0 && <p className="text-xs font-semibold text-indigo">-{descuentoDe(estrella)}%</p>}
                  <p className="s-headline text-xl tabular-nums">{precioTexto(estrella.precio, estrella.moneda)}</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Banda de categorias */}
      <div className="s-panel bg-band py-5" aria-hidden>
        <div className="s-marquee gap-10 pr-10">
          {[...banda, ...banda, ...banda, ...banda].map((c, i) => (
            <span key={i} className="s-headline flex items-center gap-3 whitespace-nowrap text-2xl text-ink sm:text-3xl">
              <IconoCategoria texto={c} className="h-6 w-6 text-indigo" /> {c}
            </span>
          ))}
        </div>
      </div>

      {/* Productos */}
      <section id="productos" className="s-panel scroll-mt-20 bg-white py-16 sm:py-24">
        <div className="s-inner">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="s-headline text-[clamp(2.1rem,4vw,3.5rem)]">
              Nuestros <em>productos</em>
            </h2>
            {categorias.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
                {[null, ...categorias].map((c) => (
                  <button
                    key={c ?? "todos"}
                    type="button"
                    onClick={() => setCategoria(c)}
                    aria-pressed={categoria === c}
                    className={cn("rounded-full px-4 py-2 text-sm transition-colors", categoria === c ? "bg-ink text-white" : "bg-mist text-ink/70 hover:text-ink")}
                  >
                    {c ?? "Todos"}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibles.map((p, i) => (
              <ProductCard key={p.slug} producto={p} grande={i === 0 && !categoria && visibles.length > 1 && p.destacado} />
            ))}
          </div>

          {proximas.length > 0 && !categoria && (
            <div className="mt-14">
              <p className="text-sm font-medium uppercase tracking-wide text-ink/50">Muy pronto en la tienda</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {proximas.map((c) => (
                    <a
                      key={c.nombre}
                      href={whatsappHref(whatsapp, `Hola, avísenme cuando lleguen productos de "${c.nombre}" a la tienda.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="s-lift group flex flex-col rounded-2xl border border-dashed border-ink/15 p-5"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-mist text-indigo transition-colors group-hover:bg-indigo group-hover:text-white">
                        <IconoCategoria texto={c.nombre} className="h-5 w-5" />
                      </span>
                      <span className="mt-4 font-medium">{c.nombre}</span>
                      <span className="mt-1 text-sm text-ink/60">{c.texto}</span>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo">
                        <Bell className="h-4 w-4" /> Avísame
                      </span>
                    </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Confianza */}
      <section className="s-panel bg-mist py-10">
        <ul className="s-inner grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONFIANZA.map(({ icono: Icono, titulo, texto }) => (
            <li key={titulo} className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-indigo">
                <Icono className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-medium">{titulo}</span>
                <span className="block text-sm text-ink/60">{texto}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Como comprar */}
      <section id="como-comprar" className="s-panel scroll-mt-20 bg-ink py-16 text-white sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-indigo/30 blur-[120px]" />
        <div className="s-inner relative">
          <h2 className="s-headline text-[clamp(2.1rem,4vw,3.5rem)]">
            Comprar es <em>así de simple</em>
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {PASOS.map((p) => (
              <li key={p.n} className="s-glass-dark rounded-2xl p-6">
                <span className="text-sm tabular-nums text-periwinkle">{p.n}</span>
                <p className="s-headline mt-3 text-2xl">{p.titulo}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{p.texto}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
            <CreditCard className="h-4 w-4 text-periwinkle" /> Por ahora no aceptamos tarjeta: pagas con Yape, Plin o contraentrega.
          </div>
        </div>
      </section>

      {/* Preguntas */}
      <section id="preguntas" className="s-panel scroll-mt-20 bg-white py-16 sm:py-24">
        <div className="s-inner grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="s-headline text-[clamp(2.1rem,4vw,3.5rem)]">
              Preguntas <em>frecuentes</em>
            </h2>
            <p className="mt-4 max-w-[40ch] text-[17px] text-ink/65">¿Algo más? Te respondemos por WhatsApp.</p>
            <a href={whatsappHref(whatsapp, "Hola DevmarkPE Store, tengo una pregunta.")} target="_blank" rel="noopener noreferrer" className="s-btn s-btn-outline mt-6">
              <span className="s-tile"><WhatsAppIcon /></span>
              Escríbenos
            </a>
          </div>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {PREGUNTAS.map((q, i) => (
              <div key={q.p}>
                <button type="button" onClick={() => setAbierta(abierta === i ? null : i)} aria-expanded={abierta === i} className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium">
                  {q.p}
                  <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform duration-300", abierta === i && "rotate-180")} />
                </button>
                {abierta === i && <p className="s-rise -mt-1 pb-5 text-[15px] leading-relaxed text-ink/70">{q.r}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
