import type { AlarmWithRelations } from "@/types/alarm";
import type { Column } from "@/types/ui";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getSlaInfo } from "@/lib/sla/elapsed";
import {
  STATUS_BADGE_VARIANT,
  CRITICALITY_BADGE_VARIANT,
} from "@/constants/badge-variants";

export interface RmpAlarmsTableActions {
  onSelfAssign: (alarmId: string) => void;
}

/** Table columns for RMP alarms list (alarms in RMP's chainages). Actions = Self Assign when UNASSIGNED. */
export const getRmpAlarmsColumns = (
  actions: RmpAlarmsTableActions,
): Column<AlarmWithRelations>[] => [
  {
    header: "ID",
    accessor: "id",
    render: (r) => r.id.slice(0, 8),
  },
  {
    header: "Chainage",
    accessor: "chainage",
    render: (r) => r.chainage.label,
  },
  {
    header: "Value (km)",
    accessor: "chainageValue",
    render: (r) => r.chainageValue.toFixed(3),
  },
  { header: "Type", accessor: "alarmType" },
  {
    header: "Criticality",
    accessor: "criticality",
    render: (r) => (
      <Badge variant={CRITICALITY_BADGE_VARIANT[r.criticality]}>
        {r.criticality}
      </Badge>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    render: (r) => (
      <Badge variant={STATUS_BADGE_VARIANT[r.status] ?? "created"}>
        {r.status}
      </Badge>
    ),
  },
  {
    header: "Assigned RMP",
    accessor: "assignments",
    render: (r) => (r.assignments?.[0] ? r.assignments[0].rmp.name : "—"),
  },
  {
    header: "Assignment status",
    accessor: "assignments",
    render: (r) => (r.assignments?.[0] ? r.assignments[0].status : "—"),
  },
  {
    header: "Accepted at",
    accessor: "assignments",
    render: (r) =>
      r.assignments?.[0]?.acceptedAt
        ? new Date(r.assignments[0].acceptedAt).toLocaleString()
        : "—",
  },
  {
    header: "SLA",
    accessor: "id",
    key: "sla",
    render: (r) => {
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
      const color =
        sla.status === "breached"
          ? "var(--color-red-500, red)"
          : sla.status === "warning"
            ? "var(--color-amber-500, orange)"
            : "var(--color-green-600, green)";
      return (
        <span title={sla.label} style={{ color }}>
          {sla.label}
        </span>
      );
    },
  },
  {
    header: "Incident time",
    accessor: "incidentTime",
    render: (r) => new Date(r.incidentTime).toLocaleString(),
  },
  {
    header: "Created by",
    accessor: "createdBy",
    render: (r) => r.createdBy.name,
  },
  {
    header: "Actions",
    accessor: "id",
    key: "actions",
    render: (r) =>
      r.status === "UNASSIGNED" ? (
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-(--brand-primary) hover:underline"
          onClick={() => actions.onSelfAssign(r.id)}
        >
          Self Assign
        </Button>
      ) : (
        "—"
      ),
  },
];
