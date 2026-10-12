"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, PackageX } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { BuyButton } from "@/components/ui/BuyButton";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import type { Product } from "@/lib/db";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.products as Product[])?.find((p) => p.slug === slug && p.active);
        if (found) setProduct(found);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-text-muted">Cargando…</p>
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <PackageX className="w-10 h-10 text-text-muted/40 mb-4" />
        <h1 className="font-heading text-xl font-semibold mb-2">Producto no encontrado</h1>
        <p className="text-sm text-text-muted mb-6">Este producto no existe o ya no está disponible.</p>
        <Button onClick={() => (window.location.href = "/")}>Volver al inicio</Button>
      </main>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="noise-bg min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo size="sm" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="aspect-square rounded-3xl bg-surface-light/60 border border-border overflow-hidden flex items-center justify-center"
          >
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <PackageX className="w-16 h-16 text-text-muted/30" />
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            {product.tagline && <p className="text-lg text-text-muted mb-4">{product.tagline}</p>}

            <div className="flex items-center gap-3 mb-6">
              {product.originalPrice && product.originalPrice > product.salePrice && (
                <span className="text-lg text-text-muted line-through">
                  {product.currency} {product.originalPrice}
                </span>
              )}
              <span className="text-3xl font-bold gradient-text">
                {product.currency} {product.salePrice}
              </span>
              {discount > 0 && (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-accent text-white">{discount}% OFF</span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-text-muted leading-relaxed mb-8 whitespace-pre-line">{product.description}</p>
            )}

            <BuyButton onClick={() => setCheckoutOpen(true)} size="lg" className="w-full sm:w-auto mb-6">
              COMPRAR AHORA
            </BuyButton>

            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Pago seguro
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-accent" />
                Envío a todo el Perú
              </span>
            </div>
          </motion.div>
        </div>
      </main>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          salePrice: product.salePrice,
          originalPrice: product.originalPrice || product.salePrice,
          currency: product.currency,
        }}
      />
      <WhatsAppButton />
    </div>
  );
}
