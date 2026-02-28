import type { Prisma } from "@/lib/generated/prisma";

/** Alarm assignment with alarm (and chainage), RMP, and supervisor included. Used for RMP task list and assignment history. */
export type AssignmentWithAlarm = Prisma.AlarmAssignmentGetPayload<{
  include: {
    alarm: { include: { chainage: true } };
    rmp: { select: { id: true; name: true } };
    supervisor: { select: { id: true; name: true } | null };
  };
}>;

/** Alarm assignment with RMP and supervisor only (no alarm). Used when creating/accepting an assignment. */
export type AssignmentWithRmp = Prisma.AlarmAssignmentGetPayload<{
  include: {
    rmp: { select: { id: true; name: true } };
    supervisor: { select: { id: true; name: true } | null };
  };
}>;
