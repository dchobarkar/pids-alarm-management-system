import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import QrvNav from "./QrvNav";

const QrvLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }> ) => {
  await requireRole(Role.QRV_SUPERVISOR);

  return (
    <div className="min-h-screen bg-(--bg-app)">
      <QrvNav />
      <main className="pl-64 pt-14 min-h-screen">{children}</main>
    </div>
  );
};

export default QrvLayout;