"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import { prisma } from "@/lib/db";
import { createReassignment } from "@/lib/assignment/assignment-repository";

const RMP_ROLES = [Role.RMP, Role.ER] as const;

export type ReassignAlarmResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Get RMPs that can be assigned to this escalated alarm (same chainage).
 */
export async function getRmpOptionsForEscalatedAlarm(
  alarmId: string,
): Promise<
  | { success: true; rmps: { id: string; name: string }[] }
  | { success: false; error: string }
> {
  await requireRole(Role.QRV_SUPERVISOR);

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    select: { chainageId: true, status: true },
  });
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "ESCALATED")
    return { success: false, error: "Alarm is not ESCALATED." };

  const chainageUserIds = await prisma.chainageUser.findMany({
    where: { chainageId: alarm.chainageId },
    select: { userId: true },
  });
  const userIds = chainageUserIds.map((c) => c.userId);
  if (userIds.length === 0) return { success: true, rmps: [] };

  const users = await prisma.user.findMany({
    where: {
      id: { in: userIds },
      role: { in: [...RMP_ROLES] },
    },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return {
    success: true,
    rmps: users.map((u) => ({ id: u.id, name: u.name })),
  };
}

/**
 * QRV Supervisor reassigns escalated alarm to RMP.
 */
export async function reassignEscalatedAlarm(
  alarmId: string,
  rmpId: string,
): Promise<ReassignAlarmResult> {
  const session = await requireRole(Role.QRV_SUPERVISOR);

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    include: { chainage: true },
  });
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "ESCALATED")
    return { success: false, error: "Alarm is not ESCALATED." };

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
  if (
    !rmpUser ||
    !RMP_ROLES.includes(rmpUser.role as (typeof RMP_ROLES)[number])
  )
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
}
