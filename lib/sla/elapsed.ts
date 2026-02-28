import type { AlarmStatus } from "@/lib/generated/prisma";
import type { SlaInfo, SlaStatus } from "@/types/sla";
import {
  SLA_UNASSIGNED_MINUTES,
  SLA_ASSIGNED_MINUTES,
  SLA_IN_PROGRESS_MINUTES,
  SLA_WARNING_THRESHOLD,
} from "@/constants/sla";

/** Returns SLA limit in minutes for status, or null if status has no limit. */
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

  let startMs: number;
  switch (alarmStatus) {
    case "UNASSIGNED":
      startMs = new Date(alarmCreatedAt).getTime();
      break;

    case "ASSIGNED":
      if (assignment) startMs = new Date(assignment.assignedAt).getTime();
      else startMs = new Date(alarmCreatedAt).getTime();
      break;

    case "IN_PROGRESS":
      if (assignment?.acceptedAt != null)
        startMs = new Date(assignment.acceptedAt).getTime();
      else if (assignment) startMs = new Date(assignment.assignedAt).getTime();
      else startMs = new Date(alarmCreatedAt).getTime();
      break;

    default:
      startMs = new Date(alarmCreatedAt).getTime();
  }

  const elapsedMinutes = (Date.now() - startMs) / (60 * 1000);
  const fractionUsed = elapsedMinutes / limitMinutes;

  let status: SlaStatus;
  if (fractionUsed >= 1) status = "breached";
  else if (fractionUsed >= SLA_WARNING_THRESHOLD) status = "warning";
  else status = "ok";

  return {
    elapsedMinutes,
    limitMinutes,
    fractionUsed,
    status,
    label: `${Math.round(elapsedMinutes)}m / ${limitMinutes}m`,
  };
};
