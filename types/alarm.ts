export type {
  AlarmWithRelations,
  GetAlarmsFilters,
} from "@/lib/scope/alarm-scope";

export type AlarmsSearchParams = {
  status?: string;
  criticality?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type LoadScopedAlarmsOptions = {
  rmpStatusFilter?: boolean;
};
