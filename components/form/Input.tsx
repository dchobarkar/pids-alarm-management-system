import { InputHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, className, ...props },
  ref,
) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-sm text-(--text-secondary)">{label}</label>
      )}

      <input
        ref={ref}
        className={cn(
          "w-full",
          error && "border-(--alarm-critical) focus:border-(--alarm-critical)",
          className,
        )}
        {...props}
      />

      {error && <p className="text-xs text-(--alarm-critical)">{error}</p>}

      {helperText && !error && (
        <p className="text-xs text-(--text-muted)">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
