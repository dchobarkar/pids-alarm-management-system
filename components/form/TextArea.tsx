import { TextareaHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, error, className, ...props },
  ref,
) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm text-(--text-secondary)">{label}</label>
      )}

      <textarea
        ref={ref}
        className={cn(
          "min-h-25 resize-y",
          error && "border-(--alarm-critical) focus:border-(--alarm-critical)",
          className,
        )}
        {...props}
      />

      {error && <p className="text-xs text-(--alarm-critical)">{error}</p>}
    </div>
  );
});

export default TextArea;
