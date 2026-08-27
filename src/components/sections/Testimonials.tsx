"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Package, Cpu, Battery, Smartphone, Truck, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const included = [
  { icon: Package, title: "Grabadora MemoAI", desc: "Dispositivo físico con audio HD" },
  { icon: Cpu, title: "64GB de almacenamiento", desc: "Miles de horas de grabación" },
  { icon: Battery, title: "Batería de larga duración", desc: "Jornadas completas sin recargar" },
  { icon: Smartphone, title: "App móvil con IA", desc: "Transcripción y resúmenes automáticos" },
  { icon: Truck, title: "Envío gratis", desc: "Lima 2 días, provincia 3 días aprox." },
  { icon: ShieldCheck, title: "Compra protegida", desc: "Soporte por WhatsApp antes y después" },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children);
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs md:text-sm font-mono text-accent uppercase tracking-[0.2em] mb-4 block">
            Tu compra
          </span>
          <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
            Qué incluye tu <span className="text-accent">MemoAI</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto text-sm md:text-base">
            Todo lo que recibes en tu caja, sin letras pequeñas.
          </p>
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {included.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                className="p-5 md:p-6 rounded-2xl bg-white border border-border shadow-[0_2px_16px_rgba(10,10,10,0.05)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)] transition-all duration-500 text-center"
                whileHover={{ y: -4 }}
              >
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent-light" />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-text-muted">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
