"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface SelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder: string;
  required?: boolean;
  className?: string;
}

export function Select({ name, value, onChange, options, placeholder, required, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className || ""}`}>
      {/* Real select stays in the form for native required validation, invisible under the styled button */}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 opacity-0 pointer-events-none"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => options.length > 0 && setOpen((o) => !o)}
        disabled={options.length === 0}
        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl bg-surface-light/60 border border-border text-foreground focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all text-sm flex items-center justify-between gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={value ? "text-foreground" : "text-text-muted/60"}>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-1.5 w-full max-h-56 overflow-y-auto rounded-xl bg-surface border border-border shadow-2xl p-1"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm text-left cursor-pointer transition-colors ${
                  opt === value ? "bg-accent/10 text-accent font-medium" : "hover:bg-foreground/5 text-foreground"
                }`}
              >
                {opt}
                {opt === value && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
