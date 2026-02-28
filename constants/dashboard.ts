import type { RoleKey } from "@/types/dashboard";

/** Default dashboard path per role after sign-in. Keys match Prisma Role enum. */
export const DASHBOARD_PATH_BY_ROLE: Record<string, string> = {
  OPERATOR: "/operator",
  SUPERVISOR: "/supervisor",
  NIGHT_SUPERVISOR: "/supervisor",
  RMP: "/rmp",
  ER: "/rmp",
  QRV_SUPERVISOR: "/qrv",
};

/** Breadcrumb label, href, and title for each role's alarms page. */
export const ROLE_ALARMS_CONFIG: Record<
  RoleKey,
  { breadcrumbLabel: string; breadcrumbHref: string; title: string }
> = {
  operator: {
    breadcrumbLabel: "Operator",
    breadcrumbHref: "/operator",
    title: "Alarms",
  },
  supervisor: {
    breadcrumbLabel: "Supervisor",
    breadcrumbHref: "/supervisor",
    title: "Alarms (your chainages)",
  },
  rmp: {
    breadcrumbLabel: "RMP",
    breadcrumbHref: "/rmp",
    title: "Alarms (your chainages)",
  },
  qrv: {
    breadcrumbLabel: "QRV",
    breadcrumbHref: "/qrv",
    title: "Escalated alarms",
  },
};
