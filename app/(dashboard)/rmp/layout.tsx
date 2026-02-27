import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";

const RMP_ROLES: Role[] = [Role.RMP, Role.ER];

const RmpLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  await requireRole(RMP_ROLES);
  return <>{children}</>;
};

export default RmpLayout;