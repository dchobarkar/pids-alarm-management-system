"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/role-guard";
import { Role, AssignmentStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/db";
import { getActiveAssignmentForAlarm } from "@/lib/assignment/assignment-repository";
import { createVerification } from "@/lib/verification/verification-repository";
import {
  calculateDistanceMeters,
  isWithinGeoRadius,
} from "@/lib/geo/calculate-distance";
import {
  uploadEvidenceFile,
  isAllowedEvidenceType,
} from "@/lib/evidence/upload-file";

import type { SubmitVerificationResult } from "@/types/actions";

const RMP_ROLES: Role[] = [Role.RMP, Role.ER];
const MAX_EVIDENCE_FILES = 5;

export type { SubmitVerificationResult } from "@/types/actions";

/**
 * RMP submits verification: geo, distance, remarks, evidence. Alarm status unchanged; operator reviews.
 */
export async function submitVerification(
  alarmId: string,
  formData: FormData,
): Promise<SubmitVerificationResult> {
  const session = await requireRole(RMP_ROLES);
  const rmpId = session.user.id;

  const assignment = await getActiveAssignmentForAlarm(alarmId);
  if (!assignment || assignment.rmpId !== rmpId) {
    return {
      success: false,
      error: "You are not the assigned RMP for this alarm.",
    };
  }

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    select: { status: true, latitude: true, longitude: true },
  });
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
      error: "Alarm has no valid coordinates; cannot compute verification distance.",
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
    (f) => f.size > 0 && isAllowedEvidenceType(f.type),
  );
  if (validFiles.length > MAX_EVIDENCE_FILES) {
    return {
      success: false,
      error: `Maximum ${MAX_EVIDENCE_FILES} evidence files allowed.`,
    };
  }

  for (const file of validFiles) {
    const { url, fileType } = await uploadEvidenceFile(alarmId, file);
    await prisma.evidence.create({
      data: {
        alarmId,
        uploadedById: rmpId,
        fileUrl: url,
        fileType,
      },
    });
  }

  await prisma.alarmLog.create({
    data: {
      alarmId,
      action: "VERIFICATION_SUBMITTED",
      actorId: rmpId,
      meta: {
        distance,
        verifiedBy: rmpId,
        verificationId: verification.id,
        geoMismatch,
      } as object,
    },
  });

  await prisma.alarmAssignment.update({
    where: { id: assignment.id },
    data: {
      status: AssignmentStatus.COMPLETED,
      completedAt: new Date(),
    },
  });

  revalidatePath("/rmp/tasks");
  revalidatePath(`/rmp/tasks/${alarmId}/verify`);
  revalidatePath("/operator/reviews");
  return { success: true };
}

