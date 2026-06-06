"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Circle, Mic, AudioLines, BrainCircuit, FileStack, CheckCircle2 } from "lucide-react";
import { STEPS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const stepIcons = [Circle, Mic, AudioLines, BrainCircuit, FileStack];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const ctx = gsap.context(() => {
      const steps = Array.from(timelineRef.current!.children);

      steps.forEach((step, i) => {
        gsap.fromTo(
          step,
          {
            x: i % 2 === 0 ? -200 : 200,
            opacity: 0,
            scale: 0.5,
            rotateY: i % 2 === 0 ? -90 : 90,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 1,
            delay: i * 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.from(".timeline-line", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".how-title", {
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(99,102,241,0.06),transparent_60%)]" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="how-title text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-mono text-accent uppercase tracking-widest mb-4 block">
            Cómo funciona
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            5 pasos. <span className="gradient-text">Cero esfuerzo.</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            De la grabación a las notas organizadas en minutos.
          </p>
        </motion.div>

        <div ref={timelineRef} className="relative">
          <div className="timeline-line absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent/20 to-transparent md:-translate-x-px" />

          {STEPS.map((step, i) => {
            const Icon = stepIcons[i];
            const isEven = i % 2 === 0;

            return (
              <div
                key={i}
                className={`relative flex items-center gap-6 mb-12 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"} hidden md:block`}>
                  <div className={`inline-block p-6 rounded-2xl bg-surface/60 border border-border`}>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-text-muted">{step.description}</p>
                  </div>
                </div>

                <div className="relative z-10 w-16 h-16 rounded-full bg-surface border-2 border-accent/30 flex items-center justify-center shrink-0">
                  {Icon && <Icon className="w-6 h-6 text-accent-light" />}
                </div>

                <div className="flex-1 md:hidden">
                  <div className="p-4 rounded-2xl bg-surface/60 border border-border">
                    <h3 className="font-semibold mb-1">{step.title}</h3>
                    <p className="text-sm text-text-muted">{step.description}</p>
                  </div>
                </div>

                <div className={`flex-1 ${isEven ? "md:text-left" : "md:text-right"} hidden md:block`}>
                  <span className="text-5xl font-bold text-white/5">{String(step.step).padStart(2, "0")}</span>
                </div>
              </div>
            );
          })}

          <motion.div
            className="flex items-center justify-center mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
