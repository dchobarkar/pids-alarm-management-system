import { useState, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface Props {
  title: string;
  children: ReactNode;
}

const Accordion = ({ title, children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-(--border-default) rounded-md overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-4 py-3 bg-(--bg-surface) flex justify-between items-center"
      >
        <span className="text-sm font-medium text-(--text-primary)">
          {title}
        </span>
        <span
          className={cn(
            "text-sm transform transition-transform",
            open ? "rotate-90" : "",
          )}
        >
          ▶
        </span>
      </button>

      {open && <div className="px-4 py-2 bg-(--bg-card)">{children}</div>}
    </div>
  );
};

export default Accordion;
