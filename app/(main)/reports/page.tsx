import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  canViewAllAlarms,
  canViewChainageAlarms,
  canSubmitReport,
} from "@/lib/rbac";
import type { Prisma } from "@prisma/client";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  let where: Prisma.FieldReportWhereInput = {};

  if (canViewAllAlarms(session.user.role)) {
    // Operator sees all reports
  } else if (canViewChainageAlarms(session.user.role)) {
    where = {
      alarm: {
        chainage: {
          gte: session.user.chainageStart,
          lte: session.user.chainageEnd,
        },
      },
    };
  } else if (canSubmitReport(session.user.role)) {
    where = { userId: session.user.id };
  } else {
    where = { id: "none" };
  }

  const reports = await prisma.fieldReport.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      alarm: {
        select: {
          id: true,
          alarmType: true,
          chainage: true,
          status: true,
          criticality: true,
        },
      },
      user: { select: { name: true } },
      media: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Field Reports
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Investigation reports submitted by RMP/ER
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
                  Alarm
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
                  Reported By
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
                  Remark
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
                  Date
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)]">
                    No reports yet
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-[var(--secondary)]/50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/alarms/${report.alarm.id}`}
                        className="font-medium text-[var(--primary)] hover:underline"
                      >
                        {report.alarm.alarmType} @{" "}
                        {Number(report.alarm.chainage).toFixed(3)} km
                      </Link>
                      <p className="text-sm text-[var(--muted)]">
                        {report.alarm.status}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {report.user.name}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {report.remark}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--muted)]">
                      {new Date(report.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/alarms/${report.alarm.id}`}
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
