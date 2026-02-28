"use server";

import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types/actions";
import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import { getAlarmById, updateAlarmStatusWithLog } from "@/api/alarm/alarm-repository";
import { assertTransition } from "@/lib/alarm-state-machine/transitions";

/** Operator marks alarm as VERIFIED. Only Operator role; IN_PROGRESS → VERIFIED. */
export const markVerified = async (alarmId: string): Promise<ActionResult> => {
  const session = await requireRole(Role.OPERATOR);
  const operatorId = session.user.id;

  const alarm = await getAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  assertTransition(alarm.status, "VERIFIED");

  await updateAlarmStatusWithLog(
    alarmId,
    "VERIFIED",
    "ALARM_VERIFIED",
    operatorId,
    { verifiedBy: operatorId },
  );

  revalidatePath("/operator/reviews");
  revalidatePath("/operator/alarms");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/rmp/alarms");
  return { success: true };
};

/** Operator marks alarm as FALSE_ALARM. Only Operator role; IN_PROGRESS → FALSE_ALARM. */
export const markFalseAlarm = async (alarmId: string): Promise<ActionResult> => {
  const session = await requireRole(Role.OPERATOR);
  const operatorId = session.user.id;

  const alarm = await getAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  assertTransition(alarm.status, "FALSE_ALARM");

  await updateAlarmStatusWithLog(
    alarmId,
    "FALSE_ALARM",
    "ALARM_MARKED_FALSE",
    operatorId,
    { markedBy: operatorId },
  );

  revalidatePath("/operator/reviews");
  revalidatePath("/operator/alarms");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/rmp/alarms");
  return { success: true };
};
