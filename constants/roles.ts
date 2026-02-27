import type { Role } from "@/lib/generated/prisma";

export const RMP_ROLES: Role[] = ["RMP", "ER"];

export const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "OPERATOR", label: "Operator" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "NIGHT_SUPERVISOR", label: "Night Supervisor" },
  { value: "RMP", label: "RMP" },
  { value: "ER", label: "ER" },
  { value: "QRV_SUPERVISOR", label: "QRV Supervisor" },
];
