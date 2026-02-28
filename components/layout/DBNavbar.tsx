"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { CircleUser, LogOut, Menu, User } from "lucide-react";

import { AUTH_SIGN_IN_PATH } from "@/constants/auth";
import { getDashboardPathForRole } from "@/lib/auth/dashboard-paths";
import { cn } from "@/lib/utils";

type DBNavbarProps = {
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
};

const DBNavbar = ({ sidebarOpen, onSidebarToggle }: DBNavbarProps) => {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between border-b border-(--border-default) bg-(--bg-surface) px-4 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onSidebarToggle && (
          <button
            type="button"
            onClick={onSidebarToggle}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary) md:hidden"
            aria-expanded={sidebarOpen}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
        )}

        <Link
          href={
            session?.user?.role
              ? getDashboardPathForRole(session.user.role)
              : "/"
          }
          className="min-w-0 truncate text-lg font-semibold text-(--text-primary)"
        >
          PIDS Alarm Management
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {status === "loading" ? (
          <div
            className="h-9 w-9 animate-pulse rounded-full bg-(--bg-elevated)"
            aria-hidden
          />
        ) : session?.user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
                "border border-(--border-default) bg-(--bg-surface) text-(--text-secondary)",
                "hover:border-(--border-strong) hover:bg-(--bg-elevated) hover:text-(--text-primary)",
                "focus:outline-none focus:ring-2 focus:ring-(--brand-primary) focus:ring-offset-2",
                menuOpen &&
                  "border-(--border-strong) bg-(--bg-elevated) text-(--text-primary)",
              )}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <CircleUser className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-(--border-default) bg-(--bg-surface) py-1 shadow-(--shadow-card)"
                role="menu"
              >
                <div className="flex items-center gap-3 border-b border-(--border-default) px-4 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--bg-elevated) text-(--text-muted)">
                    <CircleUser
                      className="h-5 w-5"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-(--text-primary)">
                      {session.user.name || "User"}
                    </p>
                    <p className="truncate text-xs text-(--text-muted)">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary)"
                    role="menuitem"
                  >
                    <User className="h-4 w-4 shrink-0" aria-hidden />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: AUTH_SIGN_IN_PATH });
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-(--text-primary)"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default DBNavbar;
