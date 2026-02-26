import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import RmpNav from "./RmpNav";

const RMP_ROLES: Role[] = [Role.RMP, Role.ER];

export default async function RmpLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireRole(RMP_ROLES);

  return (
    <div className="min-h-screen bg-(--bg-app)">
      <RmpNav />
      <main className="pl-64 pt-14 min-h-screen">{children}</main>
    </div>
  );
}
