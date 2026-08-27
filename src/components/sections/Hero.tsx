"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ChevronDown, Play, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BuyButton } from "@/components/ui/BuyButton";
import { Badge } from "@/components/ui/Badge";
import { FloatingProduct } from "@/components/product/FloatingProduct";
import { Logo } from "@/components/ui/Logo";
import { PRODUCT } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onBuyClick: () => void;
  onVideoClick: () => void;
}

export function Hero({ onBuyClick, onVideoClick }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(titleRef.current, { y: 60, opacity: 0, duration: 1, delay: 0.3 })
        .from(subtitleRef.current, { y: 40, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(ctaRef.current, { y: 30, opacity: 0, scale: 0.95, duration: 0.6 }, "-=0.3")
        .from(productRef.current, { y: 30, opacity: 0, duration: 0.6 }, "-=0.3");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 md:pt-24 pb-8 overflow-hidden"
    >
      {/* Soft light glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_55%)] pointer-events-none" />
      {/* Faint waveform watermark — echoes the recording theme */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 md:h-80 opacity-[0.05] pointer-events-none [mask-image:linear-gradient(to_top,black,transparent)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--accent) 0px, var(--accent) 3px, transparent 3px, transparent 14px)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid md:grid-cols-3 md:gap-10 lg:gap-14 items-center">
          {/* Left column — copy + decision */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            {/* Logo */}
            <motion.div
              className="mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Logo size="lg" />
            </motion.div>

            <h1
              ref={titleRef}
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4 max-w-lg md:max-w-none leading-[1.1]"
            >
              Deja de tomar apuntes,
              <br />
              <span className="gradient-text">concéntrate en lo que realmente importa</span>
            </h1>

            <p
              ref={subtitleRef}
              className="hidden md:block text-base lg:text-lg text-text-muted max-w-none mb-5 leading-relaxed"
            >
              La grabadora inteligente con IA que{" "}
              <span className="text-accent font-semibold text-lg lg:text-xl">transcribe, resume y organiza</span>
              {" "}automáticamente tus{" "}
              <span className="text-accent font-semibold text-lg lg:text-xl">reuniones, clases y entrevistas</span>.
            </p>

            <div className="mb-5">
              <Badge variant="success">
                <motion.span
                  className="inline-flex"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Truck className="w-3.5 h-3.5" />
                </motion.span>
                {PRODUCT.shipping}
              </Badge>
            </div>

            {/* Price + CTA — the decision, right up top */}
            <div ref={ctaRef} className="flex flex-col items-center md:items-start gap-3 mb-6">
              <div className="flex items-baseline gap-2 md:gap-3">
                <span className="text-text-muted line-through text-sm md:text-lg">
                  {PRODUCT.currency} {PRODUCT.originalPrice}
                </span>
                <span className="text-3xl md:text-5xl font-bold">
                  {PRODUCT.currency} {PRODUCT.salePrice}
                </span>
                <span className="self-start text-[11px] md:text-sm font-bold px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full bg-accent text-white">
                  60% OFF
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center md:items-start justify-center gap-2 md:gap-3 mt-1 md:mt-2">
                <BuyButton onClick={onBuyClick} size="md" className="text-sm md:text-base">
                  COMPRAR AHORA
                </BuyButton>
                <Button variant="secondary" size="md" onClick={onVideoClick} className="text-sm md:text-base">
                  <Play className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  VER PRODUCTO
                </Button>
              </div>
            </div>
          </div>

          {/* Right column — product */}
          <div ref={productRef} className="md:col-span-1 flex justify-center md:justify-end mt-8 md:mt-0">
            <FloatingProduct />
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-5 h-5 text-text-muted" />
      </motion.div>
    </section>
  );
}
