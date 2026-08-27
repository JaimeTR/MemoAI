"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { WipeButtonContent } from "@/components/ui/WipeButtonContent";
import { cn } from "@/lib/utils";

interface BuyButtonProps {
  onClick: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function BuyButton({ onClick, className, size = "md", children }: BuyButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      onClick();
      setIsAnimating(false);
    }, 600);
  };

  return (
    <Button
      size={size}
      onClick={handleClick}
      disabled={isAnimating}
      className={cn("relative overflow-hidden", className)}
    >
      <WipeButtonContent isAnimating={isAnimating}>{children}</WipeButtonContent>
    </Button>
  );
}
