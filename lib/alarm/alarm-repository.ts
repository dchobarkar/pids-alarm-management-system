import { AlarmStatus as AlarmStatusEnum } from "@/lib/generated/prisma";
import { prisma } from "@/lib/db";
import type { CreateAlarmInput } from "@/lib/validation/alarm-schema";
import type {
  AlarmWithRelations,
  GetAlarmsFilters,
} from "@/lib/scope/alarm-scope";
import { getScopedAlarms } from "@/lib/scope/alarm-scope";
import type { Prisma } from "@/lib/generated/prisma";

type UserWithChainages = Prisma.UserGetPayload<{
  include: { chainages: { select: { chainageId: true } } };
}>;

/**
 * Find chainage where startKm <= chainageValue <= endKm.
 * Returns null if no matching chainage.
 */
export async function findChainageByValue(chainageValue: number) {
  return prisma.chainage.findFirst({
    where: {
      startKm: { lte: chainageValue },
      endKm: { gte: chainageValue },
    },
  });
}

/**
 * Create alarm: CREATED then immediately UNASSIGNED.
 * Chainage must be resolved from chainageValue (caller should use findChainageByValue first).
 * Creates AlarmLog entry ALARM_CREATED.
 */
export async function createAlarm(
  data: CreateAlarmInput & { chainageId: string; createdById: string },
): Promise<AlarmWithRelations> {
  const { chainageId, createdById, ...rest } = data;

  const alarm = await prisma.alarm.create({
    data: {
      ...rest,
      chainageId,
      createdById,
      status: AlarmStatusEnum.CREATED,
    },
  });

  await prisma.alarm.update({
    where: { id: alarm.id },
    data: { status: AlarmStatusEnum.UNASSIGNED },
  });

  await prisma.alarmLog.create({
    data: {
      alarmId: alarm.id,
      action: "ALARM_CREATED",
      actorId: createdById,
      meta: {
        createdBy: createdById,
        chainageValue: data.chainageValue,
      } as object,
    },
  });

  const created = await getAlarmById(alarm.id);
  if (!created) throw new Error("Alarm not found after create");
  return created;
}

/**
 * Get alarms scoped to user (Operator: all; Supervisor/RMP/ER: by chainage mapping).
 */
export async function getAlarmsByScope(
  user: UserWithChainages,
  filters: GetAlarmsFilters = {},
  options?: { sortNewestFirst?: boolean; rmpStatusFilter?: boolean },
): Promise<AlarmWithRelations[]> {
  return getScopedAlarms(user, filters, options);
}

/**
 * Get single alarm by id. Returns null if not found.
 */
export async function getAlarmById(
  id: string,
): Promise<AlarmWithRelations | null> {
  const alarm = await prisma.alarm.findUnique({
    where: { id },
    include: {
      chainage: true,
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });
  return alarm as AlarmWithRelations | null;
}
