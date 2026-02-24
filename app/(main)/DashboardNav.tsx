"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import {
  canCreateAlarm,
  canManageUsers,
  canAssignToOthers,
  canSelfAssign,
  canSubmitReport,
} from "@/lib/rbac";

export function DashboardNav({ role }: { role: Role }) {
  const pathname = usePathname();

  const navItems: { href: string; label: string; show: boolean }[] = [
    { href: "/dashboard", label: "Dashboard", show: true },
    { href: "/alarms", label: "Alarms", show: true },
    { href: "/alarms/create", label: "Create Alarm", show: canCreateAlarm(role) },
    { href: "/assignments", label: "Assignments", show: canAssignToOthers(role) || canSelfAssign(role) },
    { href: "/reports", label: "Reports", show: canSubmitReport(role) || canCreateAlarm(role) },
    { href: "/users", label: "Users", show: canManageUsers(role) },
  ];

  return (
    <nav className="flex gap-1 border-t border-[var(--border)] px-4">
      {navItems
        .filter((item) => item.show)
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              pathname === item.href || (item.href !== "/alarms" && pathname.startsWith(item.href))
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
