"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProblemSolutionSection } from "@/components/sections/ProblemSolutionSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { UseCases } from "@/components/sections/UseCases";
import { Comparison } from "@/components/sections/Comparison";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { Offer } from "@/components/sections/Offer";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { VideoModal } from "@/components/checkout/VideoModal";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { useScrollProgress } from "@/hooks/useScrollProgress";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const progress = useScrollProgress();
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={mainRef} className="noise-bg">
      <Navbar onBuyClick={() => setCheckoutOpen(true)} />

      <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-light transition-all duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <main>
        <Hero onBuyClick={() => setCheckoutOpen(true)} onVideoClick={() => setVideoOpen(true)} />
        <div id="beneficios" className="scroll-mt-24">
          <ProblemSolutionSection />
        </div>
        <div id="how-it-works" className="scroll-mt-24">
          <HowItWorks />
        </div>
        <div id="usos" className="scroll-mt-24">
          <UseCases />
        </div>
        <Comparison />
        <div id="incluye">
          <Testimonials />
        </div>
        <div id="faq">
          <FAQ />
        </div>
        <Offer onBuyClick={() => setCheckoutOpen(true)} />
        <FinalCTA onBuyClick={() => setCheckoutOpen(true)} />
      </main>

      <Footer />

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
      <WhatsAppButton />
    </div>
  );
}
