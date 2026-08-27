"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FinalCTAProps {
  onBuyClick: () => void;
}

export function FinalCTA({ onBuyClick }: FinalCTAProps) {
  return (
    <section className="relative py-32 px-4 overflow-hidden bg-background/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-t from-accent/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[200px]" />
      {/* Faint waveform watermark — bookends the one in Hero */}
      <div
        className="absolute inset-x-0 top-0 h-48 opacity-[0.04] pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--accent) 0px, var(--accent) 3px, transparent 3px, transparent 14px)",
        }}
      />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
          Empieza a recuperar <span className="text-accent">horas de tu semana</span>
        </h2>
        <p className="text-text-muted text-lg mb-10 max-w-xl mx-auto">
          Deja que MemoAI escuche, transcriba y organice por ti.
        </p>

        <div>
          <Button
            size="lg"
            className="text-lg px-10"
            onClick={onBuyClick}
          >
            COMPRAR AHORA
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
