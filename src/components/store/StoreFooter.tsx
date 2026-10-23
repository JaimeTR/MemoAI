import Link from "next/link";
import { BookOpen } from "lucide-react";
import { StoreLogo } from "./StoreHeader";

const POLITICAS = [
  { href: "/envios", label: "Envíos y entregas" },
  { href: "/politica-de-compras", label: "Política de compras" },
  { href: "/terminos", label: "Términos y condiciones" },
  { href: "/privacidad", label: "Privacidad" },
];

export function StoreFooter() {
  return (
    <footer className="s-panel mb-2 mt-2 bg-ink text-white sm:mb-3 sm:mt-3">
      <div className="s-inner grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <StoreLogo claro />
          <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-ink-muted">
            Tecnología con inteligencia artificial, elegida por DEVMARK. Envío gratis a todo el Perú.
          </p>
          <a href="https://devmarkpe.com" target="_blank" rel="noopener" className="mt-5 inline-block text-sm text-periwinkle hover:text-white">
            Una tienda de DEVMARK · devmarkpe.com
          </a>
        </div>
        <nav aria-label="Políticas">
          <p className="text-sm font-medium text-white/50">Políticas</p>
          <ul className="mt-3 grid gap-2 text-[15px]">
            {POLITICAS.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-white/80 hover:text-white">{p.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-sm font-medium text-white/50">Tu compra</p>
          <ul className="mt-3 grid gap-2 text-[15px]">
            <li><Link href="/cuenta" className="text-white/80 hover:text-white">Mi cuenta y pedidos</Link></li>
            <li><Link href="/#como-comprar" className="text-white/80 hover:text-white">Cómo comprar</Link></li>
          </ul>
          <a href="https://devmarkpe.com/libro-de-reclamaciones" target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white hover:border-white/30">
            <BookOpen className="h-4 w-4" /> Libro de Reclamaciones
          </a>
        </div>
      </div>
      <div className="s-inner flex flex-wrap justify-between gap-2 border-t border-white/10 py-5 text-sm text-white/50">
        <span>© {new Date().getFullYear()} DEVMARK. Todos los derechos reservados.</span>
        <span>Pagos con Yape, Plin o contraentrega</span>
      </div>
    </footer>
  );
}
