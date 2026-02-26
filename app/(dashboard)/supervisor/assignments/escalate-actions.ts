"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import { prisma } from "@/lib/db";
import { assertTransition } from "@/lib/alarm-state-machine/transitions";
import { assertAlarmNotClosed } from "@/lib/alarm-state-machine/guards";

const SUPERVISOR_ROLES: Role[] = [
  Role.SUPERVISOR,
  Role.NIGHT_SUPERVISOR,
  Role.QRV_SUPERVISOR,
];

export type EscalateAlarmResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Supervisor manually escalates alarm. Allowed when status is UNASSIGNED, ASSIGNED, or IN_PROGRESS.
 */
export async function escalateAlarm(
  alarmId: string,
): Promise<EscalateAlarmResult> {
  const session = await requireRole(SUPERVISOR_ROLES);
  const supervisorId = session.user.id;

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    select: { status: true },
  });
  if (!alarm) return { success: false, error: "Alarm not found." };
  assertAlarmNotClosed(alarm.status);
  if (
    alarm.status !== "UNASSIGNED" &&
    alarm.status !== "ASSIGNED" &&
    alarm.status !== "IN_PROGRESS"
  ) {
    return {
      success: false,
      error:
        "Alarm can only be escalated when UNASSIGNED, ASSIGNED, or IN_PROGRESS.",
    };
  }
  assertTransition(alarm.status, "ESCALATED");

  await prisma.$transaction([
    prisma.alarm.update({
      where: { id: alarmId },
      data: { status: "ESCALATED" },
    }),
    prisma.alarmLog.create({
      data: {
        alarmId,
        action: "ALARM_ESCALATED",
        actorId: supervisorId,
        meta: { escalatedBy: supervisorId } as object,
      },
    }),
  ]);

  revalidatePath("/supervisor/alarms");
  revalidatePath("/operator/alarms");
  revalidatePath("/qrv/alarms");
  return { success: true };
}
