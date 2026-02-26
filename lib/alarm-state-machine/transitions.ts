import type { AlarmStatus } from "@/lib/generated/prisma";

const ALLOWED_TRANSITIONS: [AlarmStatus, AlarmStatus][] = [
  ["UNASSIGNED", "ASSIGNED"],
  ["ASSIGNED", "IN_PROGRESS"],
];

/**
 * Returns true if transitioning alarm status from `from` to `to` is allowed in Phase 3.
 * Only UNASSIGNED→ASSIGNED and ASSIGNED→IN_PROGRESS are allowed.
 */
export function canTransition(from: AlarmStatus, to: AlarmStatus): boolean {
  return ALLOWED_TRANSITIONS.some(([f, t]) => f === from && t === to);
}

/**
 * Throws if the transition is not allowed. Use before updating alarm status.
 */
export function assertTransition(from: AlarmStatus, to: AlarmStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(
      `Invalid alarm status transition: ${from} → ${to}. Allowed: UNASSIGNED→ASSIGNED, ASSIGNED→IN_PROGRESS.`,
    );
  }
}
