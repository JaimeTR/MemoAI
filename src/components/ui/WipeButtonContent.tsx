"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";

interface WipeButtonContentProps {
  isAnimating: boolean;
  children: ReactNode;
  /** Icon shown in the label — the wipe reuses this same icon, never a different one. */
  icon?: ReactNode;
}

const DEFAULT_ICON = <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />;

/**
 * Drop-in content for any pill-shaped <Button>: renders the label (sized so the
 * button never resizes) plus, on isAnimating, a fill that wipes left-to-right with
 * a rounded leading edge matching the button's own curve — reusable across any
 * rounded-full button that needs this "confirm and advance" effect.
 */
export function WipeButtonContent({ isAnimating, children, icon = DEFAULT_ICON }: WipeButtonContentProps) {
  return (
    <>
      <span className="inline-flex items-center gap-2 invisible" aria-hidden="true">
        {icon}
        {children}
      </span>
      <span className="absolute inset-0 inline-flex items-center justify-center gap-2">
        {icon}
        {children}
      </span>

      <AnimatePresence>
        {isAnimating && (
          <motion.span
            className="absolute inset-y-0 left-0 bg-accent-light"
            style={{ borderTopRightRadius: 999, borderBottomRightRadius: 999 }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.6, ease: "easeIn" }}
          >
            <motion.span
              className="absolute inset-y-0 right-0 flex items-center pr-3 md:pr-4 shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {icon}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </>
  );
}
