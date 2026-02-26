import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import SupervisorNav from "./SupervisorNav";

const SUPERVISOR_ROLES: Role[] = [
  Role.SUPERVISOR,
  Role.NIGHT_SUPERVISOR,
  Role.QRV_SUPERVISOR,
];

export default async function SupervisorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireRole(SUPERVISOR_ROLES);

  return (
    <div className="min-h-screen bg-(--bg-app)">
      <SupervisorNav />
      <main className="pl-64 pt-14 min-h-screen">{children}</main>
    </div>
  );
}
