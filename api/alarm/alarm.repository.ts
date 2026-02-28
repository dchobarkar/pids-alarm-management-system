import { AlarmStatus, AssignmentStatus } from "@/lib/generated/prisma";
import type { CreateAlarmInput } from "@/types/validation";
import type { AlarmWithRelations } from "@/types/alarm";
import { prisma } from "@/api/db";

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

/** Create alarm with status CREATED (no log). Caller typically then updates to UNASSIGNED and creates log. */
export const createAlarm = (
  data: CreateAlarmInput & { chainageId: string; createdById: string },
) =>
  prisma.alarm.create({
    data: {
      latitude: data.latitude,
      longitude: data.longitude,
      chainageValue: data.chainageValue,
      alarmType: data.alarmType,
      criticality: data.criticality,
      incidentTime: data.incidentTime,
      chainageId: data.chainageId,
      createdById: data.createdById,
      status: AlarmStatus.CREATED,
    },
  });

/** Get single alarm by id. Returns null if not found. Includes active assignment if any. */
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

/** Find alarm by id (minimal, for status checks). */
export const findAlarmById = (id: string) =>
  prisma.alarm.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

/** Alarms with status UNASSIGNED, ASSIGNED, or IN_PROGRESS (for SLA check). Includes latest assignment. */
export const findActiveAlarmsForSlaCheck = () =>
  prisma.alarm.findMany({
    where: {
      status: { in: ["UNASSIGNED", "ASSIGNED", "IN_PROGRESS"] },
    },
    include: {
      assignments: {
        where: {
          status: { in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED] },
        },
        orderBy: { assignedAt: "desc" },
        take: 1,
      },
    },
  });

/** All alarms with status ESCALATED (for QRV dashboard). No chainage scope. */
export const findEscalatedAlarms = async (): Promise<AlarmWithRelations[]> => {
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

/** Update alarm status only. */
export const updateAlarmStatus = (alarmId: string, newStatus: AlarmStatus) =>
  prisma.alarm.update({
    where: { id: alarmId },
    data: { status: newStatus },
  });

/** Create a single alarm log entry. */
export const createAlarmLog = (
  alarmId: string,
  action: string,
  actorId: string | null,
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
