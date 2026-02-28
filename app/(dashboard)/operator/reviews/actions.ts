"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import { prisma } from "@/lib/db";
import { assertTransition } from "@/lib/alarm-state-machine/transitions";

/**
 * Operator marks alarm as VERIFIED. Only Operator role; IN_PROGRESS → VERIFIED.
 */
export async function markVerified(alarmId: string): Promise<ActionResult> {
  const session = await requireRole(Role.OPERATOR);
  const operatorId = session.user.id;

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    select: { status: true },
  });
  if (!alarm) return { success: false, error: "Alarm not found." };
  assertTransition(alarm.status, "VERIFIED");

  await prisma.$transaction([
    prisma.alarm.update({
      where: { id: alarmId },
      data: { status: "VERIFIED" },
    }),
    prisma.alarmLog.create({
      data: {
        alarmId,
        action: "ALARM_VERIFIED",
        actorId: operatorId,
        meta: { verifiedBy: operatorId } as object,
      },
    }),
  ]);

  revalidatePath("/operator/reviews");
  revalidatePath("/operator/alarms");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/rmp/alarms");
  return { success: true };
}

/**
 * Operator marks alarm as FALSE_ALARM. Only Operator role; IN_PROGRESS → FALSE_ALARM.
 */
export async function markFalseAlarm(alarmId: string): Promise<ActionResult> {
  const session = await requireRole(Role.OPERATOR);
  const operatorId = session.user.id;

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    select: { status: true },
  });
  if (!alarm) return { success: false, error: "Alarm not found." };
  assertTransition(alarm.status, "FALSE_ALARM");

  await prisma.$transaction([
    prisma.alarm.update({
      where: { id: alarmId },
      data: { status: "FALSE_ALARM" },
    }),
    prisma.alarmLog.create({
      data: {
        alarmId,
        action: "ALARM_MARKED_FALSE",
        actorId: operatorId,
        meta: { markedBy: operatorId } as object,
      },
    }),
  ]);

  revalidatePath("/operator/reviews");
  revalidatePath("/operator/alarms");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/rmp/alarms");
  return { success: true };
}
