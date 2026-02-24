import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  canViewAllAlarms,
  canViewChainageAlarms,
  canViewOversight,
} from "@/lib/rbac";

type AlarmWithRelations = Awaited<
  ReturnType<
    typeof prisma.alarm.findMany<{
      include: {
        createdBy: { select: { name: true } };
        assignments: { include: { assignee: { select: { name: true } } } };
      };
    }>
  >
>[number];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  let alarms: AlarmWithRelations[] = [];

  if (canViewAllAlarms(session.user.role)) {
    alarms = await prisma.alarm.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { name: true } },
        assignments: {
          include: { assignee: { select: { name: true } } },
        },
      },
    });
  } else if (
    canViewChainageAlarms(session.user.role) ||
    canViewOversight(session.user.role)
  ) {
    alarms = await prisma.alarm.findMany({
      where: {
        chainage: {
          gte: session.user.chainageStart,
          lte: session.user.chainageEnd,
        },
      },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { name: true } },
        assignments: {
          include: { assignee: { select: { name: true } } },
        },
      },
    });
  }

  const stats = {
    total: alarms.length,
    created: alarms.filter((a) => a.status === "CREATED").length,
    assigned: alarms.filter((a) => a.status === "ASSIGNED").length,
    investigation: alarms.filter((a) => a.status === "INVESTIGATION_DONE").length,
    closed: alarms.filter((a) => a.status === "CLOSED").length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Dashboard
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Welcome back, {session.user.name}. Role: {session.user.role}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Created" value={stats.created} color="blue" />
        <StatCard label="Assigned" value={stats.assigned} color="yellow" />
        <StatCard label="Investigation" value={stats.investigation} color="cyan" />
        <StatCard label="Closed" value={stats.closed} color="green" />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
        <div className="border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Recent Alarms
          </h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {alarms.length === 0 ? (
            <div className="px-6 py-12 text-center text-[var(--muted)]">
              No alarms to display
            </div>
          ) : (
            alarms.map((alarm) => (
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
                      {alarm.criticality} • {alarm.status} • by{" "}
                      {alarm.createdBy.name}
                    </p>
                  </div>
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
                </div>
              </Link>
            ))
          )}
        </div>
        {alarms.length > 0 && (
          <div className="border-t border-[var(--border)] px-6 py-3">
            <Link
              href="/alarms"
              className="text-sm font-medium text-[var(--primary)] hover:underline"
            >
              View all alarms →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "default",
}: {
  label: string;
  value: number;
  color?: "default" | "blue" | "yellow" | "cyan" | "green";
}) {
  const colors = {
    default: "border-[var(--border)]",
    blue: "border-blue-500/50 bg-blue-500/5",
    yellow: "border-yellow-500/50 bg-yellow-500/5",
    cyan: "border-cyan-500/50 bg-cyan-500/5",
    green: "border-green-500/50 bg-green-500/5",
  };
  return (
    <div
      className={`rounded-xl border bg-[var(--card)] p-4 ${colors[color]}`}
    >
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
