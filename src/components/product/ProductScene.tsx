"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloatingProduct } from "./FloatingProduct";

gsap.registerPlugin(ScrollTrigger);

export function ProductScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sceneRef.current,
        start: "top top",
        end: "+=400%",
        pin: pinRef.current,
        pinSpacing: true,
        anticipatePin: 1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sceneRef} id="product-scene" className="relative">
      <div
        ref={pinRef}
        className="h-screen w-full flex items-center justify-center sticky top-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)]" />
        <FloatingProduct />
      </div>
    </div>
  );
}
