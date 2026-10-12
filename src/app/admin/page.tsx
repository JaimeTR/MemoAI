"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Users, DollarSign, Clock, ArrowLeft, RefreshCw, Settings, Save, Tag, Plus, Trash2, MapPin, Box, Pencil, X, Upload } from "lucide-react";
import type { Order, Customer, ShopSettings, Coupon, Product } from "@/lib/db";

type Tab = "dashboard" | "products" | "orders" | "customers" | "coupons" | "settings";

const EMPTY_PRODUCT_FORM = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  salePrice: 0,
  originalPrice: 0,
  images: [] as string[],
  stock: "" as number | "",
  active: true,
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: "", type: "percent" as "percent" | "fixed", value: 10 });
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [settings, setSettings] = useState<ShopSettings>({
    whatsappNumber: "",
    yapeNumber: "",
    plinNumber: "",
    yapeName: "",
    paymentLink: "",
    paymentLinkEnabled: false,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      fetchData();
      fetchSettings();
    } else {
      setLoginError(res.status === 503 ? "Falta configurar ADMIN_PASSWORD en el servidor." : "Contraseña incorrecta.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, customersRes, couponsRes, productsRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/customers"),
        fetch("/api/coupons"),
        fetch("/api/products"),
      ]);
      const ordersData = await ordersRes.json();
      const customersData = await customersRes.json();
      const couponsData = await couponsRes.json();
      const productsData = await productsRes.json();
      setOrders(ordersData.orders || []);
      setCustomers(customersData.customers || []);
      setCoupons(couponsData.coupons || []);
      setProducts(productsData.products || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      slug: p.slug,
      tagline: p.tagline || "",
      description: p.description || "",
      salePrice: p.salePrice,
      originalPrice: p.originalPrice || 0,
      images: p.images,
      stock: p.stock ?? "",
      active: p.active,
    });
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setProductForm(EMPTY_PRODUCT_FORM);
  };

  const uploadProductImage = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/products/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setProductForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setUploadingImage(false);
  };

  const removeProductImage = (url: string) => {
    setProductForm((prev) => ({ ...prev, images: prev.images.filter((i) => i !== url) }));
  };

  const saveProduct = async () => {
    if (!productForm.name.trim() || !productForm.salePrice) return;
    setSavingProduct(true);
    try {
      const payload = {
        name: productForm.name,
        slug: productForm.slug || undefined,
        tagline: productForm.tagline || undefined,
        description: productForm.description || undefined,
        salePrice: Number(productForm.salePrice),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        images: productForm.images,
        stock: productForm.stock === "" ? null : Number(productForm.stock),
        active: productForm.active,
      };

      if (editingProductId) {
        await fetch(`/api/products/${editingProductId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      cancelEditProduct();
      fetchData();
    } catch (error) {
      console.error("Error saving product:", error);
    }
    setSavingProduct(false);
  };

  const toggleProductActive = async (p: Product) => {
    try {
      await fetch(`/api/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      fetchData();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const addCoupon = async () => {
    if (!newCoupon.code.trim()) return;
    setSavingCoupon(true);
    try {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      setNewCoupon({ code: "", type: "percent", value: 10 });
      fetchData();
    } catch (error) {
      console.error("Error creating coupon:", error);
    }
    setSavingCoupon(false);
  };

  const toggleCoupon = async (code: string, active: boolean) => {
    try {
      await fetch(`/api/coupons/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      fetchData();
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  const deleteCoupon = async (code: string) => {
    try {
      await fetch(`/api/coupons/${code}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data.settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
    setSavingSettings(false);
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
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) return;
        setAuthenticated(true);
        fetchData();
        fetchSettings();
      })
      .catch(() => {});
  }, []);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md p-8 rounded-2xl glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-center">
            <span className="text-accent">MEMOAI</span> Admin
          </h1>
          <p className="text-text-muted text-center mb-8">Ingresa la contraseña de administrador</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 rounded-xl bg-surface-light/60 border border-border text-foreground placeholder-text-muted/50 focus:outline-none focus:border-accent/50"
              required
            />
            {loginError && <p role="alert" className="text-sm text-red-600">{loginError}</p>}
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
    activeProducts: products.filter((p) => p.active).length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Volver al sitio</span>
            </Link>
            <div className="w-px h-6 bg-border" />
            <h1 className="text-xl font-bold">
              <span className="text-accent">MEMOAI</span> Admin
            </h1>
          </div>
          <button
            onClick={fetchData}
            className="p-2 rounded-lg hover:bg-surface-light/60 transition-colors cursor-pointer"
            title="Actualizar"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          {(["dashboard", "products", "orders", "customers", "coupons", "settings"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                tab === t ? "bg-accent text-white" : "bg-surface text-text-muted hover:text-foreground"
              }`}
            >
              {t === "dashboard"
                ? "Dashboard"
                : t === "products"
                  ? "Productos"
                  : t === "orders"
                    ? "Pedidos"
                    : t === "customers"
                      ? "Clientes"
                      : t === "coupons"
                        ? "Cupones"
                        : "Pagos"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                <StatCard
                  icon={<Box className="w-6 h-6" />}
                  label="Productos Activos"
                  value={stats.activeProducts}
                  color="text-pink-400"
                />
              </div>
            )}

            {tab === "products" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-surface border border-border">
                  <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                    <Box className="w-5 h-5 text-accent-light" />
                    {editingProductId ? "Editar producto" : "Crear producto"}
                  </h3>
                  <p className="text-sm text-text-muted mb-6">
                    Los productos activos aparecen en la tienda en <span className="font-mono">/producto/&lt;slug&gt;</span>.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Nombre</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Nombre del producto"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Slug (URL)</label>
                      <input
                        type="text"
                        value={productForm.slug}
                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                        placeholder="se-genera-del-nombre"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Tagline</label>
                    <input
                      type="text"
                      value={productForm.tagline}
                      onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                      placeholder="Frase corta debajo del nombre"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Descripción</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Descripción del producto"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Precio de venta (S/)</label>
                      <input
                        type="number"
                        min={0}
                        value={productForm.salePrice}
                        onChange={(e) => setProductForm({ ...productForm, salePrice: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Precio original (S/)</label>
                      <input
                        type="number"
                        min={0}
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Stock (vacío = ilimitado)</label>
                      <input
                        type="number"
                        min={0}
                        value={productForm.stock}
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value === "" ? "" : Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-medium text-text-muted mb-1.5 block">Imágenes</label>
                    <div className="flex flex-wrap gap-3 mb-2">
                      {productForm.images.map((url) => (
                        <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => removeProductImage(url)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                      <label className="w-16 h-16 rounded-lg border border-dashed border-border flex items-center justify-center cursor-pointer hover:border-accent/50 transition-colors">
                        {uploadingImage ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-text-muted" />
                        ) : (
                          <Upload className="w-4 h-4 text-text-muted" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && uploadProductImage(e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 mb-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.active}
                      onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                      className="accent-accent"
                    />
                    <span className="text-xs text-text-muted">Activo (visible en la tienda)</span>
                  </label>

                  <div className="flex gap-3">
                    <button
                      onClick={saveProduct}
                      disabled={savingProduct || !productForm.name.trim() || !productForm.salePrice}
                      className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      {savingProduct ? "Guardando..." : editingProductId ? "Guardar cambios" : "Crear producto"}
                    </button>
                    {editingProductId && (
                      <button
                        onClick={cancelEditProduct}
                        className="px-5 py-2.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 font-medium cursor-pointer transition-colors"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-surface">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Producto</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Precio</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-surface-light/60 border border-border overflow-hidden shrink-0 flex items-center justify-center">
                                {p.images[0] ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Box className="w-4 h-4 text-text-muted" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{p.name}</p>
                                <p className="text-[11px] text-text-muted font-mono truncate">/{p.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{p.currency} {p.salePrice}</td>
                          <td className="px-4 py-3 text-sm text-text-muted">{p.stock ?? "Ilimitado"}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleProductActive(p)}
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                                p.active
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : "bg-foreground/5 text-text-muted border-border"
                              }`}
                            >
                              {p.active ? "Activo" : "Inactivo"}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => startEditProduct(p)}
                                className="p-1.5 rounded-lg hover:bg-accent/10 text-text-muted hover:text-accent cursor-pointer transition-colors"
                                title="Editar"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 cursor-pointer transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                            No hay productos creados aún
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Dirección</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Pago</th>
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
                          <td className="px-4 py-3 text-sm text-text-muted max-w-[220px]">
                            <div className="flex items-start gap-1.5">
                              {order.address ? (
                                <span className="truncate" title={`${order.address}, ${order.city}${order.province ? " - " + order.province : ""} - ${order.department}`}>
                                  {order.address}, {order.city}
                                </span>
                              ) : (
                                <span
                                  className="truncate"
                                  title={`Recojo en agencia Shalom: ${order.city}${order.province ? " - " + order.province : ""} - ${order.department}${order.dni ? " — DNI: " + order.dni : ""}`}
                                >
                                  Agencia Shalom: {order.city}{order.dni ? ` (DNI ${order.dni})` : ""}
                                </span>
                              )}
                              {order.mapsLink && (
                                <a
                                  href={order.mapsLink}
                                  target="_blank"
                                  title="Ver ubicación exacta en Google Maps"
                                  className="text-accent hover:text-accent-light shrink-0"
                                >
                                  <MapPin className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-text-muted">
                            <span className="capitalize">{order.paymentProvider}</span>
                            {order.paymentProofUrl && (
                              <a
                                href={order.paymentProofUrl}
                                target="_blank"
                                className="block text-[11px] text-accent-light hover:underline"
                              >
                                Ver comprobante
                              </a>
                            )}
                          </td>
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
                          <td colSpan={8} className="px-4 py-8 text-center text-text-muted">
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

            {tab === "coupons" && (
              <div className="max-w-2xl space-y-6">
                <div className="p-6 rounded-2xl bg-surface border border-border">
                  <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-accent-light" />
                    Crear cupón
                  </h3>
                  <p className="text-sm text-text-muted mb-6">
                    Los clientes podrán usar el código en el checkout, encima del 60% ya aplicado.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      placeholder="CÓDIGO"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm uppercase"
                    />
                    <select
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as "percent" | "fixed" })}
                      className="px-3 py-2.5 rounded-xl bg-surface-light/60 border border-border text-sm cursor-pointer"
                    >
                      <option value="percent">% Porcentaje</option>
                      <option value="fixed">S/ Monto fijo</option>
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                      className="w-24 px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                    />
                    <button
                      onClick={addCoupon}
                      disabled={savingCoupon || !newCoupon.code.trim()}
                      className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-light text-white font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      Crear
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-surface">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Código</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Descuento</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Estado</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {coupons.map((c) => (
                        <tr key={c.code} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-sm font-mono font-semibold">{c.code}</td>
                          <td className="px-4 py-3 text-sm">{c.type === "percent" ? `${c.value}%` : `S/ ${c.value}`}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleCoupon(c.code, !c.active)}
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                                c.active
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : "bg-foreground/5 text-text-muted border-border"
                              }`}
                            >
                              {c.active ? "Activo" : "Inactivo"}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteCoupon(c.code)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 cursor-pointer transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {coupons.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                            No hay cupones creados aún
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "settings" && (
              <div className="max-w-2xl">
                <div className="p-6 rounded-2xl bg-surface border border-border">
                  <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-accent-light" />
                    Configuración de pagos
                  </h3>
                  <p className="text-sm text-text-muted mb-6">
                    Configura tus números para recibir pagos por Yape, Plin y WhatsApp. Los clientes verán estos datos en el checkout.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Número de WhatsApp (con código de país)</label>
                      <input
                        type="text"
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        placeholder="+51 999 999 999"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Nombre del titular (se muestra en Yape y Plin)</label>
                      <input
                        type="text"
                        value={settings.yapeName}
                        onChange={(e) => setSettings({ ...settings, yapeName: e.target.value })}
                        placeholder="MemoAI Peru"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Número de Yape</label>
                      <input
                        type="text"
                        value={settings.yapeNumber}
                        onChange={(e) => setSettings({ ...settings, yapeNumber: e.target.value })}
                        placeholder="999 999 999"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Número de Plin</label>
                      <input
                        type="text"
                        value={settings.plinNumber}
                        onChange={(e) => setSettings({ ...settings, plinNumber: e.target.value })}
                        placeholder="999 999 999"
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-text-muted mb-1.5 block">Link de pago con tarjeta (Culqi / Mercado Pago / Izipay)</label>
                      <input
                        type="url"
                        value={settings.paymentLink}
                        onChange={(e) => setSettings({ ...settings, paymentLink: e.target.value })}
                        placeholder="https://pay.culqi.com/..."
                        className="w-full px-4 py-2.5 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 text-sm"
                      />
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.paymentLinkEnabled}
                          onChange={(e) => setSettings({ ...settings, paymentLinkEnabled: e.target.checked })}
                          className="accent-accent"
                        />
                        <span className="text-xs text-text-muted">Mostrar opción de pago con tarjeta en el checkout</span>
                      </label>
                    </div>

                    <button
                      onClick={saveSettings}
                      disabled={savingSettings}
                      className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        settingsSaved ? "bg-emerald-500 text-white" : "bg-accent hover:bg-accent-light text-white"
                      }`}
                    >
                      {settingsSaved ? (
                        <>✓ Configuración guardada</>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {savingSettings ? "Guardando..." : "Guardar configuración"}
                        </>
                      )}
                    </button>
                  </div>
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

