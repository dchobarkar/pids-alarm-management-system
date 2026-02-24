"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { canCloseAlarm } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function closeAlarm(alarmId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !canCloseAlarm(session.user.role)) {
    return { error: "Unauthorized" };
  }

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
  });

  if (!alarm) return { error: "Alarm not found" };
  if (alarm.status === "CLOSED") return { error: "Alarm is already closed" };

  const previousStatus = alarm.status;

  await prisma.alarm.update({
    where: { id: alarmId },
    data: {
      status: "CLOSED",
      closedById: session.user.id,
      closedAt: new Date(),
    },
  });

  await createAuditLog(
    "ALARM_CLOSED",
    "Alarm",
    alarmId,
    session.user.id,
    { previousStatus, newStatus: "CLOSED" }
  );

  revalidatePath("/dashboard");
  revalidatePath("/alarms");
  revalidatePath(`/alarms/${alarmId}`);
  return { success: true };
}
