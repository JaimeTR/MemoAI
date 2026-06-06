"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const navItems = [
  { label: "Problema", scene: 1 },
  { label: "Beneficios", scene: 2 },
  { label: "Funciona", scene: 3 },
  { label: "Usos", scene: 4 },
  { label: "Comprar", scene: 6 },
];

export function Navbar() {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > 300 && currentY > lastScrollY.current) {
        setVisible(true);
      } else if (currentY < 200) {
        setVisible(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollToScene = useCallback((scene: number) => {
    setMobileOpen(false);
    // Find the ImmersiveExperience container
    const container = document.querySelector("[data-scene-container]");
    if (!container) return;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    // Each scene is ~450/6 = 75vh of scroll. Total scroll = 500% of viewport.
    // Scenes: 0-16%, 14-32%, 30-48%, 46-64%, 62-82%, 78-100%
    const sceneStarts = [0, 14, 30, 46, 62, 78, 90];
    const pct = sceneStarts[scene] / 100;
    // Container height is 550vh. The scrollable distance is 550vh = 5.5 * window height
    const vh = window.innerHeight;
    const scrollDistance = 6.0 * vh;
    const targetScroll = containerTop + scrollDistance * pct;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, []);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.nav
            className="fixed top-3 left-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-2xl"
            style={{
              background: "rgba(10, 10, 10, 0.8)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            initial={{ y: -80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <a href="#" className="text-xl font-bold tracking-tight inline-flex items-center" style={{ fontFamily: '"Braze", sans-serif' }} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <span className="text-foreground">MEMO</span>
                <span className="gradient-text relative">
                  AI
                  <Sparkles className="absolute -top-2 -right-4 w-3.5 h-3.5 text-accent-light" />
                </span>
              </a>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-6">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => scrollToScene(item.scene)}
                      className={`text-sm text-text-muted hover:text-foreground transition-colors cursor-pointer ${
                        item.label === "Comprar"
                          ? "px-4 py-2 rounded-full bg-accent hover:bg-accent-light text-white font-medium"
                          : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer md:hidden"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{
              background: "rgba(5, 5, 5, 0.97)",
              backdropFilter: "blur(30px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <a href="#" className="text-2xl font-bold tracking-tight inline-flex items-center mb-2" style={{ fontFamily: '"Braze", sans-serif' }} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); setMobileOpen(false); }}>
              <span className="text-foreground">MEMO</span>
              <span className="gradient-text relative">
                AI
                <Sparkles className="absolute -top-2 -right-5 w-4 h-4 text-accent-light" />
              </span>
            </a>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToScene(item.scene)}
                className={`text-xl font-medium transition-colors cursor-pointer ${
                  item.label === "Comprar"
                    ? "px-8 py-3 rounded-full bg-accent hover:bg-accent-light text-white mt-2"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
