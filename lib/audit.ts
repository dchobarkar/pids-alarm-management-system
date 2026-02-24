import { prisma } from "./db";

export type AuditAction =
  | "ALARM_CREATED"
  | "ALARM_ASSIGNED"
  | "ALARM_INVESTIGATION_DONE"
  | "ALARM_CLOSED"
  | "REPORT_SUBMITTED"
  | "USER_CREATED"
  | "USER_UPDATED";

export async function createAuditLog(
  action: AuditAction,
  entityType: string,
  entityId: string,
  performedBy: string,
  metadata?: Record<string, unknown>
) {
  await prisma.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      performedBy,
      metadata: metadata ? (metadata as object) : undefined,
    },
  });
}
