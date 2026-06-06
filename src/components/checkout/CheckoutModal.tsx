"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PRODUCT } from "@/lib/constants";
import type { PaymentProvider, CheckoutFormData } from "@/types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [provider, setProvider] = useState<PaymentProvider>("culqi");
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    department: "",
  });
  const [step, setStep] = useState<"info" | "payment" | "success">("info");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "info") {
      setStep("payment");
    } else {
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: formData.name,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            address: formData.address,
            city: formData.city,
            department: formData.department,
            paymentProvider: provider,
          }),
        });
        setStep("success");
      } catch (error) {
        console.error("Error creating order:", error);
        alert("Error al procesar el pedido. Intenta de nuevo.");
      }
    }
  };

  const inputClass =
    "w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder-text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-border shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors z-10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-5 md:p-8">
              {step === "success" ? (
                <motion.div
                  className="text-center py-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">¡Compra exitosa!</h3>
                  <p className="text-text-muted mb-6">
                    Recibirás un email de confirmación con los detalles de tu pedido.
                  </p>
                  <Button onClick={onClose}>Cerrar</Button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-1">
                      {step === "info" ? "Datos de envío" : "Método de pago"}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {step === "info"
                        ? "Completa tus datos para enviar MemoAI"
                        : "Selecciona tu método de pago preferido"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-border mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-muted">MemoAI — Grabadora Inteligente</span>
                      <span className="text-sm font-mono text-text-muted line-through">
                        {PRODUCT.currency} {PRODUCT.originalPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold gradient-text">
                        {PRODUCT.currency} {PRODUCT.salePrice}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {step === "info" ? (
                      <>
                        <input
                          type="text"
                          name="name"
                          placeholder="Nombre completo"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Teléfono"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                        <input
                          type="text"
                          name="address"
                          placeholder="Dirección de envío"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="city"
                            placeholder="Ciudad"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className={inputClass}
                          />
                          <input
                            type="text"
                            name="department"
                            placeholder="Departamento"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            className={inputClass}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        {(["culqi", "mercadopago", "izipay"] as PaymentProvider[]).map((p) => (
                          <label
                            key={p}
                            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                              provider === p
                                ? "border-accent/50 bg-accent/5"
                                : "border-border hover:border-white/20"
                            }`}
                          >
                            <input
                              type="radio"
                              name="provider"
                              value={p}
                              checked={provider === p}
                              onChange={() => setProvider(p)}
                              className="accent-accent"
                            />
                            <CreditCard className="w-5 h-5 text-text-muted" />
                            <span className="font-medium capitalize">
                              {p === "culqi" ? "Culqi" : p === "mercadopago" ? "Mercado Pago" : "Izipay"}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      {step === "payment" && (
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setStep("info")}
                          className="flex-1"
                        >
                          Atrás
                        </Button>
                      )}
                      <Button type="submit" className="flex-1">
                        <Lock className="w-4 h-4" />
                        {step === "info" ? "Continuar al pago" : "Pagar ahora"}
                      </Button>
                    </div>
                  </form>

                  <p className="text-center text-xs text-text-muted/60 mt-4 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    Pago seguro con encriptación SSL
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
