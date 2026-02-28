import type { RoleKey } from "@/types/dashboard";

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
