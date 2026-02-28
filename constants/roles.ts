import type { Role } from "@/lib/generated/prisma";

/** Roles that can be assigned to alarms (RMP, ER). Used for assignment dropdowns and validation. */
export const RMP_ROLES: Role[] = ["RMP", "ER"];

/** Roles that can assign alarms to RMPs (Supervisor, Night Supervisor, QRV Supervisor). */
export const SUPERVISOR_ROLES: Role[] = [
  "SUPERVISOR",
  "NIGHT_SUPERVISOR",
  "QRV_SUPERVISOR",
];

/** All roles for admin dropdowns (value + label). */
export const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "OPERATOR", label: "Operator" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "NIGHT_SUPERVISOR", label: "Night Supervisor" },
  { value: "RMP", label: "RMP" },
  { value: "ER", label: "ER" },
  { value: "QRV_SUPERVISOR", label: "QRV Supervisor" },
];
