import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/get-session";
import { getDashboardPathForRole } from "@/lib/auth/auth-options";
import type { Role } from "@/lib/generated/prisma";

export default async function AuthRedirectPage() {
  const session = await getSession();
  if (!session?.user?.role) redirect("/login");
  const path = getDashboardPathForRole(session.user.role as Role);
  redirect(path);
}
