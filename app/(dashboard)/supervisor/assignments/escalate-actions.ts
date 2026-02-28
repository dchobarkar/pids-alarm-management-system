"use server";

import { revalidatePath } from "next/cache";

import { SUPERVISOR_ROLES } from "@/constants/roles";
import { requireRole } from "@/lib/auth/role-guard";
import { getAlarmById, updateAlarmStatusWithLog } from "@/api/alarm/alarm-repository";
import { assertTransition } from "@/lib/alarm-state-machine/transitions";
import { assertAlarmNotClosed } from "@/lib/alarm-state-machine/guards";

import type { ActionResult } from "@/types/actions";

/** Supervisor manually escalates alarm. Allowed when UNASSIGNED, ASSIGNED, or IN_PROGRESS. */
export const escalateAlarm = async (alarmId: string): Promise<ActionResult> => {
  const session = await requireRole(SUPERVISOR_ROLES);
  const supervisorId = session.user.id;

  const alarm = await getAlarmById(alarmId);
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

  await updateAlarmStatusWithLog(
    alarmId,
    "ESCALATED",
    "ALARM_ESCALATED",
    supervisorId,
    { escalatedBy: supervisorId },
  );

  revalidatePath("/supervisor/alarms");
  revalidatePath("/operator/alarms");
  revalidatePath("/qrv/alarms");
  return { success: true };
};
