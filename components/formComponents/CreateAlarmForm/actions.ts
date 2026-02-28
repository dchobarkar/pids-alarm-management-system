"use server";

import { revalidatePath } from "next/cache";
import type { ActionResultWithData } from "@/types/actions";
import { requireRole } from "@/lib/auth/role-guard";
import { Role } from "@/lib/generated/prisma";
import { createAlarmSchema } from "@/lib/validation/alarm-schema";
import { createAlarmAndSetUnassigned } from "@/api/alarm/alarm.service";

export async function createAlarm(
  formData: FormData,
): Promise<ActionResultWithData<{ alarmId: string }>> {
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
  let alarm;
  try {
    alarm = await createAlarmAndSetUnassigned({ ...data, createdById: userId });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create alarm.";
    if (msg.includes("No chainage"))
      return {
        success: false,
        error: `No chainage found for value ${data.chainageValue} km. Ensure the value falls within an existing chainage range (startKm–endKm).`,
      };
    return { success: false, error: msg };
  }

  revalidatePath("/operator/alarms");
  revalidatePath("/supervisor/alarms");
  revalidatePath("/rmp/alarms");
  return { success: true, alarmId: alarm.id };
}
