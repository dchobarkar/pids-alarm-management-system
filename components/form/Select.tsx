import { SelectHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { label, error, options, className, ...props },
  ref,
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm text-(--text-secondary)">{label}</label>
      )}

      <select
        ref={ref}
        className={cn(
          "w-full",
          error && "border-(--alarm-critical) focus:border-(--alarm-critical)",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-xs text-(--alarm-critical)">{error}</p>}
    </div>
  );
});

export default Select;
