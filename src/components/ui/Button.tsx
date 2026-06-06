"use client";

import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-accent hover:bg-accent-light text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)]",
  secondary:
    "glass text-foreground hover:bg-white/10",
  ghost:
    "text-text-muted hover:text-foreground hover:bg-white/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...(props as object)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
