"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { acceptAssignment } from "./actions";
import type { AssignmentWithAlarm } from "@/lib/assignment/assignment-repository";

/** Open Google Maps directions to destination lat/lng. */
function getDirectionsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

interface Props {
  assignments: AssignmentWithAlarm[];
  showVerificationSubmittedMessage?: boolean;
}

const RmpTasksClient = ({ assignments, showVerificationSubmittedMessage }: Props) => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(showVerificationSubmittedMessage ?? false);
  const [detailsAssignment, setDetailsAssignment] = useState<AssignmentWithAlarm | null>(null);

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
      render: (r: AssignmentWithAlarm) => (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setDetailsAssignment(r)}
            className="text-sm text-(--text-secondary) hover:text-(--brand-primary) hover:underline"
          >
            View details
          </button>
          {r.status === "PENDING" && (
            <button
              type="button"
              onClick={() => handleAccept(r.id)}
              className="text-sm text-(--brand-primary) hover:underline"
            >
              Accept Task
            </button>
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

  const alarm = detailsAssignment?.alarm;

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

      <Modal
        open={!!detailsAssignment}
        onClose={() => setDetailsAssignment(null)}
        title="Task / alarm details"
      >
        {alarm && (
          <div className="space-y-3">
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
              <dt className="text-(--text-muted)">Alarm ID</dt>
              <dd className="font-mono">{alarm.id.slice(0, 8)}</dd>
              <dt className="text-(--text-muted)">Chainage</dt>
              <dd>{alarm.chainage.label}</dd>
              <dt className="text-(--text-muted)">Value (km)</dt>
              <dd>{alarm.chainageValue.toFixed(3)}</dd>
              <dt className="text-(--text-muted)">Type</dt>
              <dd>{alarm.alarmType}</dd>
              <dt className="text-(--text-muted)">Criticality</dt>
              <dd>{alarm.criticality}</dd>
              <dt className="text-(--text-muted)">Status</dt>
              <dd>{alarm.status}</dd>
              <dt className="text-(--text-muted)">Incident time</dt>
              <dd>{new Date(alarm.incidentTime).toLocaleString()}</dd>
              <dt className="text-(--text-muted)">Latitude</dt>
              <dd className="font-mono">{alarm.latitude}</dd>
              <dt className="text-(--text-muted)">Longitude</dt>
              <dd className="font-mono">{alarm.longitude}</dd>
            </dl>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={getDirectionsUrl(alarm.latitude, alarm.longitude)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button type="button">Directions</Button>
              </a>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDetailsAssignment(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RmpTasksClient;
