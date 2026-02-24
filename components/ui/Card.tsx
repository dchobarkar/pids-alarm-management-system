import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card = ({ title, action, children, className }: CardProps) => {
  return (
    <div className={cn("card p-4", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-3">
          {title && (
            <h3 className="text-sm font-semibold text-(--text-primary)">
              {title}
            </h3>
          )}
          {action}
        </div>
      )}

      <div className="text-sm">{children}</div>
    </div>
  );
};

export default Card;
