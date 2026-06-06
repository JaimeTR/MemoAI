"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "glass" | "glow";
}

const cardVariants = {
  default: "bg-surface border border-border",
  glass: "glass",
  glow: "glow-border",
};

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <motion.div
      className={cn("rounded-2xl p-6", cardVariants[variant], className)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      {...(props as object)}
    >
      {children}
    </motion.div>
  );
}
