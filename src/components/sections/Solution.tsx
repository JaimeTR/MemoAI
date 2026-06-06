"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const solutions = [
  { icon: Sparkles, title: "La IA escucha por ti", desc: "Concéntrate en la conversación mientras MemoAI captura cada palabra." },
  { icon: Zap, title: "Transcripción instantánea", desc: "Obtén texto preciso en segundos, no en horas." },
  { icon: Shield, title: "Nunca más pierdas información", desc: "Todo queda registrado, organizado y accesible." },
];

export function Solution() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".solution-item", {
        x: -100,
        opacity: 0,
        rotateY: -45,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".solution-product", {
        scale: 0,
        opacity: 0,
        rotateY: 180,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".solution-title", {
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_60%)]" />
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="solution-title text-sm font-mono text-accent uppercase tracking-widest mb-4 block">
              La solución
            </span>
            <h2 className="solution-title text-3xl md:text-5xl font-bold mb-6">
              MemoAI <span className="gradient-text">elimina</span> esos problemas
            </h2>
            <p className="solution-title text-text-muted mb-8 text-lg">
              Deja de tomar apuntes y concéntrate en lo que realmente importa.
              MemoAI escucha, transcribe y organiza por ti.
            </p>

            <div className="space-y-6">
              {solutions.map((sol, i) => (
                <div
                  key={i}
                  className="solution-item flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                    <sol.icon className="w-5 h-5 text-accent-light" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{sol.title}</h3>
                    <p className="text-sm text-text-muted">{sol.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              className="mt-8 flex items-center gap-2 text-accent-light font-medium cursor-pointer group"
              whileHover={{ x: 5 }}
            >
              Descubre cómo funciona
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </motion.div>

          <motion.div
            className="solution-product relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute w-80 h-80 rounded-full bg-accent/10 blur-[80px]" />
            <div className="relative w-56 h-80 md:w-64 md:h-96 rounded-3xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-accent/20 shadow-[0_0_60px_rgba(99,102,241,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-white/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-accent/40 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-accent animate-pulse-glow" />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <span className="text-xs font-mono text-white/30 tracking-[0.3em] uppercase">MemoAI</span>
              </div>
              <div className="absolute top-8 right-4 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              IA Activa
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
