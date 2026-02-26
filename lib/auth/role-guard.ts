import { redirect } from "next/navigation";

import type { Role } from "@/lib/generated/prisma";
import { getSession } from "./get-session";

export async function requireRole(allowedRole: Role | Role[]) {
  const session = await getSession();
  const allowed = Array.isArray(allowedRole) ? allowedRole : [allowedRole];

  if (!session?.user) redirect("/login");

  if (!allowed.includes(session.user.role as Role)) redirect("/unauthorized");

  return session;
}
