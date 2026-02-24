import { cn } from "@/lib/utils";

type Variant =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "closed"
  | "created"
  | "assigned"
  | "investigating"
  | "done";

interface Props {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ variant, children, className }: Props) => {
  const styles: Record<Variant, string> = {
    critical: "badge-critical",
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
    closed: "badge-closed",
    created: "status-created",
    assigned: "status-assigned",
    investigating: "status-investigating",
    done: "status-done",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border border-transparent",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
