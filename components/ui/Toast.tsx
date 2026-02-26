import { useEffect } from "react";

import { cn } from "@/lib/utils";

interface ToastProps {
  id: string;
  message: string;
  variant?: "info" | "success" | "warning" | "error";
  onClose: (id: string) => void;
  duration?: number;
}

const Toast = ({
  id,
  message,
  variant = "info",
  onClose,
  duration = 4000,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, onClose, duration]);

  const bg = {
    info: "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]",
    success: "bg-[var(--alarm-closed)]/10 text-[var(--alarm-closed)]",
    warning: "bg-[var(--alarm-medium)]/10 text-[var(--alarm-medium)]",
    error: "bg-[var(--alarm-critical)]/10 text-[var(--alarm-critical)]",
  };

  return (
    <div
      className={cn(
        "px-4 py-2 rounded-md text-sm border border-transparent shadow-md animate-slide-in",
        bg[variant],
      )}
    >
      {message}
    </div>
  );
};

export default Toast;
