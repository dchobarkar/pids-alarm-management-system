import { cn } from "@/lib/utils";

type Variant = "info" | "success" | "warning" | "error";

interface Props {
  variant?: Variant;
  children: React.ReactNode;
}

const Alert = ({ variant = "info", children }: Props) => {
  const styles: Record<Variant, string> = {
    info: "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]",
    success: "bg-[var(--alarm-closed)]/10 text-[var(--alarm-closed)]",
    warning: "bg-[var(--alarm-medium)]/10 text-[var(--alarm-medium)]",
    error: "bg-[var(--alarm-critical)]/10 text-[var(--alarm-critical)]",
  };

  return (
    <div
      className={cn(
        "px-3 py-2 rounded-md text-sm border border-transparent",
        styles[variant],
      )}
    >
      {children}
    </div>
  );
};

export default Alert;
