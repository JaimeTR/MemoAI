"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Lock, Smartphone, MessageCircle, CreditCard, Copy, Check, ShoppingBag, ShoppingCart, Truck, Tag, Minus, Plus, XCircle, MapPin, ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { WipeButtonContent } from "@/components/ui/WipeButtonContent";
import { AddressMapPicker } from "@/components/checkout/AddressMapPicker";
import { PRODUCT, LIMA_DISTRICTS, PERU_DEPARTMENTS, PERU_UBIGEO, SHALOM_AGENCIAS, DELIVERY_ZONES } from "@/lib/constants";
import type { ShopSettings, Coupon } from "@/lib/db";
import { cn } from "@/lib/utils";

export interface CheckoutProduct {
  id?: string;
  name: string;
  salePrice: number;
  originalPrice: number;
  currency: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: CheckoutProduct;
}

// OSM address data accents Spanish place names inconsistently (e.g. "Rimac" vs "Rímac") — strip diacritics before comparing.
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .split("")
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code < 0x0300 || code > 0x036f;
    })
    .join("")
    .toLowerCase();

type Step = "summary" | "info" | "payment" | "success";
type DeliveryZoneId = "nacional" | "lima_fast";

const STEP_LABELS = ["Resumen", "Envío", "Pago"];

export function CheckoutModal({ isOpen, onClose, product = PRODUCT }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("summary");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dni: "",
    district: "",
    province: "",
    department: "",
    agency: "",
  });
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZoneId>("nacional");
  const [method, setMethod] = useState<"yape" | "plin" | "whatsapp" | "link">("yape");
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [copied, setCopied] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [showCouponField, setShowCouponField] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [proofStatus, setProofStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [proofError, setProofError] = useState("");

  const subtotal = product.originalPrice * quantity;
  const productDiscount = (product.originalPrice - product.salePrice) * quantity;
  const preCouponTotal = product.salePrice * quantity;
  const selectedZone = DELIVERY_ZONES.find((z) => z.id === deliveryZone)!;
  const total = Math.max(0, preCouponTotal - couponDiscount) + selectedZone.shippingCost;
  const availableAgencies =
    formData.department && formData.province ? SHALOM_AGENCIAS[formData.department]?.[formData.province] ?? [] : [];
  // Disambiguate agencies that share the same zona/district name within a province (two Shalom branches, same district)
  // so the Select gets unique labels (no React key collisions) and matching back is unambiguous.
  const agencyOptions = availableAgencies.map((a, i) => {
    const dupIndex = availableAgencies.slice(0, i + 1).filter((x) => x.zona === a.zona).length;
    const isDuplicate = availableAgencies.filter((x) => x.zona === a.zona).length > 1;
    return { ...a, label: isDuplicate ? `${a.zona} (${dupIndex})` : a.zona };
  });
  const selectedAgency = agencyOptions.find((a) => a.label === formData.agency);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCheckingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, amount: preCouponTotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discount);
      } else {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponError(data.error || "Cupón inválido");
      }
    } catch {
      setCouponError("No se pudo validar el cupón");
    }
    setCheckingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponInput("");
    setCouponError("");
    setShowCouponField(false);
  };

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => {});
  }, []);

  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen);
    if (!isOpen) {
      setStep("summary");
      setCopied(false);
      setQuantity(1);
      setDeliveryZone("nacional");
      setIsAnimating(false);
      setAddressCoords(null);
      setProofStatus("idle");
      setProofError("");
      removeCoupon();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === "address") setAddressCoords(null);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const copyNumber = (num: string) => {
    navigator.clipboard?.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cityLabel = deliveryZone === "lima_fast" ? formData.district : formData.agency || formData.province;
  const departmentLabel = deliveryZone === "lima_fast" ? "Lima" : formData.department;
  const provinceLabel = deliveryZone === "lima_fast" ? "Lima" : formData.province;
  const mapsLink = addressCoords ? `https://www.google.com/maps?q=${addressCoords.lat},${addressCoords.lng}` : null;

  const buildWhatsAppLink = (order: string) => {
    const num = settings?.whatsappNumber.replace(/\D/g, "") || "51975646074";
    const locationLine =
      deliveryZone === "lima_fast"
        ? `📍 Dirección: ${formData.address}, ${cityLabel} - ${departmentLabel}\n` +
          (mapsLink ? `📌 Ubicación exacta: ${mapsLink}\n` : "")
        : selectedAgency
          ? `📍 Recojo en agencia Shalom "${selectedAgency.zona}": ${selectedAgency.direccion}\n` +
            `🕐 Horario: ${selectedAgency.horario}\n` +
            `🪪 DNI: ${formData.dni}\n`
          : `📍 Recojo en agencia Shalom más cercana a: ${provinceLabel} - ${departmentLabel} (sin agencia registrada aún, coordinamos)\n` +
            `🪪 DNI: ${formData.dni}\n`;
    const msg = encodeURIComponent(
      `¡Hola! Quiero confirmar mi pedido de MEMOAI.\n\n` +
        `🛒 Pedido: ${order}\n` +
        `👤 Nombre: ${formData.name}\n` +
        `📱 Número: ${formData.phone}\n` +
        locationLine +
        `📦 Cantidad: ${quantity}\n` +
        `💰 Método: ${method === "yape" ? "Yape" : method === "plin" ? "Plin" : "Tarjeta"}\n` +
        `💵 Total: S/ ${total}`
    );
    return `https://wa.me/${num}?text=${msg}`;
  };

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      if (step === "summary") {
        setStep("info");
        return;
      }
      if (step === "info") {
        setStep("payment");
        return;
      }
      handleSubmit();
    }, 600);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          address: deliveryZone === "lima_fast" ? formData.address : selectedAgency?.direccion || "",
          dni: formData.dni || undefined,
          mapsLink,
          city: cityLabel,
          province: provinceLabel,
          department: departmentLabel,
          paymentProvider: method,
          quantity,
          deliveryZone,
          productId: product.id,
          couponCode: appliedCoupon?.code,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.order) {
        alert(data.error || "Error al procesar el pedido. Intenta de nuevo.");
        return;
      }
      setOrderId(data.order.id);

      if (method === "whatsapp") {
        window.open(buildWhatsAppLink(data.order.id), "_blank");
      }
      if (method === "link" && settings?.paymentLink) {
        window.open(settings.paymentLink, "_blank");
      }
      setStep("success");
    } catch {
      alert("Error al procesar el pedido. Intenta de nuevo.");
    }
  };

  const uploadProof = async (file: File, currentOrderId: string) => {
    setProofStatus("uploading");
    setProofError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`/api/orders/${currentOrderId}/proof`, { method: "POST", body });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setProofStatus("error");
        setProofError(data.error || "No se pudo subir el comprobante");
        return;
      }
      setProofStatus("done");
    } catch {
      setProofStatus("error");
      setProofError("No se pudo subir el comprobante");
    }
  };

  const inputClass =
    "w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-surface-light/60 border border-border text-foreground placeholder-text-muted/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm";

  const stepIndex = step === "summary" ? 0 : step === "info" ? 1 : 2;

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col items-center gap-6">
            {/* Step indicator — lives outside the modal card */}
            {step !== "success" && (
              <motion.div
                className="flex items-center gap-3 px-5 py-3 rounded-2xl glass shadow-xl shrink-0"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {STEP_LABELS.map((label, i) => {
                  const state = i < stepIndex ? "done" : i === stepIndex ? "current" : "upcoming";
                  return (
                    <div key={label} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                            state === "done"
                              ? "bg-emerald-500 text-white"
                              : state === "current"
                                ? "bg-accent text-white shadow-[0_0_16px_rgba(99,102,241,0.4)]"
                                : "bg-foreground/10 text-text-muted"
                          }`}
                        >
                          {state === "done" ? <Check className="w-3.5 h-3.5" /> : i + 1}
                        </div>
                        <span className={`text-xs font-medium whitespace-nowrap hidden sm:inline ${state === "upcoming" ? "text-text-muted" : "text-foreground"}`}>
                          {label}
                        </span>
                      </div>
                      {i < STEP_LABELS.length - 1 && (
                        <div className="w-6 sm:w-10 h-0.5 mx-2 bg-border rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-emerald-500 transition-all duration-500 ${i < stepIndex ? "w-full" : "w-0"}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}

            <motion.div
              className="relative w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-border shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors z-10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="p-5 md:p-8">
                {step === "success" ? (
                  <motion.div className="text-center py-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                      <ShieldCheck className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">¡Pedido registrado!</h3>
                    <p className="text-sm text-text-muted mb-2">
                      Tu pedido <span className="text-foreground font-mono">{orderId}</span>
                    </p>
                    {method === "yape" || method === "plin" || method === "whatsapp" ? (
                      <div className="text-sm text-text-muted mb-6">
                        <p className="mb-3">
                          {method === "whatsapp"
                            ? "Revisa tu WhatsApp: te enviamos los detalles para cerrar tu compra. También puedes adjuntar tu comprobante aquí:"
                            : "Comparte tu comprobante de pago para confirmar tu pedido:"}
                        </p>
                        <div className="flex flex-col items-center gap-2.5">
                          {settings && (
                            <a
                              href={buildWhatsAppLink(orderId)}
                              target="_blank"
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Enviar captura por WhatsApp
                            </a>
                          )}

                          <span className="text-[11px] text-text-muted/60">— o —</span>

                          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:border-accent/40 text-foreground font-medium text-sm cursor-pointer transition-colors">
                            <Upload className="w-4 h-4" />
                            {proofStatus === "uploading" ? "Subiendo..." : proofStatus === "done" ? "Comprobante subido" : "Subir captura del pago"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={proofStatus === "uploading"}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && orderId) uploadProof(file, orderId);
                              }}
                            />
                          </label>
                          {proofStatus === "done" && (
                            <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Comprobante recibido, gracias
                            </p>
                          )}
                          {proofStatus === "error" && (
                            <p className="text-[11px] text-red-500">{proofError}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-text-muted mb-6">
                        Completa el pago en la ventana que se abrió. Tu pedido se confirmará automáticamente.
                      </p>
                    )}
                    <div className="flex gap-3 justify-center">
                      <Button onClick={() => (window.location.href = `/gracias?order=${orderId}`)}>Ver confirmación</Button>
                      <Button variant="secondary" onClick={onClose}>Cerrar</Button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h3 className="font-heading text-xl md:text-2xl font-bold mb-1">Checkout</h3>
                      <p className="text-xs md:text-sm text-text-muted">
                        {step === "summary"
                          ? "Revisa tu pedido y elige tu zona de envío"
                          : step === "info"
                            ? "Completa tus datos para enviar tu MemoAI"
                            : "Elige cómo quieres pagar — es seguro y rápido"}
                      </p>
                    </div>

                    {step === "summary" && (
                      <>
                      <div className="rounded-2xl bg-surface-light/60 border border-border mb-5 overflow-hidden">
                        <div className="flex items-center gap-3 p-4 pb-3">
                          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                            <ShoppingBag className="w-4 h-4 text-accent" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{product.name}</p>
                            <p className="text-[11px] text-text-muted">{product.currency} {product.salePrice} c/u</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                              className="w-7 h-7 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center cursor-pointer transition-colors"
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity((q) => Math.min(5, q + 1))}
                              className="w-7 h-7 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center cursor-pointer transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Delivery method */}
                        <div className="px-4 pb-3 space-y-2">
                          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Método de envío</p>
                          {DELIVERY_ZONES.map((zone) => (
                            <label
                              key={zone.id}
                              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                deliveryZone === zone.id ? "border-accent/50 bg-accent/5" : "border-border hover:border-white/20"
                              }`}
                            >
                              <input
                                type="radio"
                                name="deliveryZone"
                                checked={deliveryZone === zone.id}
                                onChange={() => setDeliveryZone(zone.id)}
                                className="accent-accent"
                              />
                              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-accent" />
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-sm">{zone.name}</span>
                                <p className="text-[11px] text-text-muted">{zone.days} — {zone.description}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                {zone.fast && (
                                  <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-accent text-white">
                                    Fast Delivery
                                  </span>
                                )}
                                <span className={`text-xs font-semibold ${zone.shippingCost === 0 ? "text-emerald-500" : "text-foreground"}`}>
                                  {zone.shippingCost === 0 ? "GRATIS" : `${product.currency} ${zone.shippingCost}`}
                                </span>
                              </div>
                            </label>
                          ))}
                        </div>

                        {/* Coupon */}
                        <div className="px-4 pb-3">
                          {appliedCoupon ? (
                            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                <Tag className="w-3.5 h-3.5" />
                                Cupón {appliedCoupon.code} aplicado
                              </span>
                              <button type="button" onClick={removeCoupon} className="text-text-muted hover:text-foreground cursor-pointer">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : showCouponField ? (
                            <div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  autoFocus
                                  value={couponInput}
                                  onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                                  placeholder="Código de descuento"
                                  className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border text-sm placeholder-text-muted/60 focus:outline-none focus:border-accent/50 uppercase"
                                />
                                <button
                                  type="button"
                                  onClick={applyCoupon}
                                  disabled={checkingCoupon || !couponInput.trim()}
                                  className="px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-sm font-medium cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {checkingCoupon ? "..." : "Aplicar"}
                                </button>
                              </div>
                              {couponError && <p className="text-[11px] text-red-500 mt-1.5">{couponError}</p>}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowCouponField(true)}
                              className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-accent cursor-pointer transition-colors"
                            >
                              <Tag className="w-3.5 h-3.5" />
                              ¿Tienes un código de descuento?
                            </button>
                          )}
                        </div>

                        <div className="px-4 pb-4 space-y-1.5">
                          <div className="flex items-center justify-between text-xs md:text-sm text-text-muted">
                            <span>Subtotal {quantity > 1 && `(x${quantity})`}</span>
                            <span>{product.currency} {subtotal}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs md:text-sm text-emerald-500">
                            <span className="flex items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5" />
                              Descuento
                            </span>
                            <span>-{product.currency} {productDiscount}</span>
                          </div>
                          {couponDiscount > 0 && (
                            <div className="flex items-center justify-between text-xs md:text-sm text-emerald-500">
                              <span className="flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5" />
                                Cupón
                              </span>
                              <span>-{product.currency} {couponDiscount}</span>
                            </div>
                          )}
                          <div className={`flex items-center justify-between text-xs md:text-sm ${selectedZone.shippingCost === 0 ? "text-emerald-500" : "text-text-muted"}`}>
                            <span className="flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5" />
                              Envío ({selectedZone.name})
                            </span>
                            <span>{selectedZone.shippingCost === 0 ? "GRATIS" : `${product.currency} ${selectedZone.shippingCost}`}</span>
                          </div>

                          <div className="h-px bg-border my-2" />

                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">Total</span>
                            <span className="text-xl md:text-2xl font-bold gradient-text">
                              {product.currency} {total}
                            </span>
                          </div>
                        </div>
                      </div>

                      {settings && (
                        <a
                          href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("¡Hola! Quiero comprar mi MemoAI y pagar contraentrega. ¿Podemos coordinar?")}`}
                          target="_blank"
                          className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-3 transition-colors"
                        >
                          ¿Deseas pagar contraentrega? <span className="text-accent">Coordinemos</span>
                          <MessageCircle className="w-3.5 h-3.5 text-accent" />
                        </a>
                      )}
                      </>
                    )}

                    <form onSubmit={goNext} className="space-y-3">
                      {step === "info" && (
                        <>
                          <div className="rounded-2xl bg-surface-light/60 border border-border overflow-hidden">
                            <div className="flex items-center gap-3 p-4">
                              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{selectedZone.fullName ?? selectedZone.name}</p>
                                <p className="text-[11px] text-text-muted">{selectedZone.days} — {selectedZone.description}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                {selectedZone.fast && (
                                  <span className="text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-accent text-white">
                                    Fast Delivery
                                  </span>
                                )}
                                <span className={`text-xs font-semibold ${selectedZone.shippingCost === 0 ? "text-emerald-500" : "text-foreground"}`}>
                                  {selectedZone.shippingCost === 0 ? "GRATIS" : `${product.currency} ${selectedZone.shippingCost}`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {deliveryZone === "nacional" && (
                            <input
                              type="text"
                              name="dni"
                              inputMode="numeric"
                              placeholder="DNI (para recojo en agencia)"
                              value={formData.dni}
                              onChange={handleChange}
                              required
                              maxLength={8}
                              pattern="[0-9]{8}"
                              title="8 dígitos"
                              className={inputClass}
                            />
                          )}
                          <input type="text" name="name" placeholder="Nombre completo" value={formData.name} onChange={handleChange} required className={inputClass} />
                          <input type="tel" name="phone" placeholder="Número (para coordinar el envío)" value={formData.phone} onChange={handleChange} required className={inputClass} />

                          {deliveryZone === "lima_fast" ? (
                            <>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="address"
                                  placeholder="Dirección de envío (calle, número, referencia)"
                                  value={formData.address}
                                  onChange={handleChange}
                                  required
                                  className={cn(inputClass, "pr-11 truncate")}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowMapPicker(true)}
                                  title="Elegir en el mapa"
                                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                                    addressCoords ? "bg-emerald-500/15 hover:bg-emerald-500/25" : "bg-accent/10 hover:bg-accent/20"
                                  }`}
                                >
                                  <MapPin className={`w-3.5 h-3.5 ${addressCoords ? "text-emerald-500" : "text-accent"}`} />
                                </button>
                              </div>
                              {addressCoords && (
                                <a
                                  href={mapsLink ?? "#"}
                                  target="_blank"
                                  className="flex items-center gap-1 text-[11px] font-medium text-emerald-500 hover:text-emerald-600 -mt-1.5 transition-colors"
                                >
                                  <Check className="w-3 h-3" />
                                  Ubicación exacta confirmada — ver en Google Maps
                                </a>
                              )}
                              <Select
                                name="district"
                                value={formData.district}
                                onChange={(v) => setFormData((prev) => ({ ...prev, district: v }))}
                                options={LIMA_DISTRICTS}
                                placeholder="Selecciona tu distrito (Lima)"
                                required
                              />
                            </>
                          ) : (
                            <>
                              <p className="text-[11px] text-text-muted flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                Escoge la agencia más cercana para recojo en agencia
                              </p>
                              <Select
                                name="department"
                                value={formData.department}
                                onChange={(v) => setFormData((prev) => ({ ...prev, department: v, province: "", district: "", agency: "" }))}
                                options={PERU_DEPARTMENTS}
                                placeholder="Departamento"
                                required
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Select
                                  name="province"
                                  value={formData.province}
                                  onChange={(v) => setFormData((prev) => ({ ...prev, province: v, district: "", agency: "" }))}
                                  options={formData.department ? Object.keys(PERU_UBIGEO[formData.department]).sort((a, b) => a.localeCompare(b, "es")) : []}
                                  placeholder="Provincia"
                                  required
                                />
                                <Select
                                  name="agency"
                                  value={formData.agency}
                                  onChange={(v) => setFormData((prev) => ({ ...prev, agency: v }))}
                                  options={agencyOptions.map((a) => a.label)}
                                  placeholder={formData.province && availableAgencies.length === 0 ? "Sin agencia aquí" : "Distrito"}
                                  required={availableAgencies.length > 0}
                                />
                              </div>

                              {formData.department && formData.province && (
                                availableAgencies.length > 0 ? (
                                  selectedAgency && (
                                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3 space-y-1">
                                      <p className="text-xs font-semibold text-emerald-600">{selectedAgency.zona}</p>
                                      <p className="text-[11px] text-text-muted">{selectedAgency.direccion}</p>
                                      <p className="text-[11px] text-text-muted">
                                        {selectedAgency.horario}
                                        {selectedAgency.telefono ? ` — ${selectedAgency.telefono}` : ""}
                                      </p>
                                    </div>
                                  )
                                ) : (
                                  <p className="text-[11px] text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                                    No hay agencia Shalom registrada en esta provincia todavía — coordinamos el punto de entrega más cercano por WhatsApp.
                                  </p>
                                )
                              )}
                            </>
                          )}
                        </>
                      )}

                      {step === "payment" && (
                        <div className="space-y-2.5">
                          <div>
                            <input
                              type="email"
                              name="email"
                              placeholder="Email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className={inputClass}
                            />
                            <p className="text-[11px] text-text-muted mt-1.5 px-1">
                              Con este email creamos tu cuenta para que sigas tu pedido y veas tus compras — sin contraseña, te enviamos un link para entrar.
                            </p>
                          </div>

                          {/* Yape */}
                          <div className={`rounded-xl border transition-all ${method === "yape" ? "border-emerald-400/50 bg-emerald-400/5" : "border-border hover:border-white/20"}`}>
                            <label className="flex items-center gap-3 p-3.5 cursor-pointer">
                              <input type="radio" name="method" checked={method === "yape"} onChange={() => setMethod("yape")} className="accent-emerald-400" />
                              <div className="w-9 h-9 rounded-lg bg-[#7B2CBF]/20 flex items-center justify-center shrink-0">
                                <Smartphone className="w-5 h-5 text-[#C77DFF]" />
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-sm">Yape</span>
                                <p className="text-[11px] text-text-muted">Paga a nuestro número desde tu app Yape</p>
                              </div>
                            </label>
                            {method === "yape" && settings && (
                              <div className="px-3.5 pb-3.5 space-y-2.5">
                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-light/60 border border-border">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] text-text-muted uppercase tracking-wide">Yapea a</p>
                                    <p className="text-sm font-semibold truncate">{settings.yapeNumber} — {settings.yapeName}</p>
                                    <button type="button" onClick={() => copyNumber(settings.yapeNumber)} className="flex items-center gap-1 text-xs text-text-muted hover:text-foreground cursor-pointer mt-1">
                                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                      {copied ? "Copiado" : "Copiar"}
                                    </button>
                                  </div>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src="/images/qr-yape.jpeg" alt="Código QR de Yape" className="w-20 h-20 rounded-lg border border-border shrink-0 object-cover" />
                                </div>
                                <p className="text-[11px] text-text-muted leading-relaxed">
                                  Escanea el QR o yapea S/ {total.toFixed(2)} a este número. Al confirmar tu pedido te pedimos tu comprobante.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Plin */}
                          <div className={`rounded-xl border transition-all ${method === "plin" ? "border-emerald-400/50 bg-emerald-400/5" : "border-border hover:border-white/20"}`}>
                            <label className="flex items-center gap-3 p-3.5 cursor-pointer">
                              <input type="radio" name="method" checked={method === "plin"} onChange={() => setMethod("plin")} className="accent-emerald-400" />
                              <div className="w-9 h-9 rounded-lg bg-[#00A6FF]/20 flex items-center justify-center shrink-0">
                                <Smartphone className="w-5 h-5 text-[#66C7FF]" />
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-sm">Plin</span>
                                <p className="text-[11px] text-text-muted">Transfiere al número desde tu app Plin</p>
                              </div>
                            </label>
                            {method === "plin" && settings && (
                              <div className="px-3.5 pb-3.5 space-y-2.5">
                                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-light/60 border border-border">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] text-text-muted uppercase tracking-wide">Transfiere a</p>
                                    <p className="text-sm font-semibold truncate">{settings.plinNumber} — {settings.yapeName}</p>
                                    <button type="button" onClick={() => copyNumber(settings.plinNumber)} className="flex items-center gap-1 text-xs text-text-muted hover:text-foreground cursor-pointer mt-1">
                                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                      {copied ? "Copiado" : "Copiar"}
                                    </button>
                                  </div>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src="/images/qr-plin.jpeg" alt="Código QR de Plin" className="w-20 h-20 rounded-lg border border-border shrink-0 object-cover" />
                                </div>
                                <p className="text-[11px] text-text-muted leading-relaxed">
                                  Escanea el QR o transfiere S/ {total.toFixed(2)} a este número. Al confirmar tu pedido te pedimos tu comprobante.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* WhatsApp */}
                          <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${method === "whatsapp" ? "border-emerald-400/50 bg-emerald-400/5" : "border-border hover:border-white/20"}`}>
                            <input type="radio" name="method" checked={method === "whatsapp"} onChange={() => setMethod("whatsapp")} className="accent-emerald-400" />
                            <div className="w-9 h-9 rounded-lg bg-[#25D366]/20 flex items-center justify-center shrink-0">
                              <MessageCircle className="w-5 h-5 text-[#25D366]" />
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-sm">WhatsApp</span>
                              <p className="text-[11px] text-text-muted">Cerramos tu pedido por chat en minutos</p>
                            </div>
                          </label>

                          {/* Payment link */}
                          {settings?.paymentLinkEnabled && settings.paymentLink && (
                            <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${method === "link" ? "border-accent/50 bg-accent/5" : "border-border hover:border-white/20"}`}>
                              <input type="radio" name="method" checked={method === "link"} onChange={() => setMethod("link")} className="accent-accent" />
                              <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                                <CreditCard className="w-5 h-5 text-accent-light" />
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-sm">Tarjeta (Visa/Mastercard)</span>
                                <p className="text-[11px] text-text-muted">Paga seguro con tu tarjeta</p>
                              </div>
                            </label>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col gap-2 pt-3">
                        <Button type="submit" disabled={isAnimating} className="w-full relative overflow-hidden uppercase">
                          <WipeButtonContent
                            isAnimating={isAnimating}
                            icon={step === "summary" ? <ShoppingCart className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                          >
                            {step === "summary" ? "Continuar" : step === "info" ? "Continuar al pago" : "Confirmar pedido"}
                          </WipeButtonContent>
                        </Button>
                        {step !== "summary" && (
                          <button
                            type="button"
                            onClick={() => setStep(step === "payment" ? "info" : "summary")}
                            className="w-full flex items-center justify-center gap-1 py-1 text-xs font-medium text-text-muted hover:text-foreground cursor-pointer transition-colors"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Atrás
                          </button>
                        )}
                      </div>
                    </form>

                    <p className="text-center text-[11px] md:text-xs text-text-muted/60 mt-3 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" />
                      Tus datos están protegidos — envío a todo el Perú
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    <AddressMapPicker
      isOpen={showMapPicker}
      onClose={() => setShowMapPicker(false)}
      onSelect={(addr, lat, lng, components) => {
        if (deliveryZone === "lima_fast") {
          const matchedDistrict = components.district
            ? LIMA_DISTRICTS.find((d) => normalize(d) === normalize(components.district!))
            : undefined;
          setFormData((prev) => ({ ...prev, address: addr, district: matchedDistrict || prev.district }));
          setAddressCoords({ lat, lng });
          return;
        }

        const matchedDepartment = components.department
          ? PERU_DEPARTMENTS.find((d) => normalize(d) === normalize(components.department!))
          : undefined;

        let matchedProvince: string | undefined;
        let matchedDistrict: string | undefined;
        if (matchedDepartment) {
          const candidates = [components.district, components.city].filter((c): c is string => !!c);
          for (const prov of Object.keys(PERU_UBIGEO[matchedDepartment])) {
            const districts = PERU_UBIGEO[matchedDepartment][prov];
            const found = candidates.map((c) => districts.find((d) => normalize(d) === normalize(c))).find(Boolean);
            if (found) {
              matchedProvince = prov;
              matchedDistrict = found;
              break;
            }
          }
        }

        setFormData((prev) => ({
          ...prev,
          address: addr,
          department: matchedDepartment || prev.department,
          province: matchedProvince || prev.province,
          district: matchedDistrict || prev.district,
        }));
        setAddressCoords({ lat, lng });
      }}
    />
    </>
  );
}
