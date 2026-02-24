import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  canViewAllAlarms,
  canViewChainageAlarms,
  canViewOversight,
} from "@/lib/rbac";
import { AlarmsFilters } from "./AlarmsFilters";
import type { Prisma } from "@prisma/client";

export default async function AlarmsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; criticality?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const params = await searchParams;
  const statusFilter = params.status;
  const criticalityFilter = params.criticality;

  let where: Prisma.AlarmWhereInput = {};

  if (canViewAllAlarms(session.user.role)) {
    // Operator sees all
  } else if (
    canViewChainageAlarms(session.user.role) ||
    canViewOversight(session.user.role)
  ) {
    where = {
      chainage: {
        gte: session.user.chainageStart,
        lte: session.user.chainageEnd,
      },
    };
  } else {
    where = { id: "none" }; // No access
  }

  if (statusFilter) {
    where.status = statusFilter as "CREATED" | "ASSIGNED" | "INVESTIGATION_DONE" | "CLOSED";
  }
  if (criticalityFilter) {
    where.criticality = criticalityFilter as "LOW" | "MEDIUM" | "HIGH";
  }

  const alarms = await prisma.alarm.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { name: true } },
      assignments: {
        include: { assignee: { select: { name: true } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Alarms</h1>
        <p className="mt-1 text-[var(--muted)]">
          {canViewAllAlarms(session.user.role)
            ? "All alarms in the system"
            : "Alarms in your chainage"}
        </p>
      </div>

      <AlarmsFilters
        currentStatus={statusFilter}
        currentCriticality={criticalityFilter}
      />

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
                  Type / Chainage
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
                  Criticality
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
                  Assigned To
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
                  Created
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {alarms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[var(--muted)]">
                    No alarms found
                  </td>
                </tr>
              ) : (
                alarms.map((alarm) => (
                  <tr key={alarm.id} className="hover:bg-[var(--secondary)]/50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/alarms/${alarm.id}`}
                        className="font-medium text-[var(--primary)] hover:underline"
                      >
                        {alarm.alarmType} @ {Number(alarm.chainage).toFixed(3)} km
                      </Link>
                      <p className="text-sm text-[var(--muted)]">
                        by {alarm.createdBy.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          alarm.criticality === "HIGH"
                            ? "bg-red-500/20 text-red-400"
                            : alarm.criticality === "MEDIUM"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {alarm.criticality}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{alarm.status}</td>
                    <td className="px-6 py-4 text-sm">
                      {alarm.assignments[0]?.assignee.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--muted)]">
                      {new Date(alarm.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/alarms/${alarm.id}`}
                        className="text-sm font-medium text-[var(--primary)] hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
