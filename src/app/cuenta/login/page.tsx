"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/cuenta` },
    });
    setState(error ? "error" : "sent");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo size="lg" />
        </div>

        <motion.div
          className="rounded-3xl bg-surface border border-border p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {state === "sent" ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="font-heading text-lg font-bold mb-2">Revisa tu correo</h1>
              <p className="text-sm text-text-muted">
                Te enviamos un link a <span className="text-foreground font-medium">{email}</span> para entrar a tu cuenta.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-xl font-bold mb-1">Mi cuenta</h1>
              <p className="text-sm text-text-muted mb-6">
                Ingresa tu email y te mandamos un link para entrar — sin contraseña.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-surface-light/60 border border-border text-foreground placeholder-text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm"
                />
                {state === "error" && (
                  <p className="text-xs text-red-500">No se pudo enviar el link. Intenta de nuevo.</p>
                )}
                <Button type="submit" disabled={state === "sending"} className="w-full">
                  {state === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Enviarme el link
                </Button>
              </form>
            </>
          )}
        </motion.div>

        <div className="mt-6 text-center">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a la tienda
          </a>
        </div>
      </div>
    </main>
  );
}
