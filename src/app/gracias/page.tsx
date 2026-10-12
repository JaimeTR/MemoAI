"use client";


import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Package, Truck, ShieldCheck, Mail, Loader2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useSearchParams } from "next/navigation";
import type { ShopSettings } from "@/lib/db";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function GraciasContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") ?? "";
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [magicLinkState, setMagicLinkState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => setCustomerEmail(d.order?.customerEmail || ""))
      .catch(() => {});
  }, [orderId]);

  const handleAccountLogin = async () => {
    if (!customerEmail) return;
    setMagicLinkState("sending");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: customerEmail,
      options: { emailRedirectTo: `${window.location.origin}/cuenta` },
    });
    setMagicLinkState(error ? "error" : "sent");
  };

  const whatsappNumber = settings?.whatsappNumber.replace(/\D/g, "") || "51975646074";

  const steps = [
    { icon: CheckCircle2, title: "Pedido recibido", desc: "Registramos tu compra correctamente" },
    { icon: Package, title: "Preparamos tu envío", desc: "Empacamos tu MemoAI con cuidado" },
    { icon: Truck, title: "Llega a tu puerta", desc: "Envío gratis: Lima 2 días, provincia 3 días aprox." },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-xl mx-auto w-full"
      >
        <div className="mb-6">
          <Logo size="lg" />
        </div>

        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="font-heading text-2xl md:text-4xl font-bold mb-3">
          ¡Gracias por tu compra!
        </h1>

        {orderId && (
          <p className="text-sm text-text-muted mb-4">
            Tu número de pedido: <span className="text-foreground font-mono">{orderId}</span>
          </p>
        )}

        <p className="text-text-muted mb-8 text-sm md:text-base">
          Tu MemoAI está en camino. Te enviaremos la confirmación y el seguimiento de tu pedido.
        </p>

        {/* Steps */}
        <div className="grid gap-3 mb-8 text-left">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border shadow-[0_2px_12px_rgba(10,10,10,0.04)]"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                  <p className="text-xs text-text-muted">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust */}
        <div className="flex items-center justify-center gap-4 mb-8 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Pago 100% seguro
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-accent" />
            Envío gratis
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderId ? `Hola, acabo de comprar MemoAI. Quiero confirmar mi pedido ${orderId}.` : "Hola, acabo de comprar MemoAI. Quiero confirmar mi pedido.")}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-5 h-5" />
            Confirmar por WhatsApp
          </a>
          {orderId && (
            <a
              href={`/pedido/${orderId}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-foreground font-semibold hover:bg-white/90 transition-colors shadow-[0_8px_24px_rgba(10,10,10,0.1)]"
            >
              <Package className="w-5 h-5" />
              Ver estado de mi pedido
            </a>
          )}
        </div>

        {customerEmail && (
          <div className="mt-4">
            {magicLinkState === "sent" ? (
              <p className="text-sm text-emerald-600 flex items-center justify-center gap-1.5">
                <Mail className="w-4 h-4" />
                Revisa tu correo — te enviamos un link para entrar a tu cuenta.
              </p>
            ) : (
              <button
                onClick={handleAccountLogin}
                disabled={magicLinkState === "sending"}
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-light font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                {magicLinkState === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {magicLinkState === "error" ? "No se pudo enviar, intenta de nuevo" : "Entrar a mi cuenta — ver todas mis compras"}
              </button>
            )}
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="text-sm text-text-muted hover:text-foreground transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-text-muted">Cargando...</div>}>
      <GraciasContent />
    </Suspense>
  );
}
