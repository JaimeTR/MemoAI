"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { Package, Check, Clock, MapPin, XCircle, ShoppingCart } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import type { Order } from "@/lib/db";

const STEPS: { key: Order["status"]; label: string; description: string }[] = [
  { key: "pending", label: "Pedido recibido", description: "Registramos tu compra" },
  { key: "paid", label: "Pago confirmado", description: "Verificamos tu pago" },
  { key: "shipped", label: "En camino", description: "Tu MemoAI va hacia ti" },
  { key: "delivered", label: "Entregado", description: "Disfruta tu MemoAI" },
];

export default function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((d) => setOrder(d.order))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const currentIndex = order ? STEPS.findIndex((s) => s.key === order.status) : -1;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" />
        </div>

        {loading && (
          <div className="text-center text-text-muted text-sm">Buscando tu pedido…</div>
        )}

        {!loading && (notFound || !order) && (
          <div className="rounded-3xl bg-surface border border-border p-8 text-center">
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h1 className="font-heading text-xl font-semibold mb-2">Pedido no encontrado</h1>
            <p className="text-sm text-text-muted mb-6">
              Revisa el enlace o el número de pedido. Si crees que es un error, escríbenos por WhatsApp.
            </p>
            <Button onClick={() => (window.location.href = "/")}>Volver al inicio</Button>
          </div>
        )}

        {!loading && order && order.status === "cancelled" && (
          <div className="rounded-3xl bg-surface border border-border p-8 text-center">
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <h1 className="font-heading text-xl font-semibold mb-2">Pedido cancelado</h1>
            <p className="text-sm text-text-muted mb-2">
              Pedido <span className="font-mono text-foreground">{order.id}</span>
            </p>
            <p className="text-sm text-text-muted mb-6">
              Este pedido fue cancelado. Si tienes dudas, escríbenos por WhatsApp.
            </p>
          </div>
        )}

        {!loading && order && order.status !== "cancelled" && (
          <motion.div
            className="rounded-3xl bg-surface border border-border p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-text-muted">Pedido</p>
                <p className="font-mono text-sm font-semibold truncate">{order.id}</p>
              </div>
            </div>

            <div className="rounded-xl bg-surface-light/60 border border-border p-4 mb-6 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
              <p className="text-xs text-text-muted">
                Envío a {order.city}, {order.department}
              </p>
            </div>

            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const completed = i < currentIndex || (i === currentIndex && order.status === "delivered");
                const current = i === currentIndex && order.status !== "delivered";
                const isLast = i === STEPS.length - 1;

                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                          completed ? "bg-emerald-500" : current ? "bg-accent" : "bg-foreground/10"
                        }`}
                      >
                        {completed ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : current ? (
                          <Clock className="h-4 w-4 text-white" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-text-muted/40" />
                        )}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 flex-1 min-h-[2.5rem] ${completed ? "bg-emerald-500" : "bg-border"}`} />
                      )}
                    </div>
                    <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                      <h3 className={`text-sm font-semibold ${completed || current ? "text-foreground" : "text-text-muted"}`}>
                        {step.label}
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 pt-6 border-t border-border flex items-center justify-between">
              <span className="text-sm text-text-muted">Total</span>
              <span className="text-lg font-bold">S/ {order.amount}</span>
            </div>

            <Button className="w-full mt-6" onClick={() => (window.location.href = "/")}>
              <ShoppingCart className="w-4 h-4" />
              Volver a la tienda
            </Button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
