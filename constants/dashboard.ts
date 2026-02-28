import type { LucideIcon } from "lucide-react";
import { Bell, ClipboardCheck, MapPin, Network, Users } from "lucide-react";

import type { RoleKey } from "@/types/dashboard";

/** Quick links for the operator dashboard. */
export const OPERATOR_QUICK_LINKS: ReadonlyArray<{
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    href: "/operator/alarms",
    label: "Alarms",
    description: "View and manage pipeline intrusion alarms",
    icon: Bell,
  },
  {
    href: "/operator/reviews",
    label: "Reviews",
    description: "Review and verify alarm handling",
    icon: ClipboardCheck,
  },
  {
    href: "/operator/users",
    label: "Users",
    description: "Manage operators and roles",
    icon: Users,
  },
  {
    href: "/operator/chainages",
    label: "Chainages",
    description: "Configure chainage definitions",
    icon: MapPin,
  },
  {
    href: "/operator/chainage-mapping",
    label: "Chainage mapping",
    description: "Map chainages to users and coverage",
    icon: Network,
  },
];

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
