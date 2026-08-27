"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Sparkles, AudioLines, BatteryFull, FolderOpen } from "lucide-react";

const idleWave = [30, 45, 35, 55, 40, 60, 42, 50, 32, 58, 38, 48, 34, 52, 40];

const floatingStats = [
  // Left side: Transcribe (near top, clear of the AI Note label), Resume (middle), Organiza (bottom)
  { icon: FileText, value: "Transcribe", label: "en tiempo real", className: "-top-4 md:-top-6 -left-6 md:-left-16", delay: 0 },
  { icon: Sparkles, value: "Resume", label: "con IA", className: "top-[42%] -translate-y-1/2 -left-8 md:-left-20", delay: 0.6 },
  { icon: FolderOpen, value: "Organiza", label: "por tema", className: "bottom-8 md:bottom-12 -left-6 md:-left-16", delay: 1.2 },
  // Right side: Audio HD lower, clear of the record button up top; Batería near bottom
  { icon: AudioLines, value: "Audio HD", label: "alta calidad", className: "top-24 md:top-32 -right-6 md:-right-16", delay: 0.3 },
  { icon: BatteryFull, value: "20h", label: "de batería", className: "bottom-8 md:bottom-12 -right-6 md:-right-16", delay: 0.9 },
];

export function FloatingProduct() {
  const [isRecording, setIsRecording] = useState(false);

  const handleToggle = () => setIsRecording((v) => !v);

  return (
    <div className="relative flex items-center justify-center py-6" style={{ perspective: 1200 }}>
      {/* Ground shadow — breathes opposite the float */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-52 md:w-64 h-8 bg-black/25 blur-2xl rounded-full"
        animate={{ scaleX: [1, 0.82, 1], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-56 md:w-72 h-6 bg-accent/10 blur-2xl rounded-full" />

      <motion.button
        type="button"
        onClick={handleToggle}
        aria-pressed={isRecording}
        aria-label={isRecording ? "Detener grabación de demostración" : "Probar efecto de grabación"}
        className="relative z-10 cursor-pointer"
        animate={{
          y: [0, -16, 0],
          rotateY: [-18, -11, -18],
          rotateX: [9, 5, 9],
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`relative w-60 h-80 md:w-80 md:h-[420px] rounded-[1.5rem] md:rounded-[1.75rem] bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 border overflow-hidden p-3.5 md:p-5 transition-shadow duration-500 ${
            isRecording
              ? "border-red-500/30 shadow-[0_30px_60px_rgba(10,10,10,0.28),0_0_60px_rgba(239,68,68,0.25)]"
              : "border-black/20 shadow-[0_30px_60px_rgba(10,10,10,0.28),0_4px_14px_rgba(99,102,241,0.14)]"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-accent/15 via-transparent to-white/10 pointer-events-none" />

          {/* Recording sonar rings */}
          <AnimatePresence>
            {isRecording && (
              <>
                {[0, 0.6, 1.2].map((delay) => (
                  <motion.div
                    key={delay}
                    className="absolute inset-0 rounded-[1.5rem] md:rounded-[1.75rem] border-2 border-red-500/40 pointer-events-none"
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.12 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Top status bar */}
          <div className="relative z-10 flex items-center justify-between rounded-xl bg-black/30 border border-white/10 px-3 py-2 md:px-4 md:py-2.5">
            <span
              className="text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase"
              style={{ fontFamily: '"Braze", sans-serif' }}
            >
              {isRecording ? (
                <span className="text-red-400">Grabando…</span>
              ) : (
                <>
                  <span className="text-accent-light">AI</span>{" "}
                  <span className="text-white/80">Note</span>
                </>
              )}
            </span>
            <motion.div
              className={`relative w-4 h-4 md:w-5 md:h-5 rounded-full border flex items-center justify-center ${
                isRecording ? "border-red-500/70" : "border-accent-light/60"
              }`}
              animate={
                isRecording
                  ? { boxShadow: ["0 0 0px rgba(239,68,68,0)", "0 0 10px rgba(239,68,68,0.8)", "0 0 0px rgba(239,68,68,0)"] }
                  : { boxShadow: ["0 0 0px rgba(129,140,248,0)", "0 0 8px rgba(129,140,248,0.6)", "0 0 0px rgba(129,140,248,0)"] }
              }
              transition={{ duration: isRecording ? 1 : 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isRecording ? "bg-red-500" : "bg-accent-light"}`} />
            </motion.div>
          </div>

          {/* Waveform grille */}
          <div className="relative z-10 flex-1 flex items-end justify-center gap-[6px] md:gap-2 h-40 md:h-56 mt-5 md:mt-7">
            {idleWave.map((h, i) => (
              <motion.span
                key={i}
                className={`w-[3px] md:w-1 rounded-full ${isRecording ? "bg-red-400/70" : "bg-white/20"}`}
                animate={
                  isRecording
                    ? { height: [`${h}%`, `${Math.min(95, h + 35)}%`, `${h}%`], opacity: [0.7, 1, 0.7] }
                    : { height: `${h}%`, opacity: [0.5, 1, 0.5] }
                }
                transition={{
                  duration: isRecording ? 0.5 + (i % 3) * 0.15 : 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * (isRecording ? 0.03 : 0.08),
                }}
              />
            ))}
          </div>

          <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[9px] md:text-[11px] font-bold tracking-[0.3em] text-white/50 uppercase" style={{ fontFamily: '"Braze", sans-serif' }}>
              MemoAI
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.button>

      {/* Floating glass capability widgets */}
      {floatingStats.map(({ icon: Icon, value, label, className, delay }) => (
        <motion.div
          key={label}
          className={`absolute z-20 glass rounded-2xl px-3 py-2 md:px-3.5 md:py-2.5 flex items-center gap-2 shadow-[0_8px_24px_rgba(10,10,10,0.08)] pointer-events-none ${className}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: 0.6 + delay },
            scale: { duration: 0.5, delay: 0.6 + delay },
            y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay },
          }}
        >
          <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
            <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
          </div>
          <div className="leading-tight whitespace-nowrap">
            <div className="text-xs md:text-sm font-bold text-foreground">{value}</div>
            <div className="text-[9px] md:text-[10px] text-text-muted">{label}</div>
          </div>
        </motion.div>
      ))}

      {/* Click hint — always visible, text swaps with recording state */}
      {/* Mobile: below the device, arrow pointing up */}
      <motion.div
        className="absolute z-20 md:hidden -bottom-2 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 2.6 },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 2.6 },
        }}
      >
        <svg width="14" height="8" viewBox="0 0 14 8" className="-mb-px drop-shadow-sm">
          <path d="M0 8 L7 0 L14 8 Z" fill="rgba(255,255,255,0.75)" />
        </svg>
        <span className="inline-flex items-center gap-1.5 glass rounded-full text-foreground text-[10px] font-semibold px-3 py-1.5 whitespace-nowrap shadow-lg">
          {isRecording ? "Apagar efecto" : "Toca el producto"}
        </span>
      </motion.div>

      {/* Desktop: above the top-right corner, arrow pointing down at it */}
      <motion.div
        className="absolute z-20 hidden md:flex -top-14 right-2 flex-col items-center pointer-events-none"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 2.6 },
          y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 2.6 },
        }}
      >
        <span className="inline-flex items-center gap-1.5 glass rounded-full text-foreground text-xs font-semibold px-3 py-1.5 whitespace-nowrap shadow-lg">
          {isRecording ? "Apagar efecto" : "Click en el producto"}
        </span>
        {/* Arrow pointing down at the top-right corner */}
        <svg width="14" height="8" viewBox="0 0 14 8" className="-mt-px drop-shadow-sm">
          <path d="M0 0 L14 0 L7 8 Z" fill="rgba(255,255,255,0.75)" />
        </svg>
      </motion.div>
    </div>
  );
}
