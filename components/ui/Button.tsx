import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const Button = ({
  className,
  variant = "primary",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition shadow-sm border";
  const variants: Record<Variant, string> = {
    primary:
      "bg-[var(--brand-primary)] text-white border-transparent hover:bg-[var(--brand-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)]",
    secondary:
      "bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-default)] hover:bg-[var(--bg-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-default)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)]",
    danger:
      "bg-[var(--alarm-critical)] text-white border-transparent hover:bg-[#991b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--alarm-critical)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)]",
    ghost:
      "bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-default)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)]",
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        (disabled || loading) && "opacity-60 cursor-not-allowed",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2
          className="h-4 w-4 animate-spin text-current"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
      {children}
    </button>
  );
};

export default Button;
