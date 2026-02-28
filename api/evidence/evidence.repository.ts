import { prisma } from "@/api/db";

/** Create an evidence record linking an uploaded file to an alarm and uploader. */
export const createEvidence = (data: {
  alarmId: string;
  uploadedById: string;
  fileUrl: string;
  fileType: string;
}) =>
  prisma.evidence.create({
    data: {
      alarmId: data.alarmId,
      uploadedById: data.uploadedById,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
    },
  });

/** List evidence for an alarm (e.g. operator alarm detail page). */
export const findEvidenceByAlarmId = (alarmId: string) =>
  prisma.evidence.findMany({
    where: { alarmId },
    orderBy: { uploadedAt: "desc" },
  });
