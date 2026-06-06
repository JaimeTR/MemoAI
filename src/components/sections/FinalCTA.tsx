"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".final-cta-content", {
        scale: 0.5,
        opacity: 0,
        y: 100,
        rotateX: -45,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".final-cta-button", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4 overflow-hidden bg-background/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-t from-accent/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[200px]" />

      <motion.div
        className="final-cta-content relative z-10 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
          Empieza a recuperar <span className="gradient-text">horas de tu semana</span>
        </h2>
        <p className="text-text-muted text-lg mb-10 max-w-xl mx-auto">
          Deja que MemoAI escuche, transcriba y organice por ti.
        </p>

        <div className="final-cta-button">
          <Button
            size="lg"
            className="text-lg px-10"
            onClick={() => document.getElementById("offer")?.scrollIntoView({ behavior: "smooth" })}
          >
            COMPRAR AHORA
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
