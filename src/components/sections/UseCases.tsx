"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Briefcase, Scale, GraduationCap, Users, Newspaper, TrendingUp } from "lucide-react";
import { USE_CASES } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  Scale,
  GraduationCap,
  Users,
  Newspaper,
  TrendingUp,
};

export function UseCases() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(gridRef.current!.children);
      
      cards.forEach((card, i) => {
        const angle = (i / cards.length) * Math.PI * 2;
        const startX = Math.cos(angle) * 400;
        const startY = Math.sin(angle) * 400;

        gsap.fromTo(
          card,
          {
            x: startX,
            y: startY,
            opacity: 0,
            scale: 0.3,
            rotateZ: (Math.random() - 0.5) * 45,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotateZ: 0,
            duration: 1.2,
            delay: i * 0.1,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.from(".usecases-title", {
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-4 bg-background/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.06),transparent_60%)]" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="usecases-title text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-mono text-purple-400 uppercase tracking-widest mb-4 block">
            Casos de uso
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Diseñado para <span className="gradient-text">todos</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            MemoAI se adapta a cualquier profesión donde la información es clave.
          </p>
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((useCase, i) => {
            const Icon = iconMap[useCase.icon];
            return (
              <motion.div
                key={i}
                className="group relative p-8 rounded-2xl bg-surface/40 border border-border hover:border-purple-500/30 transition-all duration-500 text-center"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-purple-500/20 transition-colors">
                  {Icon && <Icon className="w-8 h-8 text-purple-400" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-sm text-text-muted">{useCase.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
