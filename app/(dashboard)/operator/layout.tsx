import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import OperatorNav from "./OperatorNav";

export default async function OperatorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireRole(Role.OPERATOR);

  return (
    <div className="min-h-screen bg-(--bg-app)">
      <OperatorNav />
      <main className="pl-64 pt-14 min-h-screen">{children}</main>
    </div>
  );
}
