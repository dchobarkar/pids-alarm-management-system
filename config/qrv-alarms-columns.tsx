import type { AlarmWithRelations } from "@/types/alarm";
import type { Column } from "@/types/ui";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  STATUS_BADGE_VARIANT,
  CRITICALITY_BADGE_VARIANT,
} from "@/constants/badge-variants";

export interface QrvAlarmsTableActions {
  onReassign: (alarm: AlarmWithRelations) => void;
}

/** Table columns for QRV escalated alarms list. */
export const getQrvAlarmsColumns = (
  actions: QrvAlarmsTableActions,
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
    header: "Incident time",
    accessor: "incidentTime",
    render: (r) => new Date(r.incidentTime).toLocaleString(),
  },
  {
    header: "Actions",
    accessor: "id",
    key: "actions",
    render: (r) => (
      <Button
        type="button"
        variant="ghost"
        className="text-sm text-(--brand-primary) hover:underline"
        onClick={() => actions.onReassign(r)}
      >
        Reassign
      </Button>
    ),
  },
];
