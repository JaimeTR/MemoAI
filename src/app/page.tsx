"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ImmersiveExperience } from "@/components/product/ImmersiveExperience";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { VideoModal } from "@/components/checkout/VideoModal";
import { useScrollProgress } from "@/hooks/useScrollProgress";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const progress = useScrollProgress();
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={mainRef} className="noise-bg">
      <Navbar />

      <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-light transition-all duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <main>
        <Hero onBuyClick={() => setCheckoutOpen(true)} onVideoClick={() => setVideoOpen(true)} />
        <ImmersiveExperience onBuyClick={() => setCheckoutOpen(true)} />
      </main>

      <Footer />

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
    </div>
  );
}
