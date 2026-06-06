import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "success";
}

const badgeVariants = {
  default: "bg-white/10 text-text-muted",
  accent: "bg-accent/20 text-accent-light border border-accent/30",
  success: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
