import type { AlarmStatus } from "@/lib/generated/prisma";

/**
 * SLA limits in minutes. Breach triggers auto-escalation.
 */
export const SLA_MINUTES: Record<AlarmStatus, number | null> = {
  CREATED: null,
  UNASSIGNED: 15,
  ASSIGNED: 20,
  IN_PROGRESS: 30,
  VERIFIED: null,
  FALSE_ALARM: null,
  ESCALATED: null,
  CLOSED: null,
};

export const SLA_UNASSIGNED_MINUTES = 15;
export const SLA_ASSIGNED_MINUTES = 20;
export const SLA_IN_PROGRESS_MINUTES = 30;

/** Threshold (0–1) at which to show warning color (e.g. 0.8 = orange at 80%). */
export const SLA_WARNING_THRESHOLD = 0.8;
