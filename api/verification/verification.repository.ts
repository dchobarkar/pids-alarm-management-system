import type { AlarmPendingReview } from "@/types/verification";
import { prisma } from "@/api/db";

/** Create verification record. Does not check alarm status. */
export const createVerification = (params: {
  alarmId: string;
  verifiedById: string;
  latitude: number;
  longitude: number;
  distance: number;
  geoMismatch: boolean;
  remarks?: string | null;
}) =>
  prisma.verification.create({
    data: {
      alarmId: params.alarmId,
      verifiedById: params.verifiedById,
      latitude: params.latitude,
      longitude: params.longitude,
      distance: params.distance,
      geoMismatch: params.geoMismatch,
      remarks: params.remarks ?? null,
    },
    include: {
      verifiedBy: { select: { id: true, name: true } },
    },
  });

export const findVerificationsByAlarm = (alarmId: string) =>
  prisma.verification.findMany({
    where: { alarmId },
    orderBy: { verifiedAt: "desc" },
    include: {
      verifiedBy: { select: { id: true, name: true } },
    },
  });

/** Alarms with status IN_PROGRESS that have at least one verification (for operator review queue). */
export const findAlarmsPendingReview = async (): Promise<
  AlarmPendingReview[]
> => {
  const alarms = await prisma.alarm.findMany({
    where: {
      status: "IN_PROGRESS",
      verifications: { some: {} },
    },
    include: {
      chainage: true,
      createdBy: { select: { id: true, name: true } },
      verifications: {
        orderBy: { verifiedAt: "desc" },
        take: 1,
        include: { verifiedBy: { select: { id: true, name: true } } },
      },
      evidences: true,
    },
  });
  return alarms as AlarmPendingReview[];
};
