"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, UserRound, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { whatsappHref } from "./comun";

const NAV = [
  { href: "/#productos", label: "Productos" },
  { href: "/#como-comprar", label: "Cómo comprar" },
  { href: "/envios", label: "Envíos" },
  { href: "/#preguntas", label: "Preguntas" },
];

/**
 * Logotipo de DevmarkPE Store (bolsa + DEVMARK + STORE). `claro` = va sobre fondo oscuro.
 * `completo` agrega el lema "Tecnologia con IA" (pie de pagina); la barra usa la version sin lema.
 */
export function StoreLogo({ claro, completo }: { claro?: boolean; completo?: boolean }) {
  const archivo = `/marca/devmarkstore-logotipo${completo ? "" : "-sin-lema"}${claro ? "-fondo-oscuro" : ""}.svg`;
  return (
    <Image
      src={archivo}
      alt="DevmarkPE Store"
      width={completo ? 300 : 207}
      height={completo ? 58 : 40}
      className={completo ? "h-[58px] w-auto" : "h-9 w-auto sm:h-10"}
      priority={!completo}
    />
  );
}

/** Barra de vidrio flotante: oscura sobre el hero y clara al bajar. */
export function StoreHeader({ whatsapp, claro = false }: { whatsapp: string; /** La pagina empieza sobre fondo claro. */ claro?: boolean }) {
  const [bajado, setBajado] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const alBajar = () => setBajado(window.scrollY > 40);
    alBajar();
    window.addEventListener("scroll", alBajar, { passive: true });
    return () => window.removeEventListener("scroll", alBajar);
  }, []);

  const oscuro = !claro && !bajado && !abierto;
  const wa = whatsappHref(whatsapp, "Hola DevmarkPE Store, tengo una consulta.");

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-indigo focus:px-3 focus:py-2 focus:text-white">
        Saltar al contenido
      </a>
      <div className={cn("mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 rounded-2xl pl-3 pr-2 transition-colors duration-500", oscuro ? "s-glass-dark text-white" : "s-glass-light text-ink")}>
        <Link href="/" aria-label="DevmarkPE Store, inicio">
          <StoreLogo claro={oscuro} />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={cn("rounded-lg px-3 py-2 text-[15px] font-medium transition-colors", oscuro ? "text-white/75 hover:text-white" : "text-ink/70 hover:text-ink")}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <Link href="/cuenta" aria-label="Mi cuenta y pedidos" className={cn("hidden h-10 w-10 place-items-center rounded-lg sm:grid", oscuro ? "hover:bg-white/10" : "hover:bg-ink/[0.06]")}>
            <UserRound className="h-5 w-5" />
          </Link>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="s-btn s-btn-primary s-btn-sm hidden md:inline-flex">
            <span className="s-tile">
              <WhatsAppIcon className="h-4 w-4" />
            </span>
            Escríbenos
          </a>
          <button type="button" onClick={() => setAbierto((v) => !v)} aria-expanded={abierto} aria-label={abierto ? "Cerrar menú" : "Abrir menú"} className={cn("grid h-11 w-11 place-items-center rounded-lg lg:hidden", oscuro ? "bg-white/10" : "bg-ink/[0.06]")}>
            {abierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {abierto && (
        <div className="s-glass-light s-rise mx-auto mt-2 max-w-[1240px] rounded-2xl p-3 text-ink lg:hidden">
          <nav className="grid" aria-label="Menú">
            {[...NAV, { href: "/cuenta", label: "Mi cuenta y pedidos" }].map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setAbierto(false)} className="s-headline rounded-xl px-3 py-2.5 text-2xl hover:bg-mist">
                {n.label}
              </Link>
            ))}
          </nav>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="s-btn s-btn-primary mt-3 w-full">
            <span className="s-tile">
              <WhatsAppIcon />
            </span>
            Escríbenos por WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
