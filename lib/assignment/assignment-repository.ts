import { AssignmentStatus } from "@/lib/generated/prisma";
import { prisma } from "@/lib/db";
import { assertTransition } from "@/lib/alarm-state-machine/transitions";
import type { Prisma } from "@/lib/generated/prisma";

export type AssignmentWithAlarm = Prisma.AlarmAssignmentGetPayload<{
  include: {
    alarm: { include: { chainage: true } };
    rmp: { select: { id: true; name: true } };
    supervisor: { select: { id: true; name: true } | null };
  };
}>;

export type AssignmentWithRmp = Prisma.AlarmAssignmentGetPayload<{
  include: {
    rmp: { select: { id: true; name: true } };
    supervisor: { select: { id: true; name: true } | null };
  };
}>;

/**
 * Create assignment record, set alarm status to ASSIGNED, and log.
 * Caller must ensure: alarm is UNASSIGNED, RMP is in alarm chainage, supervisor (if any) is valid.
 */
export async function createAssignment(params: {
  alarmId: string;
  rmpId: string;
  supervisorId: string | null;
  actorId: string;
  logAction: "ASSIGNED_BY_SUPERVISOR" | "SELF_ASSIGNED";
}): Promise<AssignmentWithRmp> {
  const alarm = await prisma.alarm.findUniqueOrThrow({
    where: { id: params.alarmId },
    select: { status: true },
  });
  assertTransition(alarm.status, "ASSIGNED");

  const assignment = await prisma.alarmAssignment.create({
    data: {
      alarmId: params.alarmId,
      rmpId: params.rmpId,
      supervisorId: params.supervisorId,
      status: AssignmentStatus.PENDING,
    },
    include: {
      rmp: { select: { id: true, name: true } },
      supervisor: { select: { id: true, name: true } },
    },
  });

  await prisma.alarm.update({
    where: { id: params.alarmId },
    data: { status: "ASSIGNED" },
  });

  await prisma.alarmLog.create({
    data: {
      alarmId: params.alarmId,
      action: params.logAction,
      actorId: params.actorId,
      meta: {
        assignedTo: params.rmpId,
        assignedBy: params.supervisorId ?? undefined,
      } as object,
    },
  });

  return assignment as AssignmentWithRmp;
}

/**
 * All assignments for an alarm (for history/display).
 */
export async function getAssignmentsByAlarm(alarmId: string) {
  return prisma.alarmAssignment.findMany({
    where: { alarmId },
    orderBy: { assignedAt: "desc" },
    include: {
      rmp: { select: { id: true, name: true } },
      supervisor: { select: { id: true, name: true } },
    },
  });
}

/**
 * Active assignment for an alarm (ACCEPTED), if any. Used to verify RMP ownership for verification.
 */
export async function getActiveAssignmentForAlarm(alarmId: string) {
  return prisma.alarmAssignment.findFirst({
    where: { alarmId, status: AssignmentStatus.ACCEPTED },
    orderBy: { acceptedAt: "desc" },
  });
}

/**
 * Assignments for an RMP (for /rmp/tasks). PENDING and ACCEPTED.
 */
export async function getRmpAssignments(
  rmpId: string,
): Promise<AssignmentWithAlarm[]> {
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
}

/**
 * Accept assignment: set status ACCEPTED, acceptedAt, and alarm to IN_PROGRESS.
 * Caller must ensure assignment belongs to current RMP and status is PENDING.
 */
export async function acceptAssignment(
  assignmentId: string,
  rmpId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const assignment = await prisma.alarmAssignment.findUnique({
    where: { id: assignmentId },
    include: { alarm: { select: { id: true, status: true } } },
  });

  if (!assignment) return { success: false, error: "Assignment not found." };
  if (assignment.rmpId !== rmpId)
    return { success: false, error: "You do not own this assignment." };
  if (assignment.status !== AssignmentStatus.PENDING)
    return { success: false, error: "Assignment is not pending." };

  assertTransition(assignment.alarm.status, "IN_PROGRESS");

  await prisma.$transaction([
    prisma.alarmAssignment.update({
      where: { id: assignmentId },
      data: {
        status: AssignmentStatus.ACCEPTED,
        acceptedAt: new Date(),
      },
    }),
    prisma.alarm.update({
      where: { id: assignment.alarmId },
      data: { status: "IN_PROGRESS" },
    }),
    prisma.alarmLog.create({
      data: {
        alarmId: assignment.alarmId,
        action: "ASSIGNMENT_ACCEPTED",
        actorId: rmpId,
        meta: {
          assignedTo: rmpId,
          assignmentId,
        } as object,
      },
    }),
  ]);

  return { success: true };
}
