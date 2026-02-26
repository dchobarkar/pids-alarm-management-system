import type { AlarmStatus } from "@/lib/generated/prisma";
import type { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/db";
import { Role } from "@/lib/generated/prisma";
import { AssignmentStatus } from "@/lib/generated/prisma";

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

export type AlarmWithRelations = Prisma.AlarmGetPayload<{
  include: {
    chainage: true;
    createdBy: { select: { id: true; name: true; email: true } };
    assignments: typeof activeAssignmentInclude;
  };
}>;

export type GetAlarmsFilters = {
  status?: AlarmStatus;
  criticality?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dateFrom?: Date;
  dateTo?: Date;
};

type UserWithChainages = Prisma.UserGetPayload<{
  include: { chainages: { select: { chainageId: true } } };
}>;

/**
 * Returns Prisma where clause for alarms visible to the given user.
 * OPERATOR: all alarms.
 * SUPERVISOR / RMP / ER: only alarms in user's mapped chainages.
 */
function getScopeWhere(user: UserWithChainages): Prisma.AlarmWhereInput {
  if (user.role === Role.OPERATOR) {
    return {};
  }
  const chainageIds = user.chainages.map((c) => c.chainageId);
  return { chainageId: { in: chainageIds } };
}

/**
 * Fetch alarms scoped to the current user's role and chainage mapping.
 * OPERATOR: all alarms.
 * SUPERVISOR / RMP / ER: only alarms where chainageId is in user's chainages.
 * For RMP: optionally filter by status UNASSIGNED | ASSIGNED (future-ready).
 */
export async function getScopedAlarms(
  user: UserWithChainages,
  filters: GetAlarmsFilters = {},
  options: { sortNewestFirst?: boolean; rmpStatusFilter?: boolean } = {},
): Promise<AlarmWithRelations[]> {
  const where: Prisma.AlarmWhereInput = getScopeWhere(user);

  if (filters.status) where.status = filters.status;
  if (filters.criticality) where.criticality = filters.criticality;
  if (filters.dateFrom || filters.dateTo) {
    where.incidentTime = {};
    if (filters.dateFrom) where.incidentTime.gte = filters.dateFrom;
    if (filters.dateTo) where.incidentTime.lte = filters.dateTo;
  }

  if (
    options.rmpStatusFilter &&
    (user.role === Role.RMP || user.role === Role.ER)
  ) {
    where.status = { in: ["UNASSIGNED", "ASSIGNED"] };
  }

  const alarms = await prisma.alarm.findMany({
    where,
    include: {
      chainage: true,
      createdBy: { select: { id: true, name: true, email: true } },
      assignments: activeAssignmentInclude,
    },
    orderBy:
      options.sortNewestFirst !== false ? { createdAt: "desc" } : undefined,
  });

  return alarms as AlarmWithRelations[];
}
