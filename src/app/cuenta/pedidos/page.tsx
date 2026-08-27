"use client";

import { useEffect, useState } from "react";
import { Package, ChevronRight } from "lucide-react";
import type { Order } from "@/lib/db";

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const STATUS_COLOR: Record<Order["status"], string> = {
  pending: "bg-amber-500/10 text-amber-600",
  paid: "bg-accent/10 text-accent",
  shipped: "bg-accent/10 text-accent",
  delivered: "bg-emerald-500/10 text-emerald-600",
  cancelled: "bg-red-500/10 text-red-600",
};

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold mb-1">Mis pedidos</h1>
        <p className="text-sm text-text-muted">Historial completo de tus compras.</p>
      </div>

      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-text-muted text-center">Cargando…</p>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-8 h-8 text-text-muted/40 mx-auto mb-3" />
            <p className="text-sm text-text-muted">Todavía no tienes pedidos.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <a
                key={order.id}
                href={`/pedido/${order.id}`}
                className="flex items-center gap-3 p-4 hover:bg-foreground/[0.02] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-mono truncate">{order.id}</p>
                  <p className="text-[11px] text-text-muted">
                    {order.product} · {order.quantity} u. · S/ {order.amount} · {new Date(order.createdAt).toLocaleDateString("es-PE")}
                  </p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-full shrink-0 ${STATUS_COLOR[order.status]}`}>
                  {STATUS_LABEL[order.status]}
                </span>
                <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
