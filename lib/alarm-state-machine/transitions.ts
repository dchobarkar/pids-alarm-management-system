import type { AlarmStatus } from "@/lib/generated/prisma";

const ALLOWED_TRANSITIONS: [AlarmStatus, AlarmStatus][] = [
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

/** CLOSED is terminal; no transitions allowed from it. */
export const canTransition = (from: AlarmStatus, to: AlarmStatus): boolean =>
  from !== "CLOSED" &&
  ALLOWED_TRANSITIONS.some(([f, t]) => f === from && t === to);

/**
 * Throws if the transition is not allowed. Use before updating alarm status.
 */
export const assertTransition = (from: AlarmStatus, to: AlarmStatus): void => {
  if (from === "CLOSED") {
    throw new Error("Alarm is closed; no further updates allowed.");
  }
  if (!canTransition(from, to)) {
    throw new Error(`Invalid alarm status transition: ${from} → ${to}.`);
  }
};
