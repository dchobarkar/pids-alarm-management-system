import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/get-session";
import { getDashboardPathForRole } from "@/lib/auth/dashboard-paths";
import type { Role } from "@/lib/generated/prisma";

const Page = async () => {
  const session = await getSession();
  if (!session?.user?.role) redirect("/auth/signin");
  const path = getDashboardPathForRole(session.user.role as Role);
  redirect(path);
};

export default Page;
