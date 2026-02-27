import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";

const SUPERVISOR_ROLES: Role[] = [
  Role.SUPERVISOR,
  Role.NIGHT_SUPERVISOR,
  Role.QRV_SUPERVISOR,
];

const SupervisorLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  await requireRole(SUPERVISOR_ROLES);
  return <>{children}</>;
};

export default SupervisorLayout;