"use server";

import { revalidatePath } from "next/cache";

import { RMP_ROLES, SUPERVISOR_ROLES } from "@/constants/roles";
import { requireRole } from "@/lib/auth/role-guard";
import { prisma } from "@/api/db";
import { createAssignment } from "@/api/assignment";

import type { ActionResult } from "@/types/actions";

/**
 * Get RMPs that can be assigned to this alarm (same chainage). Subordinates first.
 */
export async function getRmpOptionsForAlarm(
  alarmId: string,
): Promise<
  | { success: true; rmps: { id: string; name: string }[] }
  | { success: false; error: string }
> {
  const session = await requireRole(SUPERVISOR_ROLES);
  const supervisorId = session.user.id;

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    select: { chainageId: true, status: true },
  });
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "UNASSIGNED")
    return { success: false, error: "Alarm is not UNASSIGNED." };

  const chainageUserIds = await prisma.chainageUser.findMany({
    where: { chainageId: alarm.chainageId },
    select: { userId: true },
  });
  const userIds = chainageUserIds.map((c) => c.userId);
  if (userIds.length === 0) return { success: true, rmps: [] };

  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
      role: { in: RMP_ROLES },
    },
    select: { id: true, name: true, supervisorId: true },
    orderBy: [{ supervisorId: "asc" }, { name: "asc" }],
  });

  const subordinateIds = new Set(
    users.filter((u) => u.supervisorId === supervisorId).map((u) => u.id),
  );
  const sorted = [...users].sort((a, b) => {
    const aSub = subordinateIds.has(a.id) ? 1 : 0;
    const bSub = subordinateIds.has(b.id) ? 1 : 0;
    if (bSub !== aSub) return bSub - aSub;
    return a.name.localeCompare(b.name);
  });

  return {
    success: true,
    rmps: sorted.map((u) => ({ id: u.id, name: u.name })),
  };
}

/**
 * Supervisor assigns alarm to RMP. Alarm must be UNASSIGNED; RMP must be in alarm chainage.
 */
export async function assignAlarm(
  alarmId: string,
  rmpId: string,
): Promise<ActionResult> {
  const session = await requireRole(SUPERVISOR_ROLES);
  const supervisorId = session.user.id;

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    include: { chainage: true },
  });
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "UNASSIGNED")
    return { success: false, error: "Alarm is not UNASSIGNED." };

  const rmpInChainage = await prisma.chainageUser.findFirst({
    where: { chainageId: alarm.chainageId, userId: rmpId },
  });
  if (!rmpInChainage)
    return {
      success: false,
      error: "RMP is not mapped to this alarm's chainage.",
    };

  const rmpUser = await prisma.user.findUnique({
    where: { id: rmpId },
    select: { role: true },
  });
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
}
