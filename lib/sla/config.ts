import type { AlarmStatus } from "@/lib/generated/prisma";
import {
  SLA_UNASSIGNED_MINUTES,
  SLA_ASSIGNED_MINUTES,
  SLA_IN_PROGRESS_MINUTES,
} from "@/constants/sla";

/** SLA limits per alarm status (minutes). Breach triggers auto-escalation. */
export const SLA_MINUTES: Record<AlarmStatus, number | null> = {
  CREATED: null,
  UNASSIGNED: SLA_UNASSIGNED_MINUTES,
  ASSIGNED: SLA_ASSIGNED_MINUTES,
  IN_PROGRESS: SLA_IN_PROGRESS_MINUTES,
  VERIFIED: null,
  FALSE_ALARM: null,
  ESCALATED: null,
  CLOSED: null,
};
