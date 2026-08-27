"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import type { ShopSettings } from "@/lib/db";

export function WhatsAppButton() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!settings) return null;

  const num = settings.whatsappNumber.replace(/\D/g, "");
  const href = `https://wa.me/${num}?text=${encodeURIComponent("Hola, tengo una consulta sobre MemoAI 🎙️")}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-[80] w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={visible ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0, y: 20 }}
      transition={{ type: "spring", damping: 20, stiffness: 260 }}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
      />
      <MessageCircle className="w-7 h-7 text-white relative z-10" />
    </motion.a>
  );
}
