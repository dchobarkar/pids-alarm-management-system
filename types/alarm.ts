import type { AlarmStatus, Prisma } from "@/lib/generated/prisma";

/** Alarm with chainage, createdBy, and active assignment (PENDING/ACCEPTED) included. Used for list/detail views. */
export type AlarmWithRelations = Prisma.AlarmGetPayload<{
  include: {
    chainage: true;
    createdBy: { select: { id: true; name: true; email: true } };
    assignments: {
      where: { status: { in: ["PENDING", "ACCEPTED"] } };
      orderBy: { assignedAt: "desc" };
      take: 1;
      include: {
        rmp: { select: { id: true; name: true } };
        supervisor: { select: { id: true; name: true } };
      };
    };
  };
}>;

/** Filters for querying alarms (status, criticality, date range). Used by getScopedAlarms / getAlarmsByScope. */
export type GetAlarmsFilters = {
  status?: AlarmStatus;
  criticality?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dateFrom?: Date;
  dateTo?: Date;
};

/** URL/search params for alarm list pages. String values (e.g. from searchParams). */
export type AlarmsSearchParams = {
  status?: string;
  criticality?: string;
  dateFrom?: string;
  dateTo?: string;
};

/** Options when loading scoped alarms (e.g. RMP status filter for UNASSIGNED | ASSIGNED). */
export type LoadScopedAlarmsOptions = {
  rmpStatusFilter?: boolean;
};
