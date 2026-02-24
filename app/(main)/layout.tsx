import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { DashboardNav } from "./DashboardNav";
import { SignOutButton } from "./SignOutButton";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-xl font-bold text-[var(--foreground)]">
            PIDS Alarm System
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--muted)]">
              {session.user.name} ({session.user.role})
            </span>
            <SignOutButton />
          </div>
        </div>
        <DashboardNav role={session.user.role} />
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
