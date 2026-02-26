"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import { prisma } from "@/lib/db";
import {
  createAssignment,
  acceptAssignment as repoAcceptAssignment,
} from "@/lib/assignment/assignment-repository";

const RMP_ROLES: Role[] = [Role.RMP, Role.ER];

export type SelfAssignAlarmResult =
  | { success: true }
  | { success: false; error: string };

/**
 * RMP self-assigns an UNASSIGNED alarm in their chainage.
 */
export async function selfAssignAlarm(
  alarmId: string,
): Promise<SelfAssignAlarmResult> {
  const session = await requireRole(RMP_ROLES);
  const rmpId = session.user.id;

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    select: { status: true, chainageId: true },
  });
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "UNASSIGNED")
    return { success: false, error: "Alarm is not UNASSIGNED." };

  const inChainage = await prisma.chainageUser.findFirst({
    where: { chainageId: alarm.chainageId, userId: rmpId },
  });
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
}

export type AcceptAssignmentResult =
  | { success: true }
  | { success: false; error: string };

/**
 * RMP accepts a PENDING assignment. Sets assignment to ACCEPTED and alarm to IN_PROGRESS.
 */
export async function acceptAssignment(
  assignmentId: string,
): Promise<AcceptAssignmentResult> {
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
