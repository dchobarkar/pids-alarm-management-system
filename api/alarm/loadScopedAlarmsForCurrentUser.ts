import type {
  AlarmsSearchParams,
  AlarmWithRelations,
  LoadScopedAlarmsOptions,
} from "@/types/alarm";
import { getSession } from "@/lib/auth/get-session";
import { findUserByIdWithChainages } from "@/api/user/user-repository";
import { getAlarmsByScope } from "@/api/alarm/alarm-repository";

export const loadScopedAlarmsForCurrentUser = async (
  searchParams: Promise<AlarmsSearchParams>,
  options: LoadScopedAlarmsOptions = {},
): Promise<{
  user: Awaited<ReturnType<typeof findUserByIdWithChainages>> | null;
  alarms: AlarmWithRelations[];
  params: AlarmsSearchParams;
}> => {
  const session = await getSession();
  const params = await searchParams;

  if (!session?.user?.id) {
    return { user: null, alarms: [], params };
  }

  const user = await findUserByIdWithChainages(session.user.id);

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
