"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  PenLine,
  Clock,
  Brain,
  Users,
  FileText,
  AlertTriangle,
  Mic,
  Search,
  FolderOpen,
  ShieldCheck,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    tag: "REUNIONES",
    problem: "Sales de una reunión y olvidas acuerdos importantes",
    problemIcon: PenLine,
    solution: "Graba cada reunión automáticamente",
    solutionDesc:
      "MemoAI captura cada palabra con audio HD. Nunca más perderás un acuerdo, compromiso o decisión importante.",
    solutionIcon: Mic,
    stat: "Todo",
    statLabel: "lo conversado queda registrado",
  },
  {
    tag: "TIEMPO",
    problem: "Pierdes horas escribiendo actas y resúmenes manualmente",
    problemIcon: Clock,
    solution: "Transcribe y resume con IA al instante",
    solutionDesc:
      "La inteligencia artificial convierte horas de audio en resúmenes ejecutivos listos al momento. Cero esfuerzo manual.",
    solutionIcon: FileText,
    stat: "Instantáneo",
    statLabel: "tu resumen queda listo",
  },
  {
    tag: "DISTRACCIÓN",
    problem: "Te distraes tomando apuntes en lugar de prestar atención",
    problemIcon: Brain,
    solution: "Concéntrate en lo importante, MemoAI anota por ti",
    solutionDesc:
      "Participa activamente en tus reuniones y clases. La IA se encarga de capturar, transcribir y organizar todo.",
    solutionIcon: Brain,
    stat: "Plena",
    statLabel: "atención en la conversación",
  },
  {
    tag: "CLIENTES",
    problem: "No recuerdas exactamente qué dijo tu cliente o profesor",
    problemIcon: Users,
    solution: "Encuentra cualquier palabra dicha, al instante",
    solutionDesc:
      "Cada conversación queda transcrita y es 100% buscable. Encuentra el detalle exacto que necesitas en segundos.",
    solutionIcon: Search,
    stat: "Buscable",
    statLabel: "cada palabra queda accesible",
  },
  {
    tag: "DESORDEN",
    problem: "Pasas horas organizando información sin estructura",
    problemIcon: FileText,
    solution: "Todo organizado y accesible al instante",
    solutionDesc:
      "Notas, transcripciones y resúmenes categorizados automáticamente. Encuentra cualquier información al momento.",
    solutionIcon: FolderOpen,
    stat: "Rápido",
    statLabel: "encontrar lo que buscas",
  },
  {
    tag: "ESTRÉS",
    problem: "El miedo a perder información te genera ansiedad constante",
    problemIcon: AlertTriangle,
    solution: "Tranquilidad total, todo queda respaldado",
    solutionDesc:
      "Cada grabación se guarda de forma segura y accesible cuando la necesites. Olvídate de la preocupación de perder información clave.",
    solutionIcon: ShieldCheck,
    stat: "Cero",
    statLabel: "preocupación de olvidar algo",
  },
];

export function ProblemSolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.05),transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div ref={titleRef} className="text-center mb-12 md:mb-16">
          <span className="text-xs md:text-sm font-mono text-accent/80 uppercase tracking-[0.2em] mb-4 block">
            Problema y solución
          </span>
          <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
            Esto te frena. <span className="text-accent">MemoAI</span> lo resuelve.
          </h2>
          <p className="text-text-muted max-w-xl mx-auto text-sm md:text-base">
            Los problemas reales que enfrentas cada día — y cómo desaparece cada uno con MemoAI.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, i) => {
            const ProblemIcon = item.problemIcon;
            const SolutionIcon = item.solutionIcon;
            return (
              <motion.div
                key={i}
                className="rounded-2xl bg-white border border-border hover:border-accent/40 shadow-[0_2px_16px_rgba(10,10,10,0.05)] hover:shadow-[0_8px_32px_rgba(99,102,241,0.1)] transition-all duration-500 p-5 md:p-6"
                whileHover={{ y: -4 }}
              >
                {/* Problem — muted, de-emphasized */}
                <div className="flex items-start gap-3 pb-4 mb-4 border-b border-border">
                  <div className="w-9 h-9 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
                    <ProblemIcon className="w-4 h-4 text-text-muted" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-text-muted/70 uppercase tracking-[0.15em] block mb-1">
                      {item.tag}
                    </span>
                    <p className="text-sm text-text-muted leading-snug">{item.problem}</p>
                  </div>
                </div>

                {/* Solution — accent, the point of the card */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <SolutionIcon className="w-5 h-5 text-accent-light" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">
                      {item.solution}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed mb-3">{item.solutionDesc}</p>
                    <div className="flex items-baseline gap-2 pt-3 border-t border-accent/10">
                      <span className="text-lg md:text-xl font-bold text-accent">{item.stat}</span>
                      <span className="text-[11px] text-text-muted">{item.statLabel}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
