import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";

const QrvLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  await requireRole(Role.QRV_SUPERVISOR);
  return <>{children}</>;
};

export default QrvLayout;