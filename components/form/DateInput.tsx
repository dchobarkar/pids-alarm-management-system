import { InputHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface DateInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  error?: string;
  helperText?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  function DateInput({ label, error, helperText, className, ...props }, ref) {
    return (
      <div className={cn("w-full min-w-0 space-y-1", className)}>
        {label && (
          <label className="block text-sm font-medium text-(--text-secondary)">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="date"
          className={cn(
            "w-full rounded-sm border border-(--border-default) bg-(--bg-surface) px-3 py-2 text-sm text-(--text-primary) outline-none",
            "focus:border-(--brand-primary) focus:shadow-(--shadow-focus)",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error &&
              "border-(--alarm-critical) focus:border-(--alarm-critical)",
          )}
          {...props}
        />
        {error && <p className="text-xs text-(--alarm-critical)">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-(--text-muted)">{helperText}</p>
        )}
      </div>
    );
  },
);

export default DateInput;
