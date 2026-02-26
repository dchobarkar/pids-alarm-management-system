"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import { createAlarmSchema } from "@/lib/validation/alarm-schema";
import {
  createAlarm as repoCreateAlarm,
  findChainageByValue,
} from "@/lib/alarm/alarm-repository";

export type CreateAlarmResult =
  | { success: true; alarmId: string }
  | { success: false; error: string };

export async function createAlarm(
  formData: FormData,
): Promise<CreateAlarmResult> {
  const session = await requireRole(Role.OPERATOR);
  const userId = session.user.id;

  const raw = {
    latitude:
      formData.get("latitude") != null ? Number(formData.get("latitude")) : NaN,
    longitude:
      formData.get("longitude") != null
        ? Number(formData.get("longitude"))
        : NaN,
    chainageValue:
      formData.get("chainageValue") != null
        ? Number(formData.get("chainageValue"))
        : NaN,
    alarmType: formData.get("alarmType"),
    criticality: formData.get("criticality"),
    incidentTime: formData.get("incidentTime"),
  };

  const parsed = createAlarmSchema.safeParse({
    latitude: raw.latitude,
    longitude: raw.longitude,
    chainageValue: raw.chainageValue,
    alarmType: raw.alarmType,
    criticality: raw.criticality,
    incidentTime: raw.incidentTime
      ? new Date(String(raw.incidentTime))
      : undefined,
  });

  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg = Object.values(first).flat().join(" ") || "Validation failed.";
    return { success: false, error: msg };
  }

  const data = parsed.data;
  const chainage = await findChainageByValue(data.chainageValue);
  if (!chainage) {
    return {
      success: false,
      error: `No chainage found for value ${data.chainageValue} km. Ensure the value falls within an existing chainage range (startKm–endKm).`,
    };
  }

  const alarm = await repoCreateAlarm({
    ...data,
    chainageId: chainage.id,
    createdById: userId,
  });

  revalidatePath("/operator/alarms");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/rmp/alarms");
  return { success: true, alarmId: alarm.id };
}
