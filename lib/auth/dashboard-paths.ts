import { AUTH_SIGN_IN_PATH } from "@/constants/auth";
import { DASHBOARD_PATH_BY_ROLE } from "@/constants/dashboard";

/** Returns the dashboard path for a given role, or sign-in path if unknown. */
export const getDashboardPathForRole = (role: string): string =>
  DASHBOARD_PATH_BY_ROLE[role] ?? AUTH_SIGN_IN_PATH;
