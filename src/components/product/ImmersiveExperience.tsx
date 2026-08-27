"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloatingProduct } from "./FloatingProduct";
import { Button } from "@/components/ui/Button";
import {
  Play, Check, Mic, Languages, FileText, GraduationCap, Lightbulb,
  FolderOpen, Download, Timer, PenLine, AlertTriangle, Brain, Clock,
  Circle, AudioLines, BrainCircuit, CheckCircle2,
  Briefcase, Scale, Users, Newspaper, TrendingUp, X, Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ============ COUNTDOWN ============
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 23, s: 47 });
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((p) => {
        let { h, m, s } = p;
        s--; if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 5, m: 23, s: 47 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center justify-center gap-1.5 md:gap-3">
      {[{ v: timeLeft.h, l: "H" }, { v: timeLeft.m, l: "M" }, { v: timeLeft.s, l: "S" }].map((u, i) => (
        <div key={i} className="text-center">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-surface border border-accent/30 flex items-center justify-center text-base md:text-xl font-bold font-mono">
            {pad(u.v)}
          </div>
          <span className="text-[8px] md:text-[9px] text-text-muted mt-0.5 block">{u.l}</span>
        </div>
      ))}
    </div>
  );
}

// ============ GLASS ============
function GlassCard({ children, className = "", style }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl md:rounded-2xl p-2 md:p-4 backdrop-blur-2xl shadow-xl ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function GlassTitle({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl px-4 py-2 md:px-8 md:py-4 backdrop-blur-2xl text-center"
      style={{ background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }}
    >
      <span className="text-[9px] md:text-xs font-mono text-accent/70 uppercase tracking-[0.2em] md:tracking-[0.3em]">{label}</span>
      <div className="text-sm md:text-2xl lg:text-3xl font-bold mt-0.5 md:mt-1">{children}</div>
    </div>
  );
}

// ============ DATA ============
const problemCards = [
  { icon: PenLine, title: "Tomar apuntes", desc: "Pierdes el hilo de la conversación mientras anotas." },
  { icon: AlertTriangle, title: "Perder información", desc: "Detalles clave se pierden para siempre." },
  { icon: Brain, title: "No recordar acuerdos", desc: "Compromisos y decisiones se olvidan." },
  { icon: Clock, title: "Clases complejas", desc: "Horas de contenido imposible de procesar." },
  { icon: FileText, title: "Documentar cuesta", desc: "No puedes escuchar y anotar a la vez." },
];

const benefitCards = [
  { icon: Mic, title: "Graba todo", desc: "Audio HD con cancelación de ruido", side: "l" as const },
  { icon: Languages, title: "Convierte a texto", desc: "Transcripción IA en tiempo real", side: "l" as const },
  { icon: FileText, title: "Resume reuniones", desc: "Resúmenes ejecutivos automáticos", side: "l" as const },
  { icon: GraduationCap, title: "Resume clases", desc: "Notas organizadas por temas", side: "l" as const },
  { icon: Lightbulb, title: "Identifica puntos", desc: "La IA detecta ideas clave", side: "r" as const },
  { icon: FolderOpen, title: "Organiza info", desc: "Archivado inteligente automático", side: "r" as const },
  { icon: Download, title: "Exporta resultados", desc: "PDF, Word, TXT y más", side: "r" as const },
  { icon: Timer, title: "Ahorra horas", desc: "Recupera tu tiempo más valioso", side: "r" as const },
];

const stepCards = [
  { icon: Circle, num: "1", label: "Presiona grabar" },
  { icon: Mic, num: "2", label: "Audio HD registrado" },
  { icon: AudioLines, num: "3", label: "IA transcribe" },
  { icon: BrainCircuit, num: "4", label: "IA resume" },
  { icon: CheckCircle2, num: "5", label: "Notas organizadas" },
];

const useCaseCards = [
  { icon: Briefcase, label: "Profesionales" },
  { icon: Scale, label: "Abogados" },
  { icon: GraduationCap, label: "Estudiantes" },
  { icon: Users, label: "Consultores" },
  { icon: Newspaper, label: "Periodistas" },
  { icon: TrendingUp, label: "Comerciales" },
];

// ============ MAIN ============
export function ImmersiveExperience({ onBuyClick }: { onBuyClick: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const s1Ref = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);
  const s3Ref = useRef<HTMLDivElement>(null);
  const s4Ref = useRef<HTMLDivElement>(null);
  const s5Ref = useRef<HTMLDivElement>(null);
  const s6Ref = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !pinnedRef.current || initialized.current) return;
    initialized.current = true;

    const T = containerRef.current;
    const md = window.innerWidth >= 768;

    const pinEnd = md ? "+=500%" : "+=400%";

    const s1Dur = md ? 16 : 11;
    const s2Start = md ? 14 : 9;
    const s2Dur = md ? 18 : 12;
    const s3Start = md ? 30 : 20;
    const s3Dur = md ? 18 : 12;
    const s4Start = md ? 46 : 31;
    const s4Dur = md ? 18 : 12;
    const s5Start = md ? 62 : 42;
    const s5Dur = md ? 20 : 14;

    // Register all ScrollTriggers first
    const ctx = gsap.context(() => {
      // Pin
      ScrollTrigger.create({
        trigger: T,
        start: "top top",
        end: pinEnd,
        pin: pinnedRef.current,
        pinSpacing: true,
      });

      // Helper: animate a scene in, then out
      const addScene = (
        ref: HTMLDivElement | null,
        titleClass: string,
        startAt: number,
        duration: number,
      ) => {
        if (!ref) return;
        const els = Array.from(ref.children) as HTMLElement[];
        if (els.length === 0) return;

        const start = `${startAt}%`;
        const showEnd = `${startAt + 4}%`;
        const holdEnd = `${startAt + duration - 4}%`;
        const hideEnd = `${startAt + duration}%`;

        // Show the container itself
        gsap.fromTo(ref, { opacity: 0 }, {
          opacity: 1, duration: 0.1,
          scrollTrigger: { trigger: T, start, end: showEnd, scrub: 1 },
        });

        // Title: fade in
        gsap.fromTo(titleClass, { opacity: 0, y: -20, scale: 0.95 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.25,
          scrollTrigger: { trigger: T, start, end: showEnd, scrub: 1 },
        });

        // Cards: stagger in
        const fromX = md ? ((i: number) => (i < els.length / 2 ? -60 : 60)) : 30;
        const fromVars: gsap.TweenVars = {
          opacity: 0,
          x: fromX,
          y: 30,
          scale: 0.7,
        };
        const toVars: gsap.TweenVars = {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          stagger: md ? 0.06 : 0.04,
          duration: md ? 0.45 : 0.35,
        };

        gsap.fromTo(els, fromVars, {
          ...toVars,
          scrollTrigger: { trigger: T, start: showEnd, end: `+=${startAt + duration * 0.35}%`, scrub: 1 },
        });

        // Hide everything (title, cards, and container)
        gsap.to(ref, {
          opacity: 0, duration: 0.2,
          scrollTrigger: { trigger: T, start: holdEnd, end: hideEnd, scrub: 1 },
        });
        gsap.to(titleClass, {
          opacity: 0, y: -20, duration: 0.2,
          scrollTrigger: { trigger: T, start: holdEnd, end: hideEnd, scrub: 1 },
        });
        gsap.to(els, {
          opacity: 0, scale: 0.8, y: -15, stagger: 0.03, duration: 0.2,
          scrollTrigger: { trigger: T, start: holdEnd, end: hideEnd, scrub: 1 },
        });
      };

      addScene(s1Ref.current, ".st1", 0, s1Dur);
      addScene(s2Ref.current, ".st2", s2Start, s2Dur);
      addScene(s3Ref.current, ".st3", s3Start, s3Dur);
      addScene(s4Ref.current, ".st4", s4Start, s4Dur);
      addScene(s5Ref.current, ".st5", s5Start, s5Dur);

      // Scene 6: CTA
      const s6start = md ? "78%" : "55%";
      const s6end = md ? "+=8%" : "+=6%";
      const s6fadeStart = md ? "+=92%" : "+=68%";
      const s6fadeEnd = md ? "+=8%" : "+=6%";
      if (s6Ref.current) {
        gsap.fromTo(s6Ref.current, { opacity: 0, scale: 0.6, y: 40 }, {
          opacity: 1, scale: 1, y: 0, duration: 0.6,
          scrollTrigger: { trigger: T, start: s6start, end: s6end, scrub: 1 },
        });
        gsap.to(s6Ref.current, {
          opacity: 0.5, scale: 0.95,
          scrollTrigger: { trigger: T, start: s6fadeStart, end: s6fadeEnd, scrub: 1 },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Position cards
  const isMobile = useMobile();
  const md = !isMobile;

  return (
    <div ref={containerRef} data-scene-container className="relative" style={{ height: md ? "600vh" : "400vh" }}>
      <div
        ref={pinnedRef}
        className="h-screen w-full overflow-hidden relative"
        style={{ background: "transparent" }}
      >
        {/* PRODUCT - always centered, behind everything */}
        <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
          <FloatingProduct />
        </div>

        {/* ─── TITLES (centered glass cards) ─── */}
        <div className="absolute inset-x-0 flex justify-center z-[20] pointer-events-none" style={{ top: "5%" }}>
          <div className="st1 absolute" style={{ opacity: 0 }}>
            <GlassTitle label="El problema">
              ¿Te suena <span className="text-red-400">familiar</span>?
            </GlassTitle>
          </div>
          <div className="st2 absolute" style={{ opacity: 0 }}>
            <GlassTitle label="Beneficios">
              Todo lo que <span className="gradient-text">hace por ti</span>
            </GlassTitle>
          </div>
          <div className="st3 absolute" style={{ opacity: 0 }}>
            <GlassTitle label="Cómo funciona">
              5 pasos. <span className="gradient-text">Cero esfuerzo.</span>
            </GlassTitle>
          </div>
          <div className="st4 absolute" style={{ opacity: 0 }}>
            <GlassTitle label="Casos de uso">
              Diseñado para <span className="gradient-text">todos</span>
            </GlassTitle>
          </div>
          <div className="st5 absolute" style={{ opacity: 0 }}>
            <GlassTitle label="Comparativa">
              Tradicional vs <span className="gradient-text">MemoAI</span>
            </GlassTitle>
          </div>
        </div>

        {/* ═══ SCENE 1: PROBLEMS ═══ */}
        <div ref={s1Ref} className="absolute inset-0 z-[15] pointer-events-none" style={{ opacity: 0 }}>
          {problemCards.map((c, i) => {
            const Icon = c.icon;
            const l = md ? (i < 3 ? "2%" : "auto") : "50%";
            const r = md ? (i >= 3 ? "2%" : "auto") : "auto";
            const t = md
              ? `${35 + (i < 3 ? i : i - 3) * 22}%`
              : `${42 + i * 11}%`;
            const w = md ? "170px" : "88%";
            const maxW = md ? undefined : "320px";
            const trf = md ? undefined : "translate(-50%, -50%)";
            return (
              <div key={i} className="absolute" style={{ left: l, right: r, top: t, width: w, maxWidth: maxW, transform: trf }}>
                <GlassCard className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs md:text-sm font-semibold block">{c.title}</span>
                    <span className="text-[10px] text-text-muted leading-tight">{c.desc}</span>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* ═══ SCENE 2: BENEFITS ═══ */}
        <div ref={s2Ref} className="absolute inset-0 z-[15] pointer-events-none" style={{ opacity: 0 }}>
          {benefitCards.map((c, i) => {
            const Icon = c.icon;
            const isLeft = c.side === "l";
            const rowIdx = isLeft
              ? benefitCards.filter((x) => x.side === "l").indexOf(c)
              : benefitCards.filter((x) => x.side === "r").indexOf(c);
            const l = md ? (isLeft ? "2%" : "auto") : "50%";
            const r = md ? (isLeft ? "auto" : "2%") : "auto";
            const t = md
              ? `${28 + rowIdx * 18}%`
              : `${22 + i * 9}%`;
            const w = md ? "145px" : "88%";
            const maxW = md ? undefined : "300px";
            const trf = md ? undefined : "translate(-50%, -50%)";
            return (
              <div key={i} className="absolute" style={{ left: l, right: r, top: t, width: w, maxWidth: maxW, transform: trf }}>
                <GlassCard className="flex flex-row md:flex-col items-center md:text-center gap-2 md:gap-1 justify-start md:justify-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-accent-light" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs md:text-sm font-bold block">{c.title}</span>
                    <span className="text-[10px] text-text-muted leading-tight">{c.desc}</span>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* ═══ SCENE 3: STEPS ═══ */}
        <div ref={s3Ref} className="absolute inset-0 z-[15] pointer-events-none" style={{ opacity: 0 }}>
          {stepCards.map((c, i) => {
            const Icon = c.icon;
            const l = md ? `${8 + i * 19}%` : "50%";
            const t = md ? "65%" : `${40 + i * 12}%`;
            const w = md ? "110px" : "86%";
            const maxW = md ? undefined : "300px";
            const trf = md ? undefined : "translate(-50%, -50%)";
            return (
              <div key={i} className="absolute" style={{ left: l, top: t, width: w, maxWidth: maxW, transform: trf }}>
                <GlassCard className="flex flex-row md:flex-col items-center md:text-center gap-2 justify-start md:justify-center">
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-surface border-2 border-accent/30 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-accent-light" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-accent flex items-center justify-center text-[9px] md:text-[10px] font-bold text-white">
                      {c.num}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm font-semibold">{c.label}</span>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* ═══ SCENE 4: USE CASES ═══ */}
        <div ref={s4Ref} className="absolute inset-0 z-[15] pointer-events-none" style={{ opacity: 0 }}>
          {useCaseCards.map((c, i) => {
            const Icon = c.icon;
            const l = md ? (i < 3 ? "2%" : "auto") : "50%";
            const r = md ? (i >= 3 ? "2%" : "auto") : "auto";
            const t = md
              ? `${30 + (i < 3 ? i : i - 3) * 20}%`
              : `${30 + i * 11}%`;
            const w = md ? "150px" : "88%";
            const maxW = md ? undefined : "300px";
            const trf = md ? undefined : "translate(-50%, -50%)";
            return (
              <div key={i} className="absolute" style={{ left: l, right: r, top: t, width: w, maxWidth: maxW, transform: trf }}>
                <GlassCard className="flex flex-row md:flex-col items-center md:text-center gap-2 justify-start md:justify-center border-purple-500/20">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 md:w-5 md:h-5 text-purple-400" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold">{c.label}</span>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* ═══ SCENE 5: COMPARISON ═══ */}
        <div ref={s5Ref} className="absolute inset-0 z-[15] pointer-events-none" style={{ opacity: 0 }}>
          {([
            { I: X, clr: "red", title: "Método Tradicional", items: ["Notas manuales por horas", "Información que se pierde", "Horas para resumir", "Desorganización total", "Dependes de tu memoria", "Sin documentación"], bg: "rgba(239,68,68,0.04)", bd: "rgba(239,68,68,0.2)" },
            { I: Check, clr: "emerald", title: "MemoAI", items: ["Transcripción automática IA", "Resumen inteligente al instante", "Organización inteligente", "Todo registrado y buscable", "Notas perfectas siempre", "Documentación al instante"], bg: "rgba(99,102,241,0.06)", bd: "rgba(99,102,241,0.25)" },
          ] as const).map((panel, pi) => {
            const PI = panel.I;
            const l = md ? (pi === 0 ? "4%" : "auto") : "50%";
            const r = md ? (pi === 0 ? "auto" : "4%") : "auto";
            const t = md ? "42%" : `${33 + pi * 35}%`;
            const w = md ? "270px" : "90%";
            const maxW = md ? undefined : "340px";
            const trf = md ? "translateY(-50%)" : "translate(-50%, -50%)";
            return (
              <div key={pi} className="absolute" style={{ left: l, right: r, top: t, width: w, maxWidth: maxW, transform: trf }}>
                <GlassCard className="flex flex-col gap-1 md:gap-2" style={{ background: panel.bg, borderColor: panel.bd }}>
                  <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1" style={{ color: panel.clr === "red" ? "#f87171" : "#4ade80" }}>
                    <PI className="w-3.5 h-3.5 md:w-5 md:h-5" />
                    <span className="font-bold text-xs md:text-sm">{panel.title}</span>
                  </div>
                  {panel.items.map((t, j) => (
                    <div key={j} className="flex items-center gap-1.5 md:gap-2">
                      <PI className="w-2.5 h-2.5 md:w-3 md:h-3 shrink-0 opacity-50" />
                      <span className="text-[11px] md:text-sm text-text-muted leading-tight">{t}</span>
                    </div>
                  ))}
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* ═══ SCENE 6: CTA + COUNTDOWN ═══ */}
        <div ref={s6Ref} className="absolute inset-0 z-[25] flex items-center justify-center pointer-events-auto" style={{ opacity: 0 }}>
          <GlassCard
            className="flex flex-col items-center gap-3 md:gap-6 p-4 md:p-10 pointer-events-auto mx-4"
            style={{ maxWidth: "400px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}
          >
            <h3 className="text-base md:text-3xl font-bold text-center">
              Empieza a recuperar <span className="gradient-text">horas de tu semana</span>
            </h3>
            <p className="text-xs md:text-sm text-text-muted text-center">
              Deja que MemoAI escuche, transcriba y organice por ti.
            </p>

            <CountdownTimer />

            <div className="flex items-baseline gap-3">
              <span className="text-text-muted line-through text-sm md:text-lg">S/ 755</span>
              <span className="text-2xl md:text-4xl font-bold">S/ 299</span>
            </div>

            <Button size="md" onClick={onBuyClick} className="w-full text-sm shadow-[0_0_40px_rgba(99,102,241,0.4)]">
              <Zap className="w-3.5 h-3.5 md:w-4 md:h-4" /> COMPRAR AHORA
            </Button>
            <Button variant="secondary" size="md" className="w-full text-sm">
              <Play className="w-3.5 h-3.5 md:w-4 md:h-4" /> VER DEMOSTRACIÓN
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
