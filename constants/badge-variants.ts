/** Alarm status → badge variant (created, assigned, investigating, done, closed). */
export const STATUS_BADGE_VARIANT: Record<
  string,
  "created" | "assigned" | "investigating" | "done" | "closed"
> = {
  CREATED: "created",
  UNASSIGNED: "created",
  ASSIGNED: "assigned",
  IN_PROGRESS: "investigating",
  VERIFIED: "done",
  FALSE_ALARM: "closed",
  ESCALATED: "investigating",
  CLOSED: "closed",
};

/** Criticality → badge variant (low, medium, high, critical). */
export const CRITICALITY_BADGE_VARIANT = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
  CRITICAL: "critical" as const,
};
