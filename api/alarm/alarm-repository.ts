import {
  AlarmStatus as AlarmStatusEnum,
  AssignmentStatus,
} from "@/lib/generated/prisma";
import type { CreateAlarmInput } from "@/types/validation";
import type { AlarmWithRelations, GetAlarmsFilters } from "@/types/alarm";
import type { UserWithChainages } from "@/types/user";
import { prisma } from "@/api/db";
import { getScopedAlarms } from "@/api/scope/alarm-scope";

/**
 * Find chainage where startKm <= chainageValue <= endKm.
 * Returns null if no matching chainage.
 */
export const findChainageByValue = (chainageValue: number) =>
  prisma.chainage.findFirst({
    where: {
      startKm: { lte: chainageValue },
      endKm: { gte: chainageValue },
    },
  });

/**
 * Create alarm: CREATED then immediately UNASSIGNED.
 * Chainage must be resolved from chainageValue (caller should use findChainageByValue first).
 * Creates AlarmLog entry ALARM_CREATED.
 */
export const createAlarm = async (
  data: CreateAlarmInput & { chainageId: string; createdById: string },
): Promise<AlarmWithRelations> => {
  const { chainageId, createdById, ...rest } = data;

  const alarm = await prisma.alarm.create({
    data: {
      ...rest,
      chainageId,
      createdById,
      status: AlarmStatusEnum.CREATED,
    },
  });

  await prisma.$transaction([
    prisma.alarm.update({
      where: { id: alarm.id },
      data: { status: AlarmStatusEnum.UNASSIGNED },
    }),
    prisma.alarmLog.create({
      data: {
        alarmId: alarm.id,
        action: "ALARM_CREATED",
        actorId: createdById,
        meta: {
          createdBy: createdById,
          chainageValue: data.chainageValue,
        } as object,
      },
    }),
  ]);

  const created = await getAlarmById(alarm.id);
  if (!created) throw new Error("Alarm not found after create");
  return created;
};

/**
 * Get alarms scoped to user (Operator: all; Supervisor/RMP/ER: by chainage mapping).
 */
export const getAlarmsByScope = (
  user: UserWithChainages,
  filters: GetAlarmsFilters = {},
  options?: { sortNewestFirst?: boolean; rmpStatusFilter?: boolean },
): Promise<AlarmWithRelations[]> => getScopedAlarms(user, filters, options);

const activeAssignmentInclude = {
  where: {
    status: { in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED] },
  },
  orderBy: { assignedAt: "desc" as const },
  take: 1,
  include: {
    rmp: { select: { id: true, name: true } },
    supervisor: { select: { id: true, name: true } },
  },
};

/**
 * Get single alarm by id. Returns null if not found. Includes active assignment if any.
 */
export const getAlarmById = async (
  id: string,
): Promise<AlarmWithRelations | null> => {
  const alarm = await prisma.alarm.findUnique({
    where: { id },
    include: {
      chainage: true,
      createdBy: { select: { id: true, name: true, email: true } },
      assignments: activeAssignmentInclude,
    },
  });
  return alarm as AlarmWithRelations | null;
};

/**
 * All alarms with status ESCALATED (for QRV dashboard). No chainage scope.
 */
export const getEscalatedAlarms = async (): Promise<AlarmWithRelations[]> => {
  const alarms = await prisma.alarm.findMany({
    where: { status: "ESCALATED" },
    include: {
      chainage: true,
      createdBy: { select: { id: true, name: true, email: true } },
      assignments: activeAssignmentInclude,
    },
    orderBy: { updatedAt: "desc" },
  });
  return alarms as AlarmWithRelations[];
};

/** Update alarm status and append an alarm log entry in a single transaction. */
export const updateAlarmStatusWithLog = (
  alarmId: string,
  newStatus: AlarmStatusEnum,
  logAction: string,
  actorId: string | null,
  meta?: object,
) =>
  prisma.$transaction([
    prisma.alarm.update({
      where: { id: alarmId },
      data: { status: newStatus },
    }),
    prisma.alarmLog.create({
      data: {
        alarmId,
        action: logAction,
        actorId,
        meta: (meta ?? {}) as object,
      },
    }),
  ]);

/** Create a single alarm log entry (e.g. VERIFICATION_SUBMITTED). */
export const createAlarmLog = (
  alarmId: string,
  action: string,
  actorId: string,
  meta?: object,
) =>
  prisma.alarmLog.create({
    data: {
      alarmId,
      action,
      actorId,
      meta: (meta ?? {}) as object,
    },
  });
