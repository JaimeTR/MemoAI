"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Users, DollarSign, Clock, ArrowLeft, RefreshCw } from "lucide-react";
import type { Order, Customer } from "@/lib/db";

type Tab = "dashboard" | "orders" | "customers";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const ADMIN_PASSWORD = "memoai2024";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      fetchData();
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, customersRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/customers"),
      ]);
      const ordersData = await ordersRes.json();
      const customersData = await customersRes.json();
      setOrders(ordersData.orders || []);
      setCustomers(customersData.customers || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md p-8 rounded-2xl glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-center">
            <span className="gradient-text">MEMOAI</span> Admin
          </h1>
          <p className="text-text-muted text-center mb-8">Ingresa la contraseña de administrador</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder-text-muted/50 focus:outline-none focus:border-accent/50"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-light text-white font-medium transition-colors cursor-pointer"
            >
              Ingresar
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.amount, 0),
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    totalCustomers: customers.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Volver al sitio</span>
            </a>
            <div className="w-px h-6 bg-border" />
            <h1 className="text-xl font-bold">
              <span className="gradient-text">MEMOAI</span> Admin
            </h1>
          </div>
          <button
            onClick={fetchData}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Actualizar"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          {(["dashboard", "orders", "customers"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                tab === t ? "bg-accent text-white" : "bg-surface text-text-muted hover:text-foreground"
              }`}
            >
              {t === "dashboard" ? "Dashboard" : t === "orders" ? "Pedidos" : "Clientes"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            {tab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={<Package className="w-6 h-6" />}
                  label="Total Pedidos"
                  value={stats.totalOrders}
                  color="text-blue-400"
                />
                <StatCard
                  icon={<DollarSign className="w-6 h-6" />}
                  label="Ingresos"
                  value={`S/ ${stats.totalRevenue}`}
                  color="text-emerald-400"
                />
                <StatCard
                  icon={<Clock className="w-6 h-6" />}
                  label="Pendientes"
                  value={stats.pendingOrders}
                  color="text-yellow-400"
                />
                <StatCard
                  icon={<Users className="w-6 h-6" />}
                  label="Clientes"
                  value={stats.totalCustomers}
                  color="text-purple-400"
                />
              </div>
            )}

            {tab === "orders" && (
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Monto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Fecha</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-sm font-mono">{order.id.slice(0, 12)}...</td>
                          <td className="px-4 py-3 text-sm">{order.customerName}</td>
                          <td className="px-4 py-3 text-sm text-text-muted">{order.customerEmail}</td>
                          <td className="px-4 py-3 text-sm font-medium">S/ {order.amount}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3 text-sm text-text-muted">
                            {new Date(order.createdAt).toLocaleDateString("es-PE")}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])}
                              className="px-2 py-1 rounded bg-surface border border-border text-xs cursor-pointer"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="paid">Pagado</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                            No hay pedidos aún
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "customers" && (
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Teléfono</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Pedidos</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Registro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {customers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-sm font-mono">{customer.id.slice(0, 12)}...</td>
                          <td className="px-4 py-3 text-sm">{customer.name}</td>
                          <td className="px-4 py-3 text-sm text-text-muted">{customer.email}</td>
                          <td className="px-4 py-3 text-sm text-text-muted">{customer.phone}</td>
                          <td className="px-4 py-3 text-sm">{customer.orders.length}</td>
                          <td className="px-4 py-3 text-sm text-text-muted">
                            {new Date(customer.createdAt).toLocaleDateString("es-PE")}
                          </td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                            No hay clientes aún
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      className="p-6 rounded-2xl bg-surface border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={`mb-3 ${color}`}>{icon}</div>
      <p className="text-sm text-text-muted mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    paid: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const labels = {
    pending: "Pendiente",
    paid: "Pagado",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  return (
    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
