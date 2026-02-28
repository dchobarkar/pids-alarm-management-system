"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import { prisma } from "@/lib/db";
import { assertTransition } from "@/lib/alarm-state-machine/transitions";

/**
 * Operator closes alarm. Allowed only when status is VERIFIED or FALSE_ALARM.
 */
export async function closeAlarm(alarmId: string): Promise<ActionResult> {
  const session = await requireRole(Role.OPERATOR);
  const operatorId = session.user.id;

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    select: { status: true },
  });
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "VERIFIED" && alarm.status !== "FALSE_ALARM") {
    return {
      success: false,
      error: "Alarm can only be closed when VERIFIED or FALSE_ALARM.",
    };
  }
  assertTransition(alarm.status, "CLOSED");

  await prisma.$transaction([
    prisma.alarm.update({
      where: { id: alarmId },
      data: { status: "CLOSED" },
    }),
    prisma.alarmLog.create({
      data: {
        alarmId,
        action: "ALARM_CLOSED",
        actorId: operatorId,
        meta: { closedBy: operatorId } as object,
      },
    }),
  ]);

  revalidatePath("/operator/alarms");
  revalidatePath(`/operator/alarms/${alarmId}`);
  revalidatePath("/operator/reviews");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/rmp/alarms");
  return { success: true };
}
