"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/types/actions";
import {
  markVerified as markVerifiedService,
  markFalseAlarm as markFalseAlarmService,
} from "@/api/alarm/alarm.service";
import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";

const revalidateAlarmPaths = () => {
  revalidatePath("/operator/reviews");
  revalidatePath("/operator/alarms");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/rmp/alarms");
};

/** Operator marks alarm as VERIFIED. */
export const markVerified = async (alarmId: string): Promise<ActionResult> => {
  const session = await requireRole(Role.OPERATOR);
  const result = await markVerifiedService(alarmId, session.user.id);

  if (result.success) revalidateAlarmPaths();

  return result;
};

/** Operator marks alarm as FALSE_ALARM. */
export const markFalseAlarm = async (
  alarmId: string,
): Promise<ActionResult> => {
  const session = await requireRole(Role.OPERATOR);
  const result = await markFalseAlarmService(alarmId, session.user.id);

  if (result.success) revalidateAlarmPaths();

  return result;
};
