"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";
import { canSubmitReport } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { Decimal } from "@prisma/client/runtime/library";

export async function submitFieldReport(
  alarmId: string,
  remark: string,
  geoLat?: number,
  geoLng?: number,
  photoUrls: string[] = []
) {
  const session = await getServerSession(authOptions);
  if (!session || !canSubmitReport(session.user.role)) {
    return { error: "Unauthorized" };
  }

  const alarm = await prisma.alarm.findUnique({
    where: { id: alarmId },
    include: { assignments: true },
  });

  if (!alarm) return { error: "Alarm not found" };

  const isAssignedToMe = alarm.assignments.some(
    (a) => a.assignedTo === session.user.id
  );
  if (!isAssignedToMe) {
    return { error: "You must be assigned to this alarm to submit a report" };
  }

  const report = await prisma.fieldReport.create({
    data: {
      alarmId,
      userId: session.user.id,
      remark,
      geoLat: geoLat != null ? new Decimal(geoLat) : undefined,
      geoLng: geoLng != null ? new Decimal(geoLng) : undefined,
      media:
        photoUrls.length > 0
          ? {
              create: photoUrls.map((fileUrl) => ({ fileUrl })),
            }
          : undefined,
    },
  });

  await prisma.alarm.update({
    where: { id: alarmId },
    data: { status: "INVESTIGATION_DONE" },
  });

  await createAuditLog(
    "REPORT_SUBMITTED",
    "FieldReport",
    report.id,
    session.user.id,
    { alarmId }
  );

  revalidatePath("/dashboard");
  revalidatePath("/alarms");
  revalidatePath(`/alarms/${alarmId}`);
  revalidatePath("/reports");
  return { success: true, reportId: report.id };
}
