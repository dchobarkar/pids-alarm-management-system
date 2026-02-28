"use server";

import { revalidatePath } from "next/cache";

import { RMP_ROLES, SUPERVISOR_ROLES } from "@/constants/roles";
import { requireRole } from "@/lib/auth/role-guard";
import { getAlarmById } from "@/api/alarm/alarm.repository";
import {
  findChainageUsersByChainageId,
  findChainageUserByUserAndChainage,
} from "@/api/chainage-user/chainage-user.repository";
import { findUsersByIds, findUserById } from "@/api/user/user.repository";
import { createAssignment } from "@/api/assignment/assignment.service";

import type { ActionResult } from "@/types/actions";

/** Get RMPs that can be assigned to this alarm (same chainage). Subordinates first. */
export const getRmpOptionsForAlarm = async (
  alarmId: string,
): Promise<
  | { success: true; rmps: { id: string; name: string }[] }
  | { success: false; error: string }
> => {
  const session = await requireRole(SUPERVISOR_ROLES);
  const supervisorId = session.user.id;

  const alarm = await getAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "UNASSIGNED")
    return { success: false, error: "Alarm is not UNASSIGNED." };

  const chainageUsers = await findChainageUsersByChainageId(alarm.chainageId);
  const userIds = chainageUsers.map((c) => c.userId);
  if (userIds.length === 0) return { success: true, rmps: [] };

  const users = await findUsersByIds(userIds);
  const rmps = users.filter((u) => RMP_ROLES.includes(u.role));
  if (rmps.length === 0) return { success: true, rmps: [] };

  const subordinateIds = new Set(
    rmps.filter((u) => u.supervisorId === supervisorId).map((u) => u.id),
  );
  const sorted = [...rmps].sort((a, b) => {
    const aSub = subordinateIds.has(a.id) ? 1 : 0;
    const bSub = subordinateIds.has(b.id) ? 1 : 0;
    if (bSub !== aSub) return bSub - aSub;
    return a.name.localeCompare(b.name);
  });

  return {
    success: true,
    rmps: sorted.map((u) => ({ id: u.id, name: u.name })),
  };
};

/** Supervisor assigns alarm to RMP. Alarm must be UNASSIGNED; RMP must be in alarm chainage. */
export const assignAlarm = async (
  alarmId: string,
  rmpId: string,
): Promise<ActionResult> => {
  const session = await requireRole(SUPERVISOR_ROLES);
  const supervisorId = session.user.id;

  const alarm = await getAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "UNASSIGNED")
    return { success: false, error: "Alarm is not UNASSIGNED." };

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

  await createAssignment({
    alarmId,
    rmpId,
    supervisorId,
    actorId: supervisorId,
    logAction: "ASSIGNED_BY_SUPERVISOR",
  });

  revalidatePath("/supervisor/alarms");
  revalidatePath("/rmp/alarms");
  revalidatePath("/rmp/tasks");
  revalidatePath("/operator/alarms");
  return { success: true };
};
