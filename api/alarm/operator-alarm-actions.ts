"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/types/actions";
import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import { closeAlarm as closeAlarmService } from "@/api/alarm/alarm.service";

/** Operator closes alarm. Allowed only when status is VERIFIED or FALSE_ALARM. */
export const closeAlarm = async (alarmId: string): Promise<ActionResult> => {
  const session = await requireRole(Role.OPERATOR);
  const result = await closeAlarmService(alarmId, session.user.id);

  if (!result.success) return result;

  revalidatePath("/operator/alarms");
  revalidatePath(`/operator/alarms/${alarmId}`);
  revalidatePath("/operator/reviews");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/rmp/alarms");
  return { success: true };
};
