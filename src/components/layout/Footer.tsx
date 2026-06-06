import { PRODUCT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="md:col-span-2">
            <a href="#" className="text-xl font-bold tracking-tight">
              <span className="gradient-text">MEMO</span>
              <span className="text-foreground">AI</span>
            </a>
            <p className="text-sm text-text-muted mt-3 max-w-sm">
              Grabadora inteligente con IA. Graba, transcribe y resume automáticamente
              reuniones, clases y entrevistas.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Producto</h4>
            <ul className="space-y-2">
              {["Beneficios", "Cómo funciona", "Testimonios", "FAQ"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s/g, "-")}`} className="text-sm text-text-muted hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {["Términos y condiciones", "Política de privacidad", "Política de devoluciones", "Garantía"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-text-muted hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} {PRODUCT.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">Métodos de pago:</span>
            <div className="flex gap-2">
              {["Culqi", "Mercado Pago", "Izipay"].map((method) => (
                <span key={method} className="px-2 py-1 rounded text-[10px] bg-white/5 text-text-muted">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
