"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Alarms", href: "/alarms" },
  { label: "Assignments", href: "/assignments" },
  { label: "Reports", href: "/reports" },
  { label: "Users", href: "/users" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-(--bg-surface) border-r border-(--border-default) fixed inset-y-0 left-0">
      <div className="p-4 text-xl font-semibold text-(--text-primary)">
        PIDS System
      </div>

      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-4 py-2 text-sm rounded-md",
              pathname === item.href
                ? "bg-(--bg-card) text-(--brand-primary)"
                : "text-(--text-secondary) hover:bg-(--bg-card)",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
