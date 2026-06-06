"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Mic, Languages, FileText, GraduationCap, Lightbulb, FolderOpen, Download, Timer } from "lucide-react";
import { BENEFITS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Mic,
  Languages,
  FileText,
  GraduationCap,
  Lightbulb,
  FolderOpen,
  Download,
  Timer,
};

export function Benefits() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".benefit-card");
      
      cards.forEach((card, i) => {
        const angle = (i / cards.length) * 360;
        const radius = window.innerWidth < 768 ? 150 : 250;
        const radian = (angle * Math.PI) / 180;
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;

        gsap.fromTo(
          card,
          {
            x: x * 2,
            y: y * 2,
            opacity: 0,
            scale: 0.3,
            rotateY: -90,
          },
          {
            x: x,
            y: y,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "center center",
              scrub: 1,
            },
          }
        );
      });

      gsap.from(".benefits-title", {
        y: 100,
        opacity: 0,
        duration: 1,
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
    <section ref={sectionRef} className="relative min-h-screen py-32 px-4 overflow-hidden bg-background/80 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_60%)]" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="benefits-title text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-mono text-accent uppercase tracking-widest mb-4 block">
            Beneficios
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Todo lo que MemoAI <span className="gradient-text">hace por ti</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Cada funcionalidad diseñada para ahorrarte tiempo y potenciar tu productividad.
          </p>
        </motion.div>

        <div className="relative flex items-center justify-center min-h-[600px]">
          {BENEFITS.map((benefit, i) => {
            const Icon = iconMap[benefit.icon];
            return (
              <motion.div
                key={i}
                className="benefit-card absolute w-64 p-6 rounded-2xl bg-surface/80 border border-border hover:border-accent/30 transition-all duration-500 hover:bg-surface backdrop-blur-sm shadow-xl"
                whileHover={{ scale: 1.05, zIndex: 10 }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  {Icon && <Icon className="w-6 h-6 text-accent-light" />}
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-text-muted">{benefit.description}</p>
                <div className="absolute inset-0 rounded-2xl bg-accent/5 opacity-0 hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
