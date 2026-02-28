"use server";

import { revalidatePath } from "next/cache";

import { RMP_ROLES } from "@/constants/roles";
import { requireRole } from "@/lib/auth/role-guard";
import { getAlarmById } from "@/api/alarm/alarm-repository";
import { findChainageUserByUserAndChainage } from "@/api/chainage-user/chainage-user-repository";
import {
  createAssignment,
  acceptAssignment as repoAcceptAssignment,
} from "@/api/assignment/assignment-repository";

import type { ActionResult } from "@/types/actions";

/** RMP self-assigns an UNASSIGNED alarm in their chainage. */
export const selfAssignAlarm = async (
  alarmId: string,
): Promise<ActionResult> => {
  const session = await requireRole(RMP_ROLES);
  const rmpId = session.user.id;

  const alarm = await getAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "UNASSIGNED")
    return { success: false, error: "Alarm is not UNASSIGNED." };

  const inChainage = await findChainageUserByUserAndChainage(
    rmpId,
    alarm.chainageId,
  );
  if (!inChainage)
    return { success: false, error: "Alarm is not in your chainage." };

  await createAssignment({
    alarmId,
    rmpId,
    supervisorId: null,
    actorId: rmpId,
    logAction: "SELF_ASSIGNED",
  });

  revalidatePath("/rmp/alarms");
  revalidatePath("/rmp/tasks");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/operator/alarms");
  return { success: true };
};

/** RMP accepts a PENDING assignment. Sets assignment to ACCEPTED and alarm to IN_PROGRESS. */
export const acceptAssignment = async (
  assignmentId: string,
): Promise<ActionResult> => {
  const session = await requireRole(RMP_ROLES);
  const rmpId = session.user.id;

  const result = await repoAcceptAssignment(assignmentId, rmpId);
  if (!result.success) return result;

  revalidatePath("/rmp/tasks");
  revalidatePath("/rmp/alarms");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/operator/alarms");
  return { success: true };
}
