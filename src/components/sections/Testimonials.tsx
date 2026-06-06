"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(gridRef.current!.children);
      
      cards.forEach((card, i) => {
        const angle = (i / cards.length) * Math.PI * 2;
        const startX = Math.cos(angle) * 350;
        const startY = Math.sin(angle) * 350;

        gsap.fromTo(
          card,
          {
            x: startX,
            y: startY,
            opacity: 0,
            scale: 0.5,
            rotateY: -180,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            duration: 1.2,
            delay: i * 0.15,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      gsap.from(".testimonials-title", {
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.06),transparent_60%)]" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="testimonials-title text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-mono text-accent uppercase tracking-widest mb-4 block">
            Testimonios
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Lo que dicen nuestros <span className="gradient-text">usuarios</span>
          </h2>
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={i}
              className="relative p-8 rounded-2xl bg-surface/60 border border-border hover:border-accent/20 transition-all duration-500"
              whileHover={{ y: -3 }}
            >
              <Quote className="w-8 h-8 text-accent/20 mb-4" />

              <p className="text-foreground/90 mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-sm font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-text-muted">{testimonial.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">{testimonial.result}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
