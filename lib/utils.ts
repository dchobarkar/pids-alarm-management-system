import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind class names and resolves conflicts (e.g. px-2 vs px-4). */
export const cn = (...inputs: unknown[]): string => twMerge(clsx(inputs));
