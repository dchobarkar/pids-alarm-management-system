"use server";

import { revalidatePath } from "next/cache";

import { RMP_ROLES } from "@/constants/roles";
import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import { getAlarmById } from "@/api/alarm/alarm.repository";
import {
  findChainageUsersByChainageId,
  findChainageUserByUserAndChainage,
} from "@/api/chainage-user/chainage-user.repository";
import { findUsersByIds, findUserById } from "@/api/user/user.repository";
import { createReassignment } from "@/api/assignment/assignment.service";

import type { ActionResult } from "@/types/actions";

/** Get RMPs that can be assigned to this escalated alarm (same chainage). */
export const getRmpOptionsForEscalatedAlarm = async (
  alarmId: string,
): Promise<
  | { success: true; rmps: { id: string; name: string }[] }
  | { success: false; error: string }
> => {
  await requireRole(Role.QRV_SUPERVISOR);

  const alarm = await getAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "ESCALATED")
    return { success: false, error: "Alarm is not ESCALATED." };

  const chainageUsers = await findChainageUsersByChainageId(alarm.chainageId);
  const userIds = chainageUsers.map((c) => c.userId);
  if (userIds.length === 0) return { success: true, rmps: [] };

  const users = await findUsersByIds(userIds);
  const rmps = users.filter((u) => RMP_ROLES.includes(u.role));

  return {
    success: true,
    rmps: rmps.map((u) => ({ id: u.id, name: u.name })),
  };
};

/** QRV Supervisor reassigns escalated alarm to RMP. */
export const reassignEscalatedAlarm = async (
  alarmId: string,
  rmpId: string,
): Promise<ActionResult> => {
  const session = await requireRole(Role.QRV_SUPERVISOR);

  const alarm = await getAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "ESCALATED")
    return { success: false, error: "Alarm is not ESCALATED." };

  const rmpInChainage = await findChainageUserByUserAndChainage(
    rmpId,
    alarm.chainageId,
  );
  if (!rmpInChainage)
    return {
      success: false,
      error: "RMP is not mapped to this alarm's chainage.",
    };

  const rmpUser = await findUserById(rmpId);
  if (!rmpUser || !RMP_ROLES.includes(rmpUser.role))
    return { success: false, error: "User is not an RMP/ER." };

  await createReassignment({
    alarmId,
    rmpId,
    actorId: session.user.id,
  });

  revalidatePath("/qrv/alarms");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/operator/alarms");
  revalidatePath("/rmp/alarms");
  revalidatePath("/rmp/tasks");
  return { success: true };
};
