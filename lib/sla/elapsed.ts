import type { AlarmStatus } from "@/lib/generated/prisma";
import {
  SLA_UNASSIGNED_MINUTES,
  SLA_ASSIGNED_MINUTES,
  SLA_IN_PROGRESS_MINUTES,
  SLA_WARNING_THRESHOLD,
} from "./config";

export type SlaStatus = "ok" | "warning" | "breached";

export interface SlaInfo {
  elapsedMinutes: number;
  limitMinutes: number;
  fractionUsed: number;
  status: SlaStatus;
  label: string;
}

const getLimitMinutes = (status: AlarmStatus): number | null => {
  switch (status) {
    case "UNASSIGNED":
      return SLA_UNASSIGNED_MINUTES;
    case "ASSIGNED":
      return SLA_ASSIGNED_MINUTES;
    case "IN_PROGRESS":
      return SLA_IN_PROGRESS_MINUTES;
    default:
      return null;
  }
};

/**
 * Compute SLA elapsed and status for display. Uses same rules as server.
 */
export const getSlaInfo = (
  alarmStatus: AlarmStatus,
  alarmCreatedAt: Date,
  assignment?: { assignedAt: Date; acceptedAt: Date | null } | null,
): SlaInfo | null => {
  const limitMinutes = getLimitMinutes(alarmStatus);
  if (limitMinutes == null) return null;

  const startMs =
    alarmStatus === "UNASSIGNED" || !assignment
      ? new Date(alarmCreatedAt).getTime()
      : alarmStatus === "IN_PROGRESS" && assignment.acceptedAt
        ? new Date(assignment.acceptedAt).getTime()
        : new Date(assignment.assignedAt).getTime();

  const elapsedMinutes = (Date.now() - startMs) / (60 * 1000);
  const fractionUsed = elapsedMinutes / limitMinutes;
  const status: SlaStatus =
    fractionUsed >= 1
      ? "breached"
      : fractionUsed >= SLA_WARNING_THRESHOLD
        ? "warning"
        : "ok";

  return {
    elapsedMinutes,
    limitMinutes,
    fractionUsed,
    status,
    label: `${Math.round(elapsedMinutes)}m / ${limitMinutes}m`,
  };
};
