"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const traditional = [
  "Tomar notas manualmente durante horas",
  "Perder información importante",
  "Horas escribiendo resúmenes",
  "Desorganización constante",
  "Depender de tu memoria",
  "Reuniones sin documentación",
];

const memoai = [
  "Transcripción automática en tiempo real",
  "Resumen con IA en segundos",
  "Organización inteligente automática",
  "Todo registrado y buscable",
  "Notas perfectas siempre",
  "Documentación instantánea",
];

export function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".compare-traditional",
        {
          x: -150,
          opacity: 0,
          rotateY: -90,
        },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".compare-memoai",
        {
          x: 150,
          opacity: 0,
          rotateY: 90,
        },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          stagger: 0.1,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.from(".compare-title", {
        y: 80,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.fromTo(
        ".compare-box",
        {
          scale: 0.8,
          opacity: 0,
          y: 50,
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="compare-title text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs md:text-sm font-mono text-accent uppercase tracking-[0.2em] mb-4 block">
            Comparativa
          </span>
          <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
            Método tradicional vs <span className="text-accent">MemoAI</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="compare-box p-8 rounded-2xl bg-white border border-border shadow-[0_2px_16px_rgba(10,10,10,0.05)]">
            <h3 className="text-xl font-bold text-text-muted mb-6 flex items-center gap-2">
              <X className="w-5 h-5" />
              Método Tradicional
            </h3>
            <ul className="space-y-4">
              {traditional.map((item, i) => (
                <li key={i} className="compare-traditional flex items-start gap-3 text-text-muted">
                  <X className="w-4 h-4 text-text-muted/60 mt-1 shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="compare-box p-8 rounded-2xl bg-white border border-accent/25 shadow-[0_2px_16px_rgba(10,10,10,0.05)]">
            <h3 className="text-xl font-bold text-accent mb-6 flex items-center gap-2">
              <Check className="w-5 h-5" />
              MemoAI
            </h3>
            <ul className="space-y-4">
              {memoai.map((item, i) => (
                <li key={i} className="compare-memoai flex items-start gap-3">
                  <Check className="w-4 h-4 text-accent mt-1 shrink-0" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
