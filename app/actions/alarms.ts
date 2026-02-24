"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { canCreateAlarm } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/library";
import type { Criticality } from "@prisma/client";

const ALARM_TYPES = [
  "TRACK_INTRUSION",
  "DOOR_ALARM",
  "FIRE_ALARM",
  "CCTV_FAULT",
  "POWER_FAULT",
  "OTHER",
];

export async function createAlarm(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !canCreateAlarm(session.user.role)) {
    return { error: "Unauthorized" };
  }

  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);
  const chainage = parseFloat(formData.get("chainage") as string);
  const alarmType = formData.get("alarmType") as string;
  const criticality = formData.get("criticality") as Criticality;
  const incidentTime = formData.get("incidentTime") as string;

  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    isNaN(chainage) ||
    !alarmType ||
    !criticality ||
    !incidentTime
  ) {
    return { error: "Invalid form data" };
  }

  if (!ALARM_TYPES.includes(alarmType)) {
    return { error: "Invalid alarm type" };
  }

  if (!["LOW", "MEDIUM", "HIGH"].includes(criticality)) {
    return { error: "Invalid criticality" };
  }

  const alarm = await prisma.alarm.create({
    data: {
      latitude: new Decimal(latitude),
      longitude: new Decimal(longitude),
      chainage: new Decimal(Number(chainage.toFixed(3))),
      alarmType,
      criticality,
      incidentTime: new Date(incidentTime),
      createdById: session.user.id,
    },
  });

  await createAuditLog(
    "ALARM_CREATED",
    "Alarm",
    alarm.id,
    session.user.id,
    { chainage: Number(chainage), alarmType, criticality }
  );

  revalidatePath("/dashboard");
  revalidatePath("/alarms");
  return { success: true, alarmId: alarm.id };
}
