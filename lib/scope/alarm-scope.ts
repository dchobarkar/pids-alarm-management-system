import type { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/db";
import { Role } from "@/lib/generated/prisma";
import { AssignmentStatus } from "@/lib/generated/prisma";
import { RMP_ROLES } from "@/constants/roles";
import type { AlarmWithRelations, GetAlarmsFilters } from "@/types/alarm";
import type { UserWithChainages } from "@/types/user";

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
 * Returns Prisma where clause for alarms visible to the given user.
 * OPERATOR: all alarms.
 * SUPERVISOR / RMP / ER: only alarms in user's mapped chainages.
 */
const getScopeWhere = (user: UserWithChainages): Prisma.AlarmWhereInput =>
  user.role === Role.OPERATOR
    ? {}
    : { chainageId: { in: user.chainages.map((c) => c.chainageId) } };

/**
 * Fetch alarms scoped to the current user's role and chainage mapping.
 * OPERATOR: all alarms.
 * SUPERVISOR / RMP / ER: only alarms where chainageId is in user's chainages.
 * For RMP: optionally filter by status UNASSIGNED | ASSIGNED (future-ready).
 */
export const getScopedAlarms = async (
  user: UserWithChainages,
  filters: GetAlarmsFilters = {},
  options: { sortNewestFirst?: boolean; rmpStatusFilter?: boolean } = {},
): Promise<AlarmWithRelations[]> => {
  const where: Prisma.AlarmWhereInput = { ...getScopeWhere(user) };

  if (filters.status) where.status = filters.status;
  if (filters.criticality) where.criticality = filters.criticality;
  if (filters.dateFrom ?? filters.dateTo) {
    where.incidentTime = {};
    if (filters.dateFrom) where.incidentTime.gte = filters.dateFrom;
    if (filters.dateTo) where.incidentTime.lte = filters.dateTo;
  }

  if (options.rmpStatusFilter && RMP_ROLES.includes(user.role)) {
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
};
