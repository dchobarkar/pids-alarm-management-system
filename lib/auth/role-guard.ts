import { redirect } from "next/navigation";

import type { Role } from "@/lib/generated/prisma";
import { AUTH_ERROR_PATH } from "@/constants/auth";
import { getSession } from "./get-session";

/** Ensures user is signed in and has one of the allowed roles; redirects otherwise. */
export const requireRole = async (allowedRole: Role | Role[]) => {
  const session = await getSession();
  if (!session?.user) redirect(`${AUTH_ERROR_PATH}?error=SessionRequired`);

  const allowed = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
  if (!allowed.includes(session.user.role as Role))
    redirect(`${AUTH_ERROR_PATH}?error=AccessDenied`);

  return session;
};
