"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/role-guard";
import { getAlarmById } from "@/api/alarm/alarm.repository";
import {
  findActiveAssignmentForAlarm,
  completeAssignment,
} from "@/api/assignment/assignment.repository";
import { createVerification } from "@/api/verification/verification.service";
import { createEvidence } from "@/api/evidence/evidence.repository";
import { createAlarmLog } from "@/api/alarm/alarm.repository";
import {
  calculateDistanceMeters,
  isWithinGeoRadius,
} from "@/lib/geo/calculate-distance";
import { uploadEvidenceFile } from "@/api/evidence/upload-file";
import { isAllowedEvidenceMimeType } from "@/lib/validation/evidence";

import type { ActionResult } from "@/types/actions";
import { RMP_ROLES } from "@/constants/roles";
import { MAX_EVIDENCE_FILES } from "@/constants/evidence";

/** RMP submits verification: geo, distance, remarks, evidence. Alarm status unchanged; operator reviews. */
export const submitVerification = async (
  alarmId: string,
  formData: FormData,
): Promise<ActionResult> => {
  const session = await requireRole(RMP_ROLES);
  const rmpId = session.user.id;

  const assignment = await findActiveAssignmentForAlarm(alarmId);
  if (!assignment || assignment.rmpId !== rmpId) {
    return {
      success: false,
      error: "You are not the assigned RMP for this alarm.",
    };
  }

  const alarm = await getAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "IN_PROGRESS") {
    return {
      success: false,
      error: "Alarm must be IN_PROGRESS to submit verification.",
    };
  }
  if (
    alarm.latitude == null ||
    alarm.longitude == null ||
    !Number.isFinite(alarm.latitude) ||
    !Number.isFinite(alarm.longitude)
  ) {
    return {
      success: false,
      error:
        "Alarm has no valid coordinates; cannot compute verification distance.",
    };
  }

  const latRaw = formData.get("latitude");
  const lonRaw = formData.get("longitude");
  const latitude = latRaw != null ? Number(latRaw) : NaN;
  const longitude = lonRaw != null ? Number(lonRaw) : NaN;
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return {
      success: false,
      error: "Location is required (capture from device).",
    };
  }

  const remarks = (formData.get("remarks") as string) || null;

  const distance = calculateDistanceMeters(
    { latitude: alarm.latitude, longitude: alarm.longitude },
    { latitude, longitude },
  );
  const geoMismatch = !isWithinGeoRadius(distance);

  const verification = await createVerification({
    alarmId,
    verifiedById: rmpId,
    latitude,
    longitude,
    distance,
    geoMismatch,
    remarks,
  });

  const files = formData.getAll("evidence") as File[];
  const validFiles = files.filter(
    (f) => f.size > 0 && isAllowedEvidenceMimeType(f.type),
  );
  if (validFiles.length > MAX_EVIDENCE_FILES) {
    return {
      success: false,
      error: `Maximum ${MAX_EVIDENCE_FILES} evidence files allowed.`,
    };
  }

  for (const file of validFiles) {
    const { url, fileType } = await uploadEvidenceFile(alarmId, file);
    await createEvidence({
      alarmId,
      uploadedById: rmpId,
      fileUrl: url,
      fileType,
    });
  }

  await createAlarmLog(alarmId, "VERIFICATION_SUBMITTED", rmpId, {
    distance,
    verifiedBy: rmpId,
    verificationId: verification.id,
    geoMismatch,
  });

  await completeAssignment(assignment.id);

  revalidatePath("/rmp/tasks");
  revalidatePath(`/rmp/tasks/${alarmId}/verify`);
  revalidatePath("/operator/reviews");
  return { success: true };
};
