import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma";
import { assertAlarmNotClosed } from "@/lib/alarm-state-machine/guards";

export type VerificationWithVerifier = Prisma.VerificationGetPayload<{
  include: {
    verifiedBy: { select: { id: true; name: true } };
  };
}>;

export type AlarmPendingReview = Prisma.AlarmGetPayload<{
  include: {
    chainage: true;
    createdBy: { select: { id: true; name: true } };
    verifications: {
      orderBy: { verifiedAt: "desc" };
      take: 1;
      include: { verifiedBy: { select: { id: true; name: true } } };
    };
    evidences: true;
  };
}>;

export const createVerification = async (params: {
  alarmId: string;
  verifiedById: string;
  latitude: number;
  longitude: number;
  distance: number;
  geoMismatch: boolean;
  remarks?: string | null;
}): Promise<VerificationWithVerifier> => {
  const alarm = await prisma.alarm.findUnique({
    where: { id: params.alarmId },
    select: { status: true },
  });
  if (alarm) assertAlarmNotClosed(alarm.status);

  const v = await prisma.verification.create({
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
  return v as VerificationWithVerifier;
};

export const getVerificationsByAlarm = (alarmId: string) =>
  prisma.verification.findMany({
    where: { alarmId },
    orderBy: { verifiedAt: "desc" },
    include: {
      verifiedBy: { select: { id: true, name: true } },
    },
  });

/**
 * Alarms with status IN_PROGRESS that have at least one verification (for operator review queue).
 */
export const getAlarmsPendingReview = async (): Promise<
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
