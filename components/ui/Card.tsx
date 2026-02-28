import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card = ({ title, action, children, className }: CardProps) => {
  return (
    <section className={cn("card p-4 sm:p-5 bg-linear-to-b from-(--bg-card) to-(--bg-elevated)", className)}>
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between gap-3 border-b border-(--border-default)/70 pb-2">
          {title && (
            <h3 className="text-sm font-semibold tracking-tight text-(--text-primary)">
              {title}
            </h3>
          )}
          {action}
        </header>
      )}

      <div className="text-sm text-(--text-secondary)">{children}</div>
    </section>
  );
};

export default Card;
