import type { AssignmentWithAlarm } from "@/types/assignment";
import type { Column } from "@/types/ui";
import Badge from "@/components/ui/Badge";

/** Table columns for supervisor assignments list (who is assigned to which task). */
export const getSupervisorAssignmentsColumns =
  (): Column<AssignmentWithAlarm>[] => [
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
      header: "Alarm status",
      accessor: "alarm",
      key: "alarmStatus",
      render: (r) => r.alarm.status,
    },
    {
      header: "RMP",
      accessor: "rmp",
      render: (r) => r.rmp.name,
    },
    {
      header: "Assigned by",
      accessor: "supervisor",
      render: (r) => (r.supervisor ? r.supervisor.name : "—"),
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
  ];
