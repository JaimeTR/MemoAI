"use client";

import { CreditCard } from "lucide-react";

export default function PagosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold mb-1">Métodos de pago</h1>
        <p className="text-sm text-text-muted">Guarda tus métodos de pago para comprar más rápido.</p>
      </div>

      <div className="rounded-2xl bg-surface border border-border p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-5 h-5 text-accent" />
        </div>
        <h2 className="font-semibold text-sm mb-1">Próximamente</h2>
        <p className="text-xs text-text-muted max-w-xs mx-auto">
          Todavía no puedes guardar tarjetas aquí. Por ahora, cada compra se paga por Yape, Plin, transferencia o WhatsApp desde el checkout.
        </p>
      </div>
    </div>
  );
}
