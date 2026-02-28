import Link from "next/link";

import type { AssignmentWithAlarm } from "@/types/assignment";
import type { Column } from "@/types/ui";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export interface RmpTasksTableActions {
  onViewDetails: (assignment: AssignmentWithAlarm) => void;
  onAccept: (assignmentId: string) => void;
}

/** Table columns for RMP tasks (assignments) list. */
export const getRmpTasksColumns = (
  actions: RmpTasksTableActions,
): Column<AssignmentWithAlarm>[] => [
  {
    header: "Alarm ID",
    accessor: "id",
    render: (r) => r.alarm.id.slice(0, 8),
  },
  {
    header: "Chainage",
    accessor: "alarm",
    render: (r) => r.alarm.chainage.label,
  },
  {
    header: "Value (km)",
    accessor: "alarm",
    key: "value",
    render: (r) => r.alarm.chainageValue.toFixed(3),
  },
  {
    header: "Assignment status",
    accessor: "status",
    render: (r) => (
      <Badge variant={r.status === "ACCEPTED" ? "done" : "created"}>
        {r.status}
      </Badge>
    ),
  },
  {
    header: "Assigned at",
    accessor: "assignedAt",
    render: (r) => new Date(r.assignedAt).toLocaleString(),
  },
  {
    header: "Accepted at",
    accessor: "acceptedAt",
    render: (r) =>
      r.acceptedAt ? new Date(r.acceptedAt).toLocaleString() : "—",
  },
  {
    header: "Actions",
    accessor: "id",
    key: "actions",
    render: (r) => (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          className="text-sm text-(--text-secondary) hover:text-(--brand-primary) hover:underline"
          onClick={() => actions.onViewDetails(r)}
        >
          View details
        </Button>
        {r.status === "PENDING" && (
          <Button
            type="button"
            variant="ghost"
            className="text-sm text-(--brand-primary) hover:underline"
            onClick={() => actions.onAccept(r.id)}
          >
            Accept Task
          </Button>
        )}
        {r.status === "ACCEPTED" && r.alarm.status === "IN_PROGRESS" && (
          <Link
            href={`/rmp/tasks/${r.alarm.id}/verify`}
            className="text-sm text-(--brand-primary) hover:underline"
          >
            Verify
          </Link>
        )}
      </div>
    ),
  },
];
