"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Mic, Wifi } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function FloatingProduct() {
  const productRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!productRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(productRef.current, {
        rotateY: 15,
        rotateX: -5,
        scrollTrigger: {
          trigger: "#product-scene",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      gsap.to(productRef.current, {
        y: -80,
        scrollTrigger: {
          trigger: "#product-scene",
          start: "top top",
          end: "50% center",
          scrub: 1,
        },
      });

      gsap.fromTo(
        productRef.current,
        { scale: 1 },
        {
          scale: 1.1,
          scrollTrigger: {
            trigger: "#product-scene",
            start: "50% center",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!glowRef.current) return;
    gsap.to(glowRef.current, {
      opacity: 0.8,
      scale: 1.3,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  useEffect(() => {
    if (!ringRef.current) return;
    gsap.to(ringRef.current, {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: "none",
    });
  }, []);

  return (
    <div className="relative flex items-center justify-center py-8">
      <div
        ref={glowRef}
        className="absolute w-72 h-72 md:w-[500px] md:h-[500px] rounded-full bg-accent/30 blur-[120px]"
      />

      <div
        ref={ringRef}
        className="absolute w-80 h-80 md:w-[450px] md:h-[450px] rounded-full border border-accent/20"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-purple-400" />
      </div>

      <motion.div
        ref={productRef}
        className="relative z-10"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        <div className="relative w-40 h-56 md:w-72 md:h-[420px] rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-950 border-2 border-white/20 shadow-[0_0_50px_rgba(99,102,241,0.3),0_15px_40px_rgba(0,0,0,0.5)] md:shadow-[0_0_80px_rgba(99,102,241,0.4),0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-transparent to-white/10" />

          <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 w-8 md:w-12 h-1 md:h-1.5 rounded-full bg-white/20" />

          <div className="absolute top-10 right-6 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Wifi className="w-3 h-3 text-emerald-400/60" />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-16 h-16 md:w-28 md:h-28 rounded-full border-[2px] md:border-[3px] border-accent/60 flex items-center justify-center bg-accent/5">
              <div className="absolute inset-0 rounded-full bg-accent/10 animate-pulse-glow" />
              <Mic className="w-6 h-6 md:w-12 md:h-12 text-accent-light" />
            </div>
          </div>

          <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 text-center">
            <span className="text-[10px] md:text-base font-bold tracking-[0.4em] text-white/60 uppercase">
              MemoAI
            </span>
            <div className="mt-1 md:mt-2 text-[8px] md:text-[10px] text-white/30 tracking-wider">
              AI RECORDER
            </div>
          </div>

          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 w-10 md:w-16 h-0.5 md:h-1 rounded-full bg-white/10" />

          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 md:w-64 h-6 bg-accent/20 blur-3xl rounded-full" />
      </motion.div>
    </div>
  );
}
