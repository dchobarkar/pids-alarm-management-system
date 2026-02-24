"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { canAssignToOthers, canSelfAssign } from "@/lib/rbac";
import { isAlarmInUserChainage } from "@/lib/chainage";
import { revalidatePath } from "next/cache";

export async function assignAlarmToSelf(alarmId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !canSelfAssign(session.user.role)) {
    return { error: "Unauthorized" };
  }

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    include: { assignments: true },
  });

  if (!alarm) return { error: "Alarm not found" };
  if (alarm.status === "CLOSED") return { error: "Alarm is already closed" };
  if (alarm.assignments.length > 0) return { error: "Alarm already assigned" };

  const inChainage = isAlarmInUserChainage(
    Number(alarm.chainage),
    session.user.chainageStart,
    session.user.chainageEnd
  );
  if (!inChainage) return { error: "Alarm not in your chainage" };

  await prisma.$transaction([
    prisma.alarmAssignment.create({
      data: {
        alarmId,
        assignedTo: session.user.id,
        assignedBy: session.user.id,
      },
    }),
    prisma.alarm.update({
      where: { id: alarmId },
      data: { status: "ASSIGNED" },
    }),
  ]);

  await createAuditLog(
    "ALARM_ASSIGNED",
    "Alarm",
    alarmId,
    session.user.id,
    { assignedTo: session.user.id, selfAssign: true }
  );

  revalidatePath("/dashboard");
  revalidatePath("/alarms");
  revalidatePath(`/alarms/${alarmId}`);
  revalidatePath("/assignments");
  return { success: true };
}

export async function assignAlarmToUser(alarmId: string, assigneeId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !canAssignToOthers(session.user.role)) {
    return { error: "Unauthorized" };
  }

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    include: { assignments: true },
  });

  if (!alarm) return { error: "Alarm not found" };
  if (alarm.status === "CLOSED") return { error: "Alarm is already closed" };
  if (alarm.assignments.length > 0) return { error: "Alarm already assigned" };

  const inChainage = isAlarmInUserChainage(
    Number(alarm.chainage),
    session.user.chainageStart,
    session.user.chainageEnd
  );
  if (!inChainage) return { error: "Alarm not in your chainage" };

  const assignee = await prisma.user.findUnique({
    where: { id: assigneeId },
  });
  if (!assignee || !["RMP", "ER"].includes(assignee.role)) {
    return { error: "Invalid assignee" };
  }

  await prisma.$transaction([
    prisma.alarmAssignment.create({
      data: {
        alarmId,
        assignedTo: assigneeId,
        assignedBy: session.user.id,
      },
    }),
    prisma.alarm.update({
      where: { id: alarmId },
      data: { status: "ASSIGNED" },
    }),
  ]);

  await createAuditLog(
    "ALARM_ASSIGNED",
    "Alarm",
    alarmId,
    session.user.id,
    { assignedTo: assigneeId }
  );

  revalidatePath("/dashboard");
  revalidatePath("/alarms");
  revalidatePath(`/alarms/${alarmId}`);
  revalidatePath("/assignments");
  return { success: true };
}
