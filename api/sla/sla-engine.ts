import type { SlaBreachResult } from "@/types/sla";
import { prisma } from "@/api/db";
import { assertTransition } from "@/lib/alarm-state-machine/transitions";
import { SLA_MINUTES } from "@/lib/sla/config";

/**
 * Check all active alarms for SLA breach and auto-escalate.
 * Call from cron / timer (e.g. API route or Azure Function).
 */
export const checkSlaBreaches = async (): Promise<SlaBreachResult[]> => {
  const alarms = await prisma.alarm.findMany({
    where: {
      status: { in: ["UNASSIGNED", "ASSIGNED", "IN_PROGRESS"] },
    },
    include: {
      assignments: {
        where: { status: { in: ["PENDING", "ACCEPTED"] } },
        orderBy: { assignedAt: "desc" },
        take: 1,
      },
    },
  });

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
      prisma.alarm.update({
        where: { id: alarm.id },
        data: { status: "ESCALATED" },
      }),
      prisma.alarmLog.create({
        data: {
          alarmId: alarm.id,
          action: "ALARM_AUTO_ESCALATED",
          actorId: null,
          meta: {
            reason: "SLA exceeded",
            elapsedMinutes: Math.round(elapsedMinutes),
            previousStatus: alarm.status,
          } as object,
        },
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
