"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";

const navItems = [{ label: "Dashboard", href: "/supervisor" }];

const SupervisorNav = () => {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-14 z-30 bg-(--bg-surface) border-b border-(--border-default) flex items-center justify-between px-6">
        <Link
          href="/supervisor"
          className="text-lg font-semibold text-(--text-primary)"
        >
          PIDS — Supervisor
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-(--text-secondary) hover:text-(--text-primary)"
        >
          Sign out
        </button>
      </header>
      <aside className="w-64 bg-(--bg-surface) border-r border-(--border-default) fixed inset-y-0 left-0 pt-14">
        <nav className="flex flex-col space-y-1 p-4">
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
    </>
  );
};

export default SupervisorNav;
