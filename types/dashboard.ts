import type { AlarmWithRelations } from "./alarm";
import type { AlarmsSearchParams } from "./alarm";

export type RoleKey = "operator" | "supervisor" | "rmp" | "qrv";

export interface RoleAlarmsPageProps {
  role: RoleKey;
  alarms: AlarmWithRelations[];
  searchParams: AlarmsSearchParams;
}

export interface RoleAlarmConfig {
  breadcrumbLabel: string;
  breadcrumbHref: string;
  title: string;
}
