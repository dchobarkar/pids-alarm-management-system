import { AlarmStatus } from "@/lib/generated/prisma";
import type { CreateAlarmInput } from "@/types/validation";
import type { AlarmWithRelations, GetAlarmsFilters } from "@/types/alarm";
import type { UserWithChainages } from "@/types/user";

import { assertTransition } from "@/lib/alarm-state-machine/transitions";
import { prisma } from "@/api/db";
import { findChainageByValue } from "@/api/chainage/chainage.repository";
import { getScopedAlarms } from "@/api/scope/alarm-scope";
import {
  createAlarm as createAlarmRepo,
  getAlarmById,
  findAlarmById,
  updateAlarmStatus,
  createAlarmLog,
} from "@/api/alarm/alarm.repository";

/**
 * Create alarm: resolve chainage, insert CREATED, then set UNASSIGNED and log ALARM_CREATED.
 */
export const createAlarmAndSetUnassigned = async (
  data: CreateAlarmInput & { createdById: string },
): Promise<AlarmWithRelations> => {
  const chainage = await findChainageByValue(data.chainageValue);
  if (!chainage) throw new Error("No chainage found for chainage value.");

  const alarm = await createAlarmRepo({
    ...data,
    chainageId: chainage.id,
    createdById: data.createdById,
  });

  await prisma.$transaction([
    updateAlarmStatus(alarm.id, AlarmStatus.UNASSIGNED),
    createAlarmLog(alarm.id, "ALARM_CREATED", data.createdById, {
      createdBy: data.createdById,
      chainageValue: data.chainageValue,
    }),
  ]);

  const created = await getAlarmById(alarm.id);
  if (!created) throw new Error("Alarm not found after create");
  return created;
};

/** Get alarms scoped to user (Operator: all; Supervisor/RMP/ER: by chainage mapping). */
export const getAlarmsByScope = (
  user: UserWithChainages,
  filters: GetAlarmsFilters = {},
  options?: { sortNewestFirst?: boolean; rmpStatusFilter?: boolean },
): Promise<AlarmWithRelations[]> =>
  getScopedAlarms(user, filters, options ?? {});

/** Update alarm status and append an alarm log entry in a single transaction. */
export const updateAlarmStatusWithLog = (
  alarmId: string,
  newStatus: AlarmStatus,
  logAction: string,
  actorId: string | null,
  meta?: object,
) =>
  prisma.$transaction([
    updateAlarmStatus(alarmId, newStatus),
    createAlarmLog(alarmId, logAction, actorId, meta),
  ]);

/**
 * Operator closes alarm. Allowed only when status is VERIFIED or FALSE_ALARM.
 * Does not revalidate paths; caller (e.g. Server Action) should do that.
 */
export const closeAlarm = async (
  alarmId: string,
  operatorId: string,
): Promise<{ success: true } | { success: false; error: string }> => {
  const alarm = await findAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  if (alarm.status !== "VERIFIED" && alarm.status !== "FALSE_ALARM") {
    return {
      success: false,
      error: "Alarm can only be closed when VERIFIED or FALSE_ALARM.",
    };
  }
  assertTransition(alarm.status, "CLOSED");

  await updateAlarmStatusWithLog(
    alarmId,
    "CLOSED",
    "ALARM_CLOSED",
    operatorId,
    { closedBy: operatorId },
  );
  return { success: true };
};

/** Operator marks alarm as VERIFIED (IN_PROGRESS → VERIFIED). Caller handles auth and revalidatePath. */
export const markVerified = async (
  alarmId: string,
  operatorId: string,
): Promise<{ success: true } | { success: false; error: string }> => {
  const alarm = await getAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  assertTransition(alarm.status, "VERIFIED");
  await updateAlarmStatusWithLog(
    alarmId,
    "VERIFIED",
    "ALARM_VERIFIED",
    operatorId,
    { verifiedBy: operatorId },
  );
  return { success: true };
};

/** Operator marks alarm as FALSE_ALARM (IN_PROGRESS → FALSE_ALARM). Caller handles auth and revalidatePath. */
export const markFalseAlarm = async (
  alarmId: string,
  operatorId: string,
): Promise<{ success: true } | { success: false; error: string }> => {
  const alarm = await getAlarmById(alarmId);
  if (!alarm) return { success: false, error: "Alarm not found." };
  assertTransition(alarm.status, "FALSE_ALARM");
  await updateAlarmStatusWithLog(
    alarmId,
    "FALSE_ALARM",
    "ALARM_MARKED_FALSE",
    operatorId,
    { markedBy: operatorId },
  );
  return { success: true };
};
