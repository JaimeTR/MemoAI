"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { PenLine, AlertTriangle, Brain, Clock, FileText } from "lucide-react";
import { PROBLEMS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  PenLine,
  AlertTriangle,
  Brain,
  Clock,
  FileText,
};

export function Problem() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(cardsRef.current!.children);
      
      cards.forEach((card, i) => {
        const angle = (i / cards.length) * Math.PI * 2;
        const startX = Math.cos(angle) * 300;
        const startY = Math.sin(angle) * 300;

        gsap.fromTo(
          card,
          {
            x: startX,
            y: startY,
            opacity: 0,
            scale: 0.5,
            rotateZ: (Math.random() - 0.5) * 30,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotateZ: 0,
            duration: 1,
            delay: i * 0.1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.from(".problem-title", {
        y: 80,
        opacity: 0,
        scale: 0.8,
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(239,68,68,0.05),transparent_70%)]" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="problem-title text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-mono text-red-400/80 uppercase tracking-widest mb-4 block">
            El problema
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            ¿Te suena <span className="text-red-400">familiar</span>?
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Miles de profesionales y estudiantes enfrentan estos problemas cada día.
          </p>
        </motion.div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEMS.map((problem, i) => {
            const Icon = iconMap[problem.icon];
            return (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-surface/50 border border-red-500/10 hover:border-red-500/30 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                  {Icon && <Icon className="w-6 h-6 text-red-400" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
                <p className="text-sm text-text-muted">{problem.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
