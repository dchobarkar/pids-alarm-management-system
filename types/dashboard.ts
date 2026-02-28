import type { AlarmWithRelations } from "./alarm";
import type { AlarmsSearchParams } from "./alarm";

/** Dashboard role key (route segment). */
export type RoleKey = "operator" | "supervisor" | "rmp" | "qrv";

/** Props for the shared role-based alarms page (operator/supervisor/rmp). */
export interface RoleAlarmsPageProps {
  role: RoleKey;
  alarms: AlarmWithRelations[];
  searchParams: AlarmsSearchParams;
}

/** Per-role config for breadcrumb and title on alarms dashboard. */
export interface RoleAlarmConfig {
  breadcrumbLabel: string;
  breadcrumbHref: string;
  title: string;
}
