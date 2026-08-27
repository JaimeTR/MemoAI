"use client";

import { motion } from "framer-motion";
import { Briefcase, Scale, GraduationCap, Users, Newspaper, TrendingUp } from "lucide-react";
import { USE_CASES } from "@/lib/constants";

const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  Scale,
  GraduationCap,
  Users,
  Newspaper,
  TrendingUp,
};

export function UseCases() {
  return (
    <section className="relative py-20 md:py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs md:text-sm font-mono text-accent/80 uppercase tracking-[0.2em] mb-4 block">
            Casos de uso
          </span>
          <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
            Diseñado para <span className="text-accent">todos</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto text-sm md:text-base">
            MemoAI se adapta a cualquier profesión donde la información es clave.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.map((useCase, i) => {
            const Icon = iconMap[useCase.icon];
            return (
              <motion.div
                key={i}
                className="group relative p-8 rounded-2xl bg-white border border-border hover:border-accent/40 shadow-[0_2px_12px_rgba(10,10,10,0.04)] transition-all duration-500 text-center"
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-accent/20 transition-colors">
                  {Icon && <Icon className="w-8 h-8 text-accent-light" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-sm text-text-muted">{useCase.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
