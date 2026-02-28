import type { AssignmentWithAlarm } from "@/types/assignment";
import { AssignmentStatus } from "@/lib/generated/prisma";
import { prisma } from "@/api/db";

export const createAssignment = (data: {
  alarmId: string;
  rmpId: string;
  supervisorId: string | null;
}) =>
  prisma.alarmAssignment.create({
    data: {
      ...data,
      status: AssignmentStatus.PENDING,
    },
    include: {
      rmp: { select: { id: true, name: true } },
      supervisor: { select: { id: true, name: true } },
    },
  });

export const findAssignmentsByAlarm = (alarmId: string) =>
  prisma.alarmAssignment.findMany({
    where: { alarmId },
    orderBy: { assignedAt: "desc" },
    include: {
      rmp: { select: { id: true, name: true } },
      supervisor: { select: { id: true, name: true } },
    },
  });

export const findActiveAssignmentForAlarm = (alarmId: string) =>
  prisma.alarmAssignment.findFirst({
    where: { alarmId, status: AssignmentStatus.ACCEPTED },
    orderBy: { acceptedAt: "desc" },
  });

export const findAssignmentById = (assignmentId: string) =>
  prisma.alarmAssignment.findUnique({
    where: { id: assignmentId },
    include: { alarm: { select: { id: true, status: true } } },
  });

export const findRmpAssignments = async (
  rmpId: string,
): Promise<AssignmentWithAlarm[]> => {
  const list = await prisma.alarmAssignment.findMany({
    where: {
      rmpId,
      status: { in: [AssignmentStatus.PENDING, AssignmentStatus.ACCEPTED] },
    },
    orderBy: { assignedAt: "desc" },
    include: {
      alarm: { include: { chainage: true } },
      rmp: { select: { id: true, name: true } },
      supervisor: { select: { id: true, name: true } },
    },
  });
  return list as AssignmentWithAlarm[];
};

export const updateAssignmentAccepted = (assignmentId: string) =>
  prisma.alarmAssignment.update({
    where: { id: assignmentId },
    data: {
      status: AssignmentStatus.ACCEPTED,
      acceptedAt: new Date(),
    },
  });

export const completeAssignment = (assignmentId: string) =>
  prisma.alarmAssignment.update({
    where: { id: assignmentId },
    data: {
      status: AssignmentStatus.COMPLETED,
      completedAt: new Date(),
    },
  });
