import type {
  AlarmsSearchParams,
  AlarmWithRelations,
  LoadScopedAlarmsOptions,
} from "@/types/alarm";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/get-session";
import { getAlarmsByScope } from "@/lib/alarm/alarm-repository";

export const loadScopedAlarmsForCurrentUser = async (
  searchParams: Promise<AlarmsSearchParams>,
  options: LoadScopedAlarmsOptions = {},
): Promise<{
  user:
    | (Awaited<ReturnType<typeof prisma.user.findUniqueOrThrow>> & {
        chainages: { chainageId: string }[];
      })
    | null;
  alarms: AlarmWithRelations[];
  params: AlarmsSearchParams;
}> => {
  const session = await getSession();
  const params = await searchParams;

  if (!session?.user?.id) {
    return { user: null, alarms: [], params };
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: { chainages: { select: { chainageId: true } } },
  });

  const filters = {
    status: params.status as
      | "CREATED"
      | "UNASSIGNED"
      | "ASSIGNED"
      | "IN_PROGRESS"
      | "VERIFIED"
      | "FALSE_ALARM"
      | "ESCALATED"
      | "CLOSED"
      | undefined,
    criticality: params.criticality as
      | "LOW"
      | "MEDIUM"
      | "HIGH"
      | "CRITICAL"
      | undefined,
    dateFrom: params.dateFrom ? new Date(params.dateFrom) : undefined,
    dateTo: params.dateTo ? new Date(params.dateTo) : undefined,
  };

  const alarms = await getAlarmsByScope(
    user,
    filters,
    options.rmpStatusFilter ? { rmpStatusFilter: true } : undefined,
  );

  return { user, alarms, params };
};
