import type { AlarmStatus } from "@/lib/generated/prisma";

/**
 * Throws if alarm is closed. Use before any mutation (assignment, verification, status change).
 */
export function assertAlarmNotClosed(status: AlarmStatus): void {
  if (status === "CLOSED") {
    throw new Error("Alarm is closed; no further updates allowed.");
  }
}
