"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, PackageCheck, ShoppingBag, Sparkles, Truck, Wallet } from "lucide-react";
import type { ProductoCatalogo } from "@/lib/catalogo";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { cn } from "@/lib/utils";
import { ProductoVisual } from "./ProductoVisual";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { descuentoDe, ETIQUETA_DISPONIBILIDAD, precioTexto, simbolo, whatsappHref } from "./comun";

const esYoutube = (url: string) => /youtu\.?be/.test(url);
const youtubeEmbed = (url: string) => {
  const id = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)?.[1];
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
};

/** Landing general de un producto: galeria, compra, beneficios, video, ficha tecnica y preguntas. Todo sale del ERP. */
export function ProductoLanding({ producto, whatsapp }: { producto: ProductoCatalogo; whatsapp: string }) {
  const [foto, setFoto] = useState(0);
  const [comprando, setComprando] = useState(false);
  const [abierta, setAbierta] = useState<number | null>(0);
  const descuento = descuentoDe(producto);
  const agotado = producto.disponibilidad === "agotado";
  const estado = ETIQUETA_DISPONIBILIDAD[producto.disponibilidad];
  const imagen = producto.imagenes[foto] ?? producto.imagenes[0];
  const wa = whatsappHref(whatsapp, `Hola DevmarkPE Store, quiero información sobre ${producto.nombre}.`);
  const checkout = { id: producto.id, name: producto.nombre, salePrice: producto.precio, originalPrice: producto.precioAnterior ?? producto.precio, currency: simbolo(producto.moneda) };

  const botonCompra = (
    <button type="button" onClick={() => setComprando(true)} disabled={agotado} className="s-btn s-btn-primary">
      <span className="s-tile"><ShoppingBag className="h-5 w-5" /></span>
      {agotado ? "Agotado" : "Comprar ahora"}
    </button>
  );

  return (
    <main id="contenido" className="flex flex-col gap-2 pb-24 sm:gap-3 md:pb-0">
      {/* Compra */}
      <section className="s-panel mt-2 bg-mist sm:mt-3">
        <div className="s-inner grid gap-10 pb-14 pt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:pb-20 lg:pt-32">
          <div>
            <Link href="/#productos" className="mb-5 inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink">
              <ChevronLeft className="h-4 w-4" /> Todos los productos
            </Link>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-ink">
              <ProductoVisual imagen={imagen} nombre={producto.nombre} categoria={producto.categoria} prioridad />
              {descuento > 0 && <span className="absolute left-4 top-4 rounded-lg bg-periwinkle px-2.5 py-1 text-sm font-semibold text-ink">-{descuento}%</span>}
            </div>
            {producto.imagenes.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {producto.imagenes.map((f, i) => (
                  <button key={f.url} type="button" onClick={() => setFoto(i)} aria-label={`Ver foto ${i + 1}`} aria-current={i === foto} className={cn("h-20 w-20 shrink-0 overflow-hidden rounded-xl ring-2 transition", i === foto ? "ring-indigo" : "ring-transparent opacity-70 hover:opacity-100")}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:pt-10">
            {producto.categoria && <p className="text-sm font-medium uppercase tracking-wide text-ink/50">{producto.categoria}</p>}
            <h1 className="s-display mt-2 text-[clamp(2.4rem,5vw,4.25rem)]">{producto.nombre}</h1>
            {producto.tagline && <p className="mt-4 text-[19px] leading-relaxed text-ink/70">{producto.tagline}</p>}
            <div className="mt-7 flex flex-wrap items-end gap-3">
              <span className="s-headline text-5xl tabular-nums">{precioTexto(producto.precio, producto.moneda)}</span>
              {descuento > 0 && <span className="pb-1 text-lg text-ink/45 line-through">{precioTexto(producto.precioAnterior!, producto.moneda)}</span>}
            </div>
            {estado && (
              <p className={cn("mt-2 text-sm font-medium", agotado ? "text-red-600" : producto.disponibilidad === "ultimas" ? "text-amber-700" : "text-emerald-700")}>
                {producto.unidades ? `Quedan ${producto.unidades} unidades` : estado}
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              {botonCompra}
              <a href={wa} target="_blank" rel="noopener noreferrer" className="s-btn s-btn-outline">
                <span className="s-tile"><WhatsAppIcon /></span>
                Consultar
              </a>
            </div>
            <ul className="mt-8 grid gap-3 border-t border-ink/10 pt-6 text-[15px]">
              {[
                { i: Truck, t: "Envío gratis a todo el Perú", s: "Lima hasta 2 días · provincia aprox. 3 días" },
                { i: Wallet, t: "Yape, Plin o contraentrega", s: "Pagas al confirmar tu pedido" },
                { i: PackageCheck, t: "Sigue tu pedido", s: "Te llega el número por correo y lo ves en tu cuenta" },
              ].map(({ i: Icono, t, s }) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-indigo"><Icono className="h-4 w-4" /></span>
                  <span><span className="block font-medium">{t}</span><span className="block text-sm text-ink/60">{s}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {(producto.descripcion || producto.beneficios.length > 0) && (
        <section className="s-panel bg-white py-16 sm:py-24">
          <div className="s-inner">
            {producto.descripcion && (
              <p className="s-headline max-w-[28ch] text-[clamp(1.8rem,3.4vw,2.9rem)] whitespace-pre-line">{producto.descripcion}</p>
            )}
            {producto.beneficios.length > 0 && (
              <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", producto.descripcion && "mt-12")}>
                {producto.beneficios.map((b) => (
                  <li key={b.titulo} className="s-lift rounded-2xl bg-mist p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-indigo"><Sparkles className="h-5 w-5" /></span>
                    <p className="s-headline mt-5 text-2xl">{b.titulo}</p>
                    {b.texto && <p className="mt-2 text-[15px] leading-relaxed text-ink/65">{b.texto}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {producto.videoUrl && (
        <section className="s-panel bg-ink py-16 text-white sm:py-24">
          <div className="s-inner">
            <h2 className="s-headline text-[clamp(2.1rem,4vw,3.5rem)]">Míralo <em>en acción</em></h2>
            <div className="mt-8 aspect-video overflow-hidden rounded-3xl bg-black">
              {esYoutube(producto.videoUrl) && youtubeEmbed(producto.videoUrl) ? (
                <iframe src={youtubeEmbed(producto.videoUrl)!} title={`Video de ${producto.nombre}`} className="h-full w-full" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
              ) : (
                <video src={producto.videoUrl} controls playsInline preload="metadata" className="h-full w-full" />
              )}
            </div>
          </div>
        </section>
      )}

      {(producto.especificaciones.length > 0 || producto.faq.length > 0) && (
        <section className="s-panel bg-white py-16 sm:py-24">
          <div className="s-inner grid gap-12 lg:grid-cols-2">
            {producto.especificaciones.length > 0 && (
              <div>
                <h2 className="s-headline text-[clamp(2rem,3.6vw,3rem)]">Ficha <em>técnica</em></h2>
                <dl className="mt-8 divide-y divide-ink/10 rounded-2xl border border-ink/10">
                  {producto.especificaciones.map((e) => (
                    <div key={e.nombre} className="grid grid-cols-[1fr_1.4fr] gap-4 px-5 py-3.5 text-[15px]">
                      <dt className="text-ink/55">{e.nombre}</dt>
                      <dd className="font-medium">{e.valor}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {producto.faq.length > 0 && (
              <div>
                <h2 className="s-headline text-[clamp(2rem,3.6vw,3rem)]">Preguntas <em>frecuentes</em></h2>
                <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                  {producto.faq.map((q, i) => (
                    <div key={q.pregunta}>
                      <button type="button" onClick={() => setAbierta(abierta === i ? null : i)} aria-expanded={abierta === i} className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium">
                        {q.pregunta}
                        <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform duration-300", abierta === i && "rotate-180")} />
                      </button>
                      {abierta === i && <p className="s-rise -mt-1 whitespace-pre-line pb-5 text-[15px] leading-relaxed text-ink/70">{q.respuesta}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Cierre */}
      <section className="s-panel bg-ink py-16 text-white sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-indigo/40 blur-[120px]" />
        <div className="s-inner relative flex flex-wrap items-center justify-between gap-8">
          <div>
            <p className="s-headline text-[clamp(2rem,4vw,3.25rem)]">{producto.nombre}</p>
            <p className="mt-2 text-lg text-ink-muted">{precioTexto(producto.precio, producto.moneda)} · envío gratis a todo el Perú</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {botonCompra}
            <a href={wa} target="_blank" rel="noopener noreferrer" className="s-btn s-btn-glass">
              <span className="s-tile"><WhatsAppIcon /></span>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Barra de compra fija en el celular */}
      <div className="s-glass-light fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-2xl p-2 pl-4 md:hidden">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{producto.nombre}</p>
          <p className="text-sm tabular-nums text-ink/60">{precioTexto(producto.precio, producto.moneda)}</p>
        </div>
        <button type="button" onClick={() => setComprando(true)} disabled={agotado} className="s-btn s-btn-primary s-btn-sm">
          <span className="s-tile"><ShoppingBag className="h-4 w-4" /></span>
          {agotado ? "Agotado" : "Comprar"}
        </button>
      </div>

      <CheckoutModal isOpen={comprando} onClose={() => setComprando(false)} product={checkout} />
    </main>
  );
}
