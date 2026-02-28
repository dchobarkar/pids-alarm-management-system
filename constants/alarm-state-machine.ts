import type { AlarmStatus } from "@/lib/generated/prisma";

/**
 * Valid alarm status transitions [from, to]. CLOSED has no outgoing transitions.
 * Used by alarm-state-machine (canTransition, assertTransition).
 */
export const ALLOWED_ALARM_TRANSITIONS: [AlarmStatus, AlarmStatus][] = [
  ["UNASSIGNED", "ASSIGNED"],
  ["ASSIGNED", "IN_PROGRESS"],
  ["IN_PROGRESS", "VERIFIED"],
  ["IN_PROGRESS", "FALSE_ALARM"],
  ["VERIFIED", "CLOSED"],
  ["FALSE_ALARM", "CLOSED"],
  ["UNASSIGNED", "ESCALATED"],
  ["ASSIGNED", "ESCALATED"],
  ["IN_PROGRESS", "ESCALATED"],
  ["ESCALATED", "ASSIGNED"],
];
