import Link from "next/link";
import type { AlarmsSearchParams, AlarmWithRelations } from "@/types/alarm";
import { PATHS } from "@/constants/paths";
import { STATUS_BADGE_VARIANT, CRITICALITY_BADGE_VARIANT } from "@/constants/badge-variants";
import DateInput from "@/components/form/DateInput";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { loadScopedAlarmsForCurrentUser } from "@/lib/alarm/loadScopedAlarmsForCurrentUser";
import { getSlaInfo } from "@/lib/sla/elapsed";

const BASE_PATH = PATHS.operatorAlarms;

const OPERATOR_ALARMS_COLUMNS = [
  {
    header: "ID",
    accessor: "id" as const,
    render: (r: AlarmWithRelations) => (
      <Link
        href={`${BASE_PATH}/${r.id}`}
        className="text-(--brand-primary) hover:underline"
      >
        {r.id.slice(0, 8)}
      </Link>
    ),
  },
  {
    header: "Chainage",
    accessor: "chainage" as const,
    render: (r: AlarmWithRelations) => r.chainage.label,
  },
  {
    header: "Value (km)",
    accessor: "chainageValue" as const,
    render: (r: AlarmWithRelations) => r.chainageValue.toFixed(3),
  },
  { header: "Type", accessor: "alarmType" as const },
  {
    header: "Criticality",
    accessor: "criticality" as const,
        render: (r: AlarmWithRelations) => (
          <Badge variant={CRITICALITY_BADGE_VARIANT[r.criticality]}>
        {r.criticality}
      </Badge>
    ),
  },
  {
    header: "Status",
    accessor: "status" as const,
        render: (r: AlarmWithRelations) => (
          <Badge variant={STATUS_BADGE_VARIANT[r.status] ?? "created"}>{r.status}</Badge>
        ),
  },
  {
    header: "Assigned RMP",
    accessor: "assignments" as const,
    render: (r: AlarmWithRelations) => {
      const a = r.assignments?.[0];
      return a ? a.rmp.name : "—";
    },
  },
  {
    header: "Assignment status",
    accessor: "assignments" as const,
    render: (r: AlarmWithRelations) => {
      const a = r.assignments?.[0];
      return a ? a.status : "—";
    },
  },
  {
    header: "Accepted at",
    accessor: "assignments" as const,
    render: (r: AlarmWithRelations) => {
      const a = r.assignments?.[0];
      return a?.acceptedAt ? new Date(a.acceptedAt).toLocaleString() : "—";
    },
  },
  {
    header: "SLA",
    accessor: "id" as const,
    render: (r: AlarmWithRelations) => {
      const sla = getSlaInfo(
        r.status as "UNASSIGNED" | "ASSIGNED" | "IN_PROGRESS",
        r.createdAt,
        r.assignments?.[0]
          ? {
              assignedAt: r.assignments[0].assignedAt,
              acceptedAt: r.assignments[0].acceptedAt,
            }
          : null,
      );
      if (!sla) return "—";
      return (
        <span
          title={sla.label}
          style={{
            color:
              sla.status === "breached"
                ? "var(--color-red-500, red)"
                : sla.status === "warning"
                  ? "var(--color-amber-500, orange)"
                  : "var(--color-green-600, green)",
          }}
        >
          {sla.label}
        </span>
      );
    },
  },
  {
    header: "Incident time",
    accessor: "incidentTime" as const,
    render: (r: AlarmWithRelations) =>
      new Date(r.incidentTime).toLocaleString(),
  },
  {
    header: "Created by",
    accessor: "createdBy" as const,
    render: (r: AlarmWithRelations) => r.createdBy.name,
  },
];

function buildFilterUrl(
  params: AlarmsSearchParams,
  overrides: Partial<AlarmsSearchParams>,
): string {
  const p = { ...params, ...overrides };
  const s = new URLSearchParams();
  (Object.entries(p) as [keyof AlarmsSearchParams, string][]).forEach(
    ([k, v]) => {
      if (v) s.set(k, v);
    },
  );
  const qs = s.toString();
  return qs ? `${BASE_PATH}?${qs}` : BASE_PATH;
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<AlarmsSearchParams>;
}) => {
  const { user, alarms, params } =
    await loadScopedAlarmsForCurrentUser(searchParams);

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumb
          crumbs={[
            { label: "Operator", href: "/operator" },
            { label: "Alarms" },
          ]}
        />

        <Link href={PATHS.operatorAlarmsCreate}>
          <Button>Create alarm</Button>
        </Link>
      </div>

      <Card>
        <div className="space-y-5">
          <div className="rounded-lg border border-(--border-default) bg-(--bg-elevated) p-4">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-(--text-muted)">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={buildFilterUrl(params, {
                      status: "",
                      criticality: "",
                    })}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                      !params.status && !params.criticality
                        ? "bg-(--brand-primary) text-white"
                        : "bg-(--bg-surface) text-(--text-secondary) hover:bg-(--border-default) hover:text-(--text-primary)",
                    )}
                  >
                    All
                  </Link>
                  {(
                    ["UNASSIGNED", "ASSIGNED", "ESCALATED", "CLOSED"] as const
                  ).map((status) => (
                    <Link
                      key={status}
                      href={buildFilterUrl(params, { status })}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                        params.status === status
                          ? "bg-(--brand-primary) text-white"
                          : "bg-(--bg-surface) text-(--text-secondary) hover:bg-(--border-default) hover:text-(--text-primary)",
                      )}
                    >
                      {status}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-(--text-muted)">
                  Criticality
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map(
                    (criticality) => (
                      <Link
                        key={criticality}
                        href={buildFilterUrl(params, { criticality })}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                          params.criticality === criticality
                            ? "bg-(--brand-primary) text-white"
                            : "bg-(--bg-surface) text-(--text-secondary) hover:bg-(--border-default) hover:text-(--text-primary)",
                        )}
                      >
                        {criticality}
                      </Link>
                    ),
                  )}
                </div>
              </div>

              <form
                method="get"
                action={BASE_PATH}
                className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4"
              >
                <input
                  type="hidden"
                  name="status"
                  value={params.status ?? ""}
                />
                <input
                  type="hidden"
                  name="criticality"
                  value={params.criticality ?? ""}
                />
                <div className="min-w-0 md:flex-1">
                  <DateInput
                    label="From date"
                    name="dateFrom"
                    defaultValue={params.dateFrom}
                  />
                </div>
                <div className="min-w-0 md:flex-1">
                  <DateInput
                    label="To date"
                    name="dateTo"
                    defaultValue={params.dateTo}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="shrink-0 w-full md:w-auto"
                >
                  Apply dates
                </Button>
              </form>
            </div>
          </div>

          {alarms.length === 0 ? (
            <p className="py-4 mt-4 text-(--text-muted)">
              No alarms match the filters.
            </p>
          ) : (
            <Table data={alarms} columns={OPERATOR_ALARMS_COLUMNS} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Page;
