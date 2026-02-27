"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Role } from "@/lib/generated/prisma";

type DBSidebarProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
};

type NavItem = { label: string; href: string };

const SIDEBAR_LINKS_BY_ROLE: Record<Role, NavItem[]> = {
  OPERATOR: [
    { label: "Dashboard", href: "/operator" },
    { label: "Alarms", href: "/operator/alarms" },
    { label: "Reviews", href: "/operator/reviews" },
    { label: "Users", href: "/operator/users" },
    { label: "Chainages", href: "/operator/chainages" },
    { label: "Chainage mapping", href: "/operator/chainage-mapping" },
  ],
  SUPERVISOR: [
    { label: "Dashboard", href: "/supervisor" },
    { label: "Alarms", href: "/supervisor/alarms" },
  ],
  NIGHT_SUPERVISOR: [
    { label: "Dashboard", href: "/supervisor" },
    { label: "Alarms", href: "/supervisor/alarms" },
  ],
  RMP: [
    { label: "Dashboard", href: "/rmp" },
    { label: "Alarms", href: "/rmp/alarms" },
    { label: "Tasks", href: "/rmp/tasks" },
  ],
  ER: [
    { label: "Dashboard", href: "/rmp" },
    { label: "Alarms", href: "/rmp/alarms" },
    { label: "Tasks", href: "/rmp/tasks" },
  ],
  QRV_SUPERVISOR: [
    { label: "Dashboard", href: "/qrv" },
    { label: "Alarms", href: "/qrv/alarms" },
  ],
};

const DBSidebar = ({ open, onClose, onNavigate }: DBSidebarProps) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const role = session?.user?.role as Role | undefined;
  const navItems = role ? (SIDEBAR_LINKS_BY_ROLE[role] ?? []) : [];

  const asideClass = cn(
    "fixed inset-y-0 left-0 z-20 w-64 border-r border-(--border-default) bg-(--bg-surface) pt-14 transition-transform duration-200 ease-out",
    "md:translate-x-0",
    open ? "translate-x-0" : "-translate-x-full",
  );

  if (status === "loading" || !role) {
    return (
      <>
        {open && (
          <button
            type="button"
            onClick={onClose}
            className="fixed inset-0 z-10 bg-black/50 md:hidden"
            aria-label="Close menu"
          />
        )}
        <aside className={asideClass}>
          <nav className="flex flex-col space-y-1 p-4">
            <span className="px-4 py-2 text-sm text-(--text-muted)">
              {status === "loading" ? "Loading…" : "No access"}
            </span>
          </nav>
        </aside>
      </>
    );
  }

  return (
    <>
      {open && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-10 bg-black/50 md:hidden"
          aria-label="Close menu"
        />
      )}
      <aside className={asideClass}>
        <div className="flex items-center justify-between border-b border-(--border-default) px-4 py-3 md:hidden">
          <span className="text-sm font-medium text-(--text-primary)">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary)"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <nav className="flex flex-col space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "rounded-md px-4 py-2 text-sm",
                pathname === item.href
                  ? "bg-(--bg-elevated) text-(--brand-primary) font-medium"
                  : "text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary)",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default DBSidebar;
