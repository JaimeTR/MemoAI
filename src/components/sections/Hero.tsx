"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Play, Mic, Brain, FileText, FolderOpen, Timer, ShoppingCart, Truck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FloatingProduct } from "@/components/product/FloatingProduct";
import { PRODUCT } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const heroBenefits = [
  { icon: FileText, text: "Nunca pierdas información" },
  { icon: Brain, text: "No tomes apuntes manualmente" },
  { icon: Mic, text: "Resúmenes automáticos con IA" },
  { icon: FolderOpen, text: "Recuerda todos los acuerdos" },
  { icon: Timer, text: "Ahorra horas cada semana" },
  { icon: Check, text: "Todo en un solo lugar" },
];

const swapWords1 = ["transcribe", "resume", "organiza"];
const swapWords2 = ["reuniones", "clases", "entrevistas"];

// ── Swapping text with vertical slide ──
function SwapText({ words, className }: { words: string[]; className?: string }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), 2500);
    return () => clearInterval(t);
  }, [words.length]);

  return (
    <motion.span
      className={`relative inline-flex overflow-hidden ${className || ""}`}
      style={{ height: "1.1em", verticalAlign: "text-bottom" }}
      animate={{ width: "auto" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={words[idx]}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -25, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="whitespace-nowrap leading-none"
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

interface HeroProps {
  onBuyClick: () => void;
  onVideoClick: () => void;
}

export function Hero({ onBuyClick, onVideoClick }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(titleRef.current, { y: 60, opacity: 0, duration: 1, delay: 0.3 })
        .from(subtitleRef.current, { y: 40, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(ctaRef.current, { y: 30, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(priceRef.current, { y: 30, opacity: 0, scale: 0.9, duration: 0.6 }, "-=0.3");

      if (benefitsRef.current) {
        const cards = Array.from(benefitsRef.current.children) as HTMLElement[];
        const md = window.innerWidth >= 768;
        if (md) {
          // Desktop: 6 cards in circle around product
          const positions = [
            { left: "12%", top: "48%" },
            { left: "26%", top: "12%" },
            { left: "74%", top: "12%" },
            { left: "88%", top: "48%" },
            { left: "74%", top: "84%" },
            { left: "26%", top: "84%" },
          ];
          cards.forEach((card, i) => {
            if (positions[i]) {
              card.style.position = "absolute";
              card.style.left = positions[i].left;
              card.style.top = positions[i].top;
              card.style.transform = "translate(-50%, -50%)";
              card.style.width = "230px";
              card.style.zIndex = "20";
            }
          });
        } else {
          // Mobile: only 2 cards below the product
          cards.forEach((card, i) => {
            if (i < 2) {
              card.style.position = "absolute";
              card.style.left = i === 0 ? "8%" : "auto";
              card.style.right = i === 0 ? "auto" : "8%";
              card.style.top = "78%";
              card.style.transform = "translateY(-50%)";
              card.style.width = "42%";
              card.style.maxWidth = "170px";
              card.style.zIndex = "20";
              card.style.display = "flex";
            } else {
              card.style.display = "none";
            }
          });
        }

        tl.fromTo(cards, { opacity: 0, y: 60, scale: 0.7 }, {
          opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6,
        }, "-=0.4");
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-12 md:pt-20 pb-6 md:pb-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">

        {/* ── MEMOAI name ── */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-4xl md:text-5xl font-bold tracking-tight inline-flex items-center" style={{ fontFamily: '"Braze", sans-serif' }}>
            <span className="text-foreground">MEMO</span>
            <span className="gradient-text relative">
              AI
              <Sparkles className="absolute -top-2 -right-5 w-4 h-4 text-accent-light" />
            </span>
          </span>
        </motion.div>

        {/* ── H1 Title ── */}
        <h1
          ref={titleRef}
          className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold tracking-tight mb-5 text-center max-w-4xl mx-auto leading-tight"
          style={{ fontFamily: '"Braze", sans-serif' }}
        >
          Deja de tomar apuntes y <span className="gradient-text">concéntrate en lo que realmente importa</span>
        </h1>

        {/* ── Subtitle with swapping words ── */}
        <p
          ref={subtitleRef}
          className="hidden md:block text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 max-w-3xl mx-auto mb-4 text-center leading-relaxed px-2"
        >
          <span className="hidden md:inline">
            La grabadora inteligente con IA que{" "}
            <SwapText words={swapWords1} className="text-accent-light font-semibold" />
            {" "}automáticamente tus{" "}
            <SwapText words={swapWords2} className="text-accent-light font-semibold" />.
          </span>
        </p>

        {/* ── ENVÍO GRATIS ── */}
        <div className="flex justify-center mb-6">
          <Badge variant="success">
            <Truck className="w-3.5 h-3.5" />
            {PRODUCT.shipping}
          </Badge>
        </div>

        {/* ── PRODUCT + BENEFITS ── */}
        <div className="relative flex justify-center mb-0" style={{ minHeight: "310px" }}>
          <div className="relative z-10">
            <FloatingProduct />
          </div>
          <div ref={benefitsRef} className="absolute inset-0 pointer-events-none z-20">
            {heroBenefits.map((item, i) => {
              const Icon = item.icon;
              return (
              <div
                key={i}
                className="rounded-lg md:rounded-2xl p-1 md:p-3 backdrop-blur-2xl shadow-lg md:shadow-xl flex items-center gap-1 md:gap-3"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="w-6 h-6 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Icon className="w-3 h-3 md:w-5 md:h-5 text-emerald-400" />
                </div>
                <span className="text-[9px] md:text-sm font-medium text-foreground/80 md:text-foreground/90 leading-tight">{item.text}</span>
              </div>
              );
            })}
          </div>
        </div>

        {/* ── CTA Buttons ── */}
        <div ref={ctaRef} className="flex flex-col items-center justify-center gap-1.5 md:gap-3 mb-0 md:mb-2">
          {/* Mobile: price with old price crossed + 60% OFF tag */}
          <div className="flex md:hidden items-center justify-center gap-2 flex-wrap">
            <span className="text-sm text-text-muted line-through">{PRODUCT.currency} {PRODUCT.originalPrice}</span>
            <span className="text-xl font-bold">{PRODUCT.currency} {PRODUCT.salePrice}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent text-white">60% OFF</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
            <Button size="md" onClick={onBuyClick} className="text-sm md:text-base">
              <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
              COMPRAR AHORA
            </Button>
            <Button variant="secondary" size="md" onClick={onVideoClick} className="text-sm md:text-base">
              <Play className="w-3.5 h-3.5 md:w-4 md:h-4" />
              VER PRODUCTO
            </Button>
          </div>
        </div>

        {/* ── Price + Oferta ── */}
        <div ref={priceRef} className="hidden md:flex flex-col items-center gap-2">
          <div className="flex items-baseline gap-3">
            <span className="text-text-muted line-through text-lg">
              {PRODUCT.currency} {PRODUCT.originalPrice}
            </span>
            <span className="text-4xl md:text-5xl font-bold text-foreground">
              {PRODUCT.currency} {PRODUCT.salePrice}
            </span>
          </div>
          <Badge variant="accent">
            Oferta por tiempo limitado — 60% OFF
          </Badge>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-text-muted" />
      </motion.div>
    </section>
  );
}
