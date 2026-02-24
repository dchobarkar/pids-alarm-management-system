import type { Role } from "@prisma/client";

export const ROLES = {
  OPERATOR: "OPERATOR",
  SUPERVISOR: "SUPERVISOR",
  NIGHT_SUPERVISOR: "NIGHT_SUPERVISOR",
  RMP: "RMP",
  ER: "ER",
  QRV_SUPERVISOR: "QRV_SUPERVISOR",
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export function canCreateAlarm(role: Role): boolean {
  return role === "OPERATOR";
}

export function canManageUsers(role: Role): boolean {
  return role === "OPERATOR";
}

export function canCloseAlarm(role: Role): boolean {
  return role === "OPERATOR";
}

export function canAssignToOthers(role: Role): boolean {
  return role === "SUPERVISOR" || role === "NIGHT_SUPERVISOR";
}

export function canSelfAssign(role: Role): boolean {
  return role === "RMP" || role === "ER";
}

export function canSubmitReport(role: Role): boolean {
  return role === "RMP" || role === "ER";
}

export function canViewChainageAlarms(role: Role): boolean {
  return (
    role === "SUPERVISOR" ||
    role === "NIGHT_SUPERVISOR" ||
    role === "RMP" ||
    role === "ER"
  );
}

export function canViewAllAlarms(role: Role): boolean {
  return role === "OPERATOR";
}

export function canViewOversight(role: Role): boolean {
  return role === "QRV_SUPERVISOR";
}

export function getDashboardRoute(role: Role): string {
  if (role === "OPERATOR") return "/dashboard";
  if (role === "QRV_SUPERVISOR") return "/dashboard";
  if (canViewChainageAlarms(role)) return "/dashboard";
  return "/dashboard";
}

export function canAccessRoute(role: Role, path: string): boolean {
  if (path.startsWith("/login")) return true;

  if (path === "/dashboard") return true;
  if (path === "/alarms/create") return canCreateAlarm(role);
  if (path === "/alarms" || path.startsWith("/alarms/"))
    return canViewAllAlarms(role) || canViewChainageAlarms(role) || canViewOversight(role);
  if (path.startsWith("/assignments"))
    return canAssignToOthers(role) || canSelfAssign(role);
  if (path.startsWith("/reports"))
    return canSubmitReport(role) || canViewAllAlarms(role) || canAssignToOthers(role);
  if (path.startsWith("/users")) return canManageUsers(role);

  return true;
}
