"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  error?: string;
  helperText?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { label, error, helperText, className, ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-sm text-(--text-secondary)">{label}</label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={visible ? "text" : "password"}
            className={cn(
              "w-full pr-10",
              error &&
                "border-(--alarm-critical) focus:border-(--alarm-critical)",
              className,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-(--text-muted) hover:bg-(--bg-elevated) hover:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--brand-primary) focus:ring-offset-1"
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>

        {error && <p className="text-xs text-(--alarm-critical)">{error}</p>}

        {helperText && !error && (
          <p className="text-xs text-(--text-muted)">{helperText}</p>
        )}
      </div>
    );
  },
);

export default PasswordInput;
