"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePrecio } from "@/components/memoai/precio";

gsap.registerPlugin(ScrollTrigger);

const OFFER_DEADLINE_KEY = "memoai_offer_deadline";
const OFFER_WINDOW_MS = 24 * 60 * 60 * 1000;

function getOfferDeadline(): number {
  const stored = Number(localStorage.getItem(OFFER_DEADLINE_KEY));
  if (stored && stored > Date.now()) return stored;
  const deadline = Date.now() + OFFER_WINDOW_MS;
  localStorage.setItem(OFFER_DEADLINE_KEY, String(deadline));
  return deadline;
}

function msToParts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return { hours: Math.floor(total / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    let deadline: number;
    try {
      deadline = getOfferDeadline();
    } catch {
      deadline = Date.now() + OFFER_WINDOW_MS;
    }
    const tick = () => setTimeLeft(msToParts(deadline - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[
        { label: "Horas", value: timeLeft.hours },
        { label: "Min", value: timeLeft.minutes },
        { label: "Seg", value: timeLeft.seconds },
      ].map((unit, i) => (
        <div key={i} className="text-center">
          <div className="w-16 h-16 rounded-xl bg-surface border border-accent/20 flex items-center justify-center text-2xl font-bold font-mono">
            {pad(unit.value)}
          </div>
          <span className="text-[11px] text-text-muted mt-1 block">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

interface OfferProps {
  onBuyClick: () => void;
}

export function Offer({ onBuyClick }: OfferProps) {
  const precio = usePrecio();
  const sectionRef = useRef<HTMLElement>(null);
  const discount = Math.round((1 - precio.salePrice / precio.originalPrice) * 100);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".offer-card", {
        scale: 0.5,
        opacity: 0,
        y: 100,
        rotateX: -45,
        duration: 1.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".offer-badge", {
        scale: 0,
        opacity: 0,
        rotateZ: -180,
        duration: 0.8,
        delay: 0.3,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".offer-title", {
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
    <section ref={sectionRef} id="offer" className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_60%)]" />

      <div className="max-w-2xl mx-auto">
        <motion.div
          className="offer-title text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="offer-badge mb-6">
            <Badge variant="accent" className="mb-6">
              <Zap className="w-3 h-3" />
              Oferta por tiempo limitado — {discount}% OFF
            </Badge>
          </div>

          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Obtén <span className="text-accent">MemoAI</span> hoy
          </h2>
          <p className="text-text-muted mb-8">
            Aprovecha el precio de lanzamiento antes de que termine.
          </p>

          <CountdownTimer />

          <div className="offer-card p-8 rounded-3xl glass mb-8">
            <div className="flex items-baseline justify-center gap-3 mb-2">
              <span className="text-text-muted line-through text-xl">
                {precio.currency} {precio.originalPrice}
              </span>
              <span className="text-5xl md:text-6xl font-bold gradient-text">
                {precio.currency} {precio.salePrice}
              </span>
            </div>
            <p className="text-text-muted text-sm mb-6">Pago único — Sin suscripciones</p>

            <Button
              size="lg"
              className="w-full text-lg"
              onClick={onBuyClick}
            >
              COMPRAR AHORA
            </Button>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { icon: Truck, label: "Envío gratis" },
                { icon: ShieldCheck, label: "Contraentrega disponible" },
                { icon: MessageCircle, label: "Soporte por WhatsApp" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-accent-light" />
                  </div>
                  <span className="text-xs text-text-muted">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-[11px] md:text-xs text-text-muted mb-3 text-center uppercase tracking-wider">
                Formas de pago
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {["Yape", "Plin", "WhatsApp", "Contraentrega"].map((method) => (
                  <span key={method} className="px-3 py-1.5 rounded-lg bg-foreground/5 text-foreground/70 text-xs font-bold">
                    {method}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-text-muted/60 mt-3 text-center">
                Coordinamos tu pago por WhatsApp y confirmamos tu pedido antes del envío
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
