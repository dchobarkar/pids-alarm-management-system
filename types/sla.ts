export type SlaStatus = "ok" | "warning" | "breached";

export interface SlaInfo {
  elapsedMinutes: number;
  limitMinutes: number;
  fractionUsed: number;
  status: SlaStatus;
  label: string;
}

export type SlaBreachResult = {
  alarmId: string;
  status: string;
  elapsedMinutes: number;
};
