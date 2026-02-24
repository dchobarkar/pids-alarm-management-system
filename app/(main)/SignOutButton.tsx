"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
    >
      Sign out
    </button>
  );
}
