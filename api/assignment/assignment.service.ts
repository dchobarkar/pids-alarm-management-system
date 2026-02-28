import type { AssignmentWithRmp } from "@/types/assignment";

import { prisma } from "@/api/db";
import { assertTransition } from "@/lib/alarm-state-machine/transitions";
import { assertAlarmNotClosed } from "@/lib/alarm-state-machine/guards";
import { updateAlarmStatusWithLog } from "@/api/alarm/alarm.service";
import {
  createAssignment as createAssignmentRepo,
  findAssignmentById,
  updateAssignmentAccepted,
  completeAssignment as completeAssignmentRepo,
} from "@/api/assignment/assignment.repository";
import {
  findAlarmById,
  updateAlarmStatus,
  createAlarmLog,
} from "@/api/alarm/alarm.repository";

/**
 * Create assignment, set alarm to ASSIGNED, and log.
 * Caller must ensure: alarm is UNASSIGNED, RMP is in alarm chainage, supervisor (if any) is valid.
 */
export const createAssignment = async (params: {
  alarmId: string;
  rmpId: string;
  supervisorId: string | null;
  actorId: string;
  logAction: "ASSIGNED_BY_SUPERVISOR" | "SELF_ASSIGNED";
}): Promise<AssignmentWithRmp> => {
  const alarm = await findAlarmById(params.alarmId);
  if (!alarm) throw new Error("Alarm not found");
  assertAlarmNotClosed(alarm.status);
  assertTransition(alarm.status, "ASSIGNED");

  const assignment = await createAssignmentRepo({
    alarmId: params.alarmId,
    rmpId: params.rmpId,
    supervisorId: params.supervisorId,
  });

  await updateAlarmStatusWithLog(
    params.alarmId,
    "ASSIGNED",
    params.logAction,
    params.actorId,
    {
      assignedTo: params.rmpId,
      assignedBy: params.supervisorId ?? undefined,
    },
  );

  return assignment as AssignmentWithRmp;
};

/**
 * Accept assignment: set status ACCEPTED, acceptedAt, and alarm to IN_PROGRESS.
 * Returns result for caller to handle (e.g. Server Action).
 */
export const acceptAssignment = async (
  assignmentId: string,
  rmpId: string,
): Promise<{ success: true } | { success: false; error: string }> => {
  const assignment = await findAssignmentById(assignmentId);
  if (!assignment) return { success: false, error: "Assignment not found." };
  if (assignment.rmpId !== rmpId)
    return { success: false, error: "You do not own this assignment." };
  if (assignment.status !== "PENDING")
    return { success: false, error: "Assignment is not pending." };

  assertAlarmNotClosed(assignment.alarm.status);
  assertTransition(assignment.alarm.status, "IN_PROGRESS");

  await prisma.$transaction([
    updateAssignmentAccepted(assignmentId),
    updateAlarmStatus(assignment.alarmId, "IN_PROGRESS"),
    createAlarmLog(assignment.alarmId, "ASSIGNMENT_ACCEPTED", rmpId, {
      assignedTo: rmpId,
      assignmentId,
    }),
  ]);

  return { success: true };
};

/** QRV Supervisor reassigns an ESCALATED alarm. Creates new assignment, status → ASSIGNED, log ALARM_REASSIGNED. */
export const createReassignment = async (params: {
  alarmId: string;
  rmpId: string;
  actorId: string;
}): Promise<AssignmentWithRmp> => {
  const alarm = await findAlarmById(params.alarmId);
  if (!alarm) throw new Error("Alarm not found");
  assertAlarmNotClosed(alarm.status);
  assertTransition(alarm.status, "ASSIGNED");

  const assignment = await createAssignmentRepo({
    alarmId: params.alarmId,
    rmpId: params.rmpId,
    supervisorId: params.actorId,
  });

  await updateAlarmStatusWithLog(
    params.alarmId,
    "ASSIGNED",
    "ALARM_REASSIGNED",
    params.actorId,
    { assignedTo: params.rmpId, assignedBy: params.actorId },
  );

  return assignment as AssignmentWithRmp;
};

/** Mark assignment as COMPLETED (e.g. after RMP submits verification). */
export const completeAssignment = (assignmentId: string) =>
  completeAssignmentRepo(assignmentId);
