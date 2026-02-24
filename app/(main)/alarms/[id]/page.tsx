import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  canViewAllAlarms,
  canViewChainageAlarms,
  canViewOversight,
  canSelfAssign,
  canAssignToOthers,
  canCloseAlarm,
  canSubmitReport,
} from "@/lib/rbac";
import { getUsersForChainage, isAlarmInUserChainage } from "@/lib/chainage";
import { AssignAlarmButton } from "./AssignAlarmButton";
import { CloseAlarmButton } from "./CloseAlarmButton";
import { ReportForm } from "./ReportForm";

export default async function AlarmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { id } = await params;
  const alarm = await prisma.alarm.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true, email: true } },
      closedBy: { select: { name: true } },
      assignments: {
        include: { assignee: { select: { name: true, email: true } }, assigner: { select: { name: true } } },
      },
      fieldReports: {
        include: {
          user: { select: { name: true } },
          media: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!alarm) notFound();

  const canView =
    canViewAllAlarms(session.user.role) ||
    canViewOversight(session.user.role) ||
    (canViewChainageAlarms(session.user.role) &&
      isAlarmInUserChainage(
        Number(alarm.chainage),
        session.user.chainageStart,
        session.user.chainageEnd
      ));

  if (!canView) notFound();

  const isAssignedToMe = alarm.assignments.some(
    (a) => a.assignedTo === session.user.id
  );
  const canAssign =
    alarm.status !== "CLOSED" &&
    alarm.assignments.length === 0 &&
    (canSelfAssign(session.user.role) || canAssignToOthers(session.user.role)) &&
    isAlarmInUserChainage(
      Number(alarm.chainage),
      session.user.chainageStart,
      session.user.chainageEnd
    );

  let assignableUsers: Awaited<ReturnType<typeof getUsersForChainage>> = [];
  if (canAssignToOthers(session.user.role) && alarm.assignments.length === 0) {
    assignableUsers = await getUsersForChainage(Number(alarm.chainage));
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/alarms"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ← Back to alarms
        </Link>
        <div className="mt-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {alarm.alarmType} @ {Number(alarm.chainage).toFixed(3)} km
            </h1>
            <p className="mt-1 text-[var(--muted)]">
              Created by {alarm.createdBy.name} on{" "}
              {new Date(alarm.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                alarm.criticality === "HIGH"
                  ? "bg-red-500/20 text-red-400"
                  : alarm.criticality === "MEDIUM"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {alarm.criticality}
            </span>
            <span className="rounded-full bg-[var(--muted)] px-3 py-1 text-sm font-medium">
              {alarm.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
            Details
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-[var(--muted)]">Latitude / Longitude</dt>
              <dd className="text-[var(--foreground)]">
                {Number(alarm.latitude).toFixed(6)}, {Number(alarm.longitude).toFixed(6)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-[var(--muted)]">Incident Time</dt>
              <dd className="text-[var(--foreground)]">
                {new Date(alarm.incidentTime).toLocaleString()}
              </dd>
            </div>
            {alarm.assignments[0] && (
              <div>
                <dt className="text-sm text-[var(--muted)]">Assigned To</dt>
                <dd className="text-[var(--foreground)]">
                  {alarm.assignments[0].assignee.name} (assigned by{" "}
                  {alarm.assignments[0].assigner.name})
                </dd>
              </div>
            )}
            {alarm.closedBy && alarm.closedAt && (
              <div>
                <dt className="text-sm text-[var(--muted)]">Closed</dt>
                <dd className="text-[var(--foreground)]">
                  By {alarm.closedBy.name} on{" "}
                  {new Date(alarm.closedAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>

          {canAssign && (
            <div className="mt-6 space-y-2">
              {canSelfAssign(session.user.role) && (
                <AssignAlarmButton alarmId={alarm.id} />
              )}
              {canAssignToOthers(session.user.role) && assignableUsers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    Or assign to:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {assignableUsers
                      .filter((u) => u.role === "RMP" || u.role === "ER")
                      .map((user) => (
                        <AssignAlarmButton
                          key={user.id}
                          alarmId={alarm.id}
                          assigneeId={user.id}
                          assigneeName={user.name}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {canCloseAlarm(session.user.role) &&
            alarm.status !== "CLOSED" &&
            alarm.status === "INVESTIGATION_DONE" && (
              <div className="mt-6">
                <CloseAlarmButton alarmId={alarm.id} />
              </div>
            )}
        </div>

        <div className="space-y-6">
          {canSubmitReport(session.user.role) &&
            isAssignedToMe &&
            alarm.status !== "CLOSED" && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
                  Submit Field Report
                </h2>
                <ReportForm alarmId={alarm.id} />
              </div>
            )}

          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Field Reports
            </h2>
            {alarm.fieldReports.length === 0 ? (
              <p className="text-[var(--muted)]">No reports yet</p>
            ) : (
              <div className="space-y-4">
                {alarm.fieldReports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] p-4"
                  >
                    <p className="text-sm text-[var(--muted)]">
                      {report.user.name} •{" "}
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-[var(--foreground)]">{report.remark}</p>
                    {(report.geoLat || report.geoLng) && (
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Geo: {Number(report.geoLat).toFixed(5)},{" "}
                        {Number(report.geoLng).toFixed(5)}
                      </p>
                    )}
                    {report.media.length > 0 && (
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {report.media.map((m) => (
                          <a
                            key={m.id}
                            href={m.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[var(--primary)] hover:underline"
                          >
                            View photo
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
