export const DASHBOARD_PATH_BY_ROLE: Record<string, string> = {
  OPERATOR: "/operator",
  SUPERVISOR: "/supervisor",
  NIGHT_SUPERVISOR: "/supervisor",
  RMP: "/rmp",
  ER: "/rmp",
  QRV_SUPERVISOR: "/qrv",
};

export const getDashboardPathForRole = (role: string): string =>
  DASHBOARD_PATH_BY_ROLE[role] ?? "/auth/signin";
