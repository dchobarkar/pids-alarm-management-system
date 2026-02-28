import type { SlaBreachResult } from "@/types/sla";
import { assertTransition } from "@/lib/alarm-state-machine/transitions";
import { prisma } from "@/api/db";
import { SLA_MINUTES } from "@/constants/sla";
import {
  findActiveAlarmsForSlaCheck,
  updateAlarmStatus,
  createAlarmLog,
} from "@/api/alarm/alarm.repository";

/**
 * Check all active alarms for SLA breach and auto-escalate.
 * Call from cron / timer (e.g. API route or Azure Function).
 */
export const checkSlaBreaches = async (): Promise<SlaBreachResult[]> => {
  const alarms = await findActiveAlarmsForSlaCheck();
  const now = Date.now();
  const breached: SlaBreachResult[] = [];

  for (const alarm of alarms) {
    const limitMinutes = SLA_MINUTES[alarm.status as keyof typeof SLA_MINUTES];
    if (limitMinutes == null) continue;

    let startMs: number;
    if (alarm.status === "UNASSIGNED") {
      startMs = alarm.createdAt.getTime();
    } else {
      const a = alarm.assignments[0];
      if (!a) continue;
      startMs =
        alarm.status === "IN_PROGRESS" && a.acceptedAt
          ? a.acceptedAt.getTime()
          : a.assignedAt.getTime();
    }

    const elapsedMinutes = (now - startMs) / (60 * 1000);
    if (elapsedMinutes < limitMinutes) continue;

    try {
      assertTransition(alarm.status, "ESCALATED");
    } catch {
      continue;
    }

    await prisma.$transaction([
      updateAlarmStatus(alarm.id, "ESCALATED"),
      createAlarmLog(alarm.id, "ALARM_AUTO_ESCALATED", null, {
        reason: "SLA exceeded",
        elapsedMinutes: Math.round(elapsedMinutes),
        previousStatus: alarm.status,
      }),
    ]);

    breached.push({
      alarmId: alarm.id,
      status: alarm.status,
      elapsedMinutes,
    });
  }

  return breached;
};
