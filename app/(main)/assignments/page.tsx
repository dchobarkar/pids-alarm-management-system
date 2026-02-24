import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { canAssignToOthers, canSelfAssign } from "@/lib/rbac";

type AlarmWithAssignments = Awaited<
  ReturnType<
    typeof prisma.alarm.findMany<{
      include: {
        createdBy: { select: { name: true } };
        assignments: { include: { assignee: { select: { name: true } } } };
      };
    }>
  >
>[number];

export default async function AssignmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  let alarms: AlarmWithAssignments[] = [];

  if (canAssignToOthers(session.user.role) || canSelfAssign(session.user.role)) {
    alarms = await prisma.alarm.findMany({
      where: {
        status: { in: ["CREATED", "ASSIGNED"] },
        chainage: {
          gte: session.user.chainageStart,
          lte: session.user.chainageEnd,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { name: true } },
        assignments: {
          include: { assignee: { select: { name: true } } },
        },
      },
    });
  }

  const unassigned = alarms.filter((a) => a.assignments.length === 0);
  const assigned = alarms.filter((a) => a.assignments.length > 0);
  const myAssigned = assigned.filter((a) =>
    a.assignments.some((asn) => asn.assignedTo === session.user.id)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Assignments
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          {canSelfAssign(session.user.role)
            ? "Alarms in your chainage - assign to yourself or view assigned"
            : "Manage alarm assignments in your chainage"}
        </p>
      </div>

      {canSelfAssign(session.user.role) && myAssigned.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-6 py-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              My Assigned Alarms
            </h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {myAssigned.map((alarm) => (
              <Link
                key={alarm.id}
                href={`/alarms/${alarm.id}`}
                className="block px-6 py-4 hover:bg-[var(--secondary)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {alarm.alarmType} @ {Number(alarm.chainage).toFixed(3)} km
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {alarm.criticality} • Submit report to complete
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--primary)]/20 px-3 py-1 text-sm font-medium text-[var(--primary)]">
                    Assigned to you
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {unassigned.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] px-6 py-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Available to Assign
            </h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {unassigned.map((alarm) => (
              <Link
                key={alarm.id}
                href={`/alarms/${alarm.id}`}
                className="block px-6 py-4 hover:bg-[var(--secondary)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {alarm.alarmType} @ {Number(alarm.chainage).toFixed(3)} km
                    </p>
                    <p className="text-sm text-[var(--muted)]">
                      {alarm.criticality} • Created by {alarm.createdBy.name}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--accent)]/20 px-3 py-1 text-sm font-medium text-[var(--accent)]">
                    Unassigned
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {alarms.length === 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center text-[var(--muted)]">
          No alarms in your chainage to assign
        </div>
      )}
    </div>
  );
}
