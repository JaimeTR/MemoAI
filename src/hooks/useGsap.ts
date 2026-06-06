"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapScrollTrigger(
  callback: (gsapInstance: typeof gsap, trigger: ScrollTrigger) => void,
  options?: Partial<ScrollTrigger.Vars>,
  deps: unknown[] = []
) {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: triggerRef.current,
        start: "top center",
        end: "bottom center",
        ...options,
      });
      callback(gsap, st);
    }, triggerRef);

    return () => ctx.revert();
  }, deps);

  return triggerRef;
}
