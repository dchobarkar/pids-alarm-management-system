/** SLA state for display: within limit, near limit, or breached. */
export type SlaStatus = "ok" | "warning" | "breached";

/** Elapsed time vs limit and display label for an alarm's SLA. */
export interface SlaInfo {
  elapsedMinutes: number;
  limitMinutes: number;
  fractionUsed: number;
  status: SlaStatus;
  label: string;
}

/** Result of an SLA breach check: alarm and elapsed info for alerting. */
export type SlaBreachResult = {
  alarmId: string;
  status: string;
  elapsedMinutes: number;
};
