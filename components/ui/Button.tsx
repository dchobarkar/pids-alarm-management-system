import { ButtonHTMLAttributes } from "react";

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
    "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition border";
  const variants: Record<Variant, string> = {
    primary:
      "bg-[var(--brand-primary)] text-white border-transparent hover:opacity-90",
    secondary:
      "bg-[var(--bg-surface)] text-[var(--text-primary)] border-[var(--border-default)] hover:bg-[var(--bg-card)]",
    danger:
      "bg-[var(--alarm-critical)] text-white border-transparent hover:opacity-90",
    ghost:
      "bg-transparent text-[var(--text-secondary)] border-transparent hover:bg-[var(--bg-surface)]",
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="animate-spin text-xs">⏳</span>}
      {children}
    </button>
  );
};

export default Button;
