import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { getDashboardPathForRole } from "@/lib/auth/auth-options";
import type { Role } from "@/lib/generated/prisma";

const DashboardPage = async () => {
  const session = await getSession();
  if (session?.user?.role) {
    redirect(getDashboardPathForRole(session.user.role as Role));
  }
  redirect("/login");
};

export default DashboardPage;