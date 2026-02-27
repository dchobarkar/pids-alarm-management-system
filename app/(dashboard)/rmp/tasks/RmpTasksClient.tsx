"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import { acceptAssignment } from "./actions";
import type { AssignmentWithAlarm } from "@/lib/assignment/assignment-repository";

interface Props {
  assignments: AssignmentWithAlarm[];
  showVerificationSubmittedMessage?: boolean;
}

const RmpTasksClient = ({ assignments, showVerificationSubmittedMessage }: Props) => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(showVerificationSubmittedMessage ?? false);

  useEffect(() => {
    if (showVerificationSubmittedMessage) {
      setShowSuccess(true);
      router.replace("/rmp/tasks", { scroll: false });
    }
  }, [showVerificationSubmittedMessage, router]);

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
      render: (r: AssignmentWithAlarm) => {
        if (r.status === "PENDING")
          return (
            <button
              type="button"
              onClick={() => handleAccept(r.id)}
              className="text-(--brand-primary) hover:underline text-sm"
            >
              Accept Task
            </button>
          );
        if (r.status === "ACCEPTED" && r.alarm.status === "IN_PROGRESS")
          return (
            <Link
              href={`/rmp/tasks/${r.alarm.id}/verify`}
              className="text-(--brand-primary) hover:underline text-sm"
            >
              Verify
            </Link>
          );
        return "—";
      },
    },
  ];

  return (
    <>
      {showSuccess && (
        <Alert variant="info" className="mb-4">
          Verification submitted. An operator will review it and mark the alarm as <strong>Verified</strong> or <strong>False Alarm</strong>. This task has been removed from your list.
        </Alert>
      )}
      {assignments.length === 0 ? (
        <p className="text-(--text-muted) py-4">You have no assigned tasks.</p>
      ) : (
        <Table data={assignments} columns={columns} />
      )}
    </>
  );
};

export default RmpTasksClient;
