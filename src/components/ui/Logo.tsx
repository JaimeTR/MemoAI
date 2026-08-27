import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  color?: "accent" | "green";
  sparkle?: boolean;
}

export function Logo({ size = "md", color = "accent", sparkle = true }: LogoProps) {
  const gradientClass = color === "green" ? "gradient-text-green" : "gradient-text";
  const sizeClasses = {
    sm: "text-lg md:text-xl",
    md: "text-xl md:text-2xl",
    lg: "text-3xl md:text-4xl lg:text-5xl",
  };

  const sparkleSizes = {
    sm: "w-3 h-3 md:w-3.5 md:h-3.5 -top-1.5 -right-3.5",
    md: "w-3.5 h-3.5 md:w-4 md:h-4 -top-2 -right-4",
    lg: "w-4 h-4 md:w-5 md:h-5 -top-2.5 -right-5",
  };

  return (
    <span
      className={`${sizeClasses[size]} font-bold tracking-tight inline-flex items-center`}
      style={{ fontFamily: '"Braze", sans-serif' }}
    >
      <span className="text-foreground">MEMO</span>
      <span className={`${gradientClass} relative`}>
        AI
        {sparkle && <Sparkles className={`absolute ${sparkleSizes[size]} text-accent-light`} />}
      </span>
    </span>
  );
}
