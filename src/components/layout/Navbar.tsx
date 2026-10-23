"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const navItems = [
  { label: "SOLUCIÓN", id: "beneficios" },
  { label: "FUNCIONA", id: "how-it-works" },
  { label: "USOS", id: "usos" },
  { label: "FAQ", id: "faq" },
];

interface NavbarProps {
  onBuyClick?: () => void;
}

export function Navbar({ onBuyClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollToId = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleBuyClick = useCallback(() => {
    setMobileOpen(false);
    onBuyClick?.();
  }, [onBuyClick]);

  return (
    <>
      <motion.nav
        className="fixed left-0 right-0 z-50"
        initial={false}
        animate={{ top: scrolled ? 12 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background pill — fixed shape/size always, only opacity fades. Never grows to full width, so no "flash" of an expanding bar. */}
        <motion.div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl rounded-2xl pointer-events-none"
          style={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          }}
          initial={false}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Content row — realigns between hero-width (static) and compact pill-width (scrolled) on the same timeline as `top` */}
        <motion.div
          className="relative flex items-center justify-between py-3 mx-auto"
          initial={false}
          animate={{
            maxWidth: scrolled ? 768 : 1152,
            paddingLeft: scrolled ? 24 : 16,
            paddingRight: scrolled ? 24 : 16,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <a href="#" className="inline-flex items-center" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <Logo size="sm" />
          </a>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-text-muted hover:text-foreground transition-colors">
                ← TIENDA
              </Link>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToId(item.id)}
                  className="text-sm text-text-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleBuyClick}
                className="text-sm px-4 py-2 rounded-full bg-accent hover:bg-accent-light text-white font-medium animate-pulse-glow cursor-pointer transition-colors"
              >
                COMPRAR
              </button>
            </div>

            <button
              className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{
              background: "rgba(255, 255, 255, 0.97)",
              backdropFilter: "blur(30px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <a href="#" className="mb-2" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); }}>
                <Logo size="lg" />
              </a>
            <Link href="/" className="text-xl font-medium text-text-muted hover:text-foreground transition-colors">
              ← TIENDA
            </Link>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToId(item.id)}
                className="text-xl font-medium text-text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={handleBuyClick}
              className="px-8 py-3 rounded-full bg-accent hover:bg-accent-light text-white text-xl font-medium mt-2 cursor-pointer transition-colors"
            >
              COMPRAR
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
