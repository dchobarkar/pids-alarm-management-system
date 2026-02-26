"use client";

import { useRouter } from "next/navigation";

import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import { acceptAssignment } from "./actions";
import type { AssignmentWithAlarm } from "@/lib/assignment/assignment-repository";

interface Props {
  assignments: AssignmentWithAlarm[];
}

const RmpTasksClient = ({ assignments }: Props) => {
  const router = useRouter();

  const handleAccept = async (assignmentId: string) => {
    const result = await acceptAssignment(assignmentId);
    if (result.success) router.refresh();
    else alert(result.error);
  };

  const columns = [
    {
      header: "Alarm ID",
      accessor: "id" as const,
      render: (r: AssignmentWithAlarm) => r.alarm.id.slice(0, 8),
    },
    {
      header: "Chainage",
      accessor: "alarm" as const,
      render: (r: AssignmentWithAlarm) => r.alarm.chainage.label,
    },
    {
      header: "Value (km)",
      accessor: "alarm" as const,
      render: (r: AssignmentWithAlarm) => r.alarm.chainageValue.toFixed(3),
    },
    {
      header: "Assignment status",
      accessor: "status" as const,
      render: (r: AssignmentWithAlarm) => (
        <Badge variant={r.status === "ACCEPTED" ? "done" : "created"}>
          {r.status}
        </Badge>
      ),
    },
    {
      header: "Assigned at",
      accessor: "assignedAt" as const,
      render: (r: AssignmentWithAlarm) =>
        new Date(r.assignedAt).toLocaleString(),
    },
    {
      header: "Accepted at",
      accessor: "acceptedAt" as const,
      render: (r: AssignmentWithAlarm) =>
        r.acceptedAt ? new Date(r.acceptedAt).toLocaleString() : "—",
    },
    {
      header: "Actions",
      accessor: "id" as const,
      render: (r: AssignmentWithAlarm) =>
        r.status === "PENDING" ? (
          <button
            type="button"
            onClick={() => handleAccept(r.id)}
            className="text-(--brand-primary) hover:underline text-sm"
          >
            Accept Task
          </button>
        ) : (
          "—"
        ),
    },
  ];

  if (assignments.length === 0) {
    return (
      <p className="text-(--text-muted) py-4">You have no assigned tasks.</p>
    );
  }

  return <Table data={assignments} columns={columns} />;
};

export default RmpTasksClient;
