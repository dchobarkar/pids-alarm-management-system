import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: unknown[]) => {
  return twMerge(clsx(inputs));
};

export { cn };
