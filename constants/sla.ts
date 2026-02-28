import type { AlarmStatus } from "@/lib/generated/prisma";

/** Max minutes from alarm creation before UNASSIGNED is breached. */
export const SLA_UNASSIGNED_MINUTES = 15;

/** Max minutes from assignment before ASSIGNED is breached. */
export const SLA_ASSIGNED_MINUTES = 20;

/** Max minutes from RMP acceptance before IN_PROGRESS is breached. */
export const SLA_IN_PROGRESS_MINUTES = 30;

/** Fraction (0–1) of limit at which to show warning (e.g. 0.8 = orange at 80%). */
export const SLA_WARNING_THRESHOLD = 0.8;

/**
 * SLA time limits (minutes) per alarm status. Used by SLA engine and display.
 * Breach triggers auto-escalation. Statuses with no limit are null.
 */
export const SLA_MINUTES: Record<AlarmStatus, number | null> = {
  CREATED: null,
  UNASSIGNED: SLA_UNASSIGNED_MINUTES,
  ASSIGNED: SLA_ASSIGNED_MINUTES,
  IN_PROGRESS: SLA_IN_PROGRESS_MINUTES,
  VERIFIED: null,
  FALSE_ALARM: null,
  ESCALATED: null,
  CLOSED: null,
};
