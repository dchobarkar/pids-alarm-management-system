"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  AlarmClock,
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  Map,
  Route,
  Users as UsersIcon,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { Role } from "@/lib/generated/prisma";

type DBSidebarProps = {
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const SIDEBAR_LINKS_BY_ROLE: Record<Role, NavItem[]> = {
  OPERATOR: [
    { label: "Dashboard", href: "/operator", icon: LayoutDashboard },
    { label: "Alarms", href: "/operator/alarms", icon: AlarmClock },
    { label: "Reviews", href: "/operator/reviews", icon: CheckCircle2 },
    { label: "Users", href: "/operator/users", icon: UsersIcon },
    { label: "Chainages", href: "/operator/chainages", icon: Map },
    {
      label: "Chainage mapping",
      href: "/operator/chainage-mapping",
      icon: Route,
    },
  ],
  SUPERVISOR: [
    { label: "Dashboard", href: "/supervisor", icon: LayoutDashboard },
    { label: "Alarms", href: "/supervisor/alarms", icon: AlarmClock },
    { label: "Assignments", href: "/supervisor/assignments", icon: ListChecks },
  ],
  NIGHT_SUPERVISOR: [
    { label: "Dashboard", href: "/supervisor", icon: LayoutDashboard },
    { label: "Alarms", href: "/supervisor/alarms", icon: AlarmClock },
    { label: "Assignments", href: "/supervisor/assignments", icon: ListChecks },
  ],
  RMP: [
    { label: "Dashboard", href: "/rmp", icon: LayoutDashboard },
    { label: "Alarms", href: "/rmp/alarms", icon: AlarmClock },
    { label: "Tasks", href: "/rmp/tasks", icon: ListChecks },
  ],
  ER: [
    { label: "Dashboard", href: "/rmp", icon: LayoutDashboard },
    { label: "Alarms", href: "/rmp/alarms", icon: AlarmClock },
    { label: "Tasks", href: "/rmp/tasks", icon: ListChecks },
  ],
  QRV_SUPERVISOR: [
    { label: "Dashboard", href: "/qrv", icon: LayoutDashboard },
    { label: "Alarms", href: "/qrv/alarms", icon: AlarmClock },
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
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-(--bg-elevated) text-(--brand-primary) font-medium"
                    : "text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary)",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active && "text-(--brand-primary)",
                  )}
                  aria-hidden
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default DBSidebar;
