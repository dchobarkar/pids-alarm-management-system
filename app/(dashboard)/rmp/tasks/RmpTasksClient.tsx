"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Table from "@/components/ui/Table";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { acceptAssignment } from "./actions";
import { getRmpTasksColumns } from "@/config/rmp-tasks-columns";
import type { AssignmentWithAlarm } from "@/types/assignment";

const getDirectionsUrl = (latitude: number, longitude: number): string =>
  `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

interface Props {
  assignments: AssignmentWithAlarm[];
  showVerificationSubmittedMessage?: boolean;
}

const RmpTasksClient = ({
  assignments,
  showVerificationSubmittedMessage = false,
}: Props) => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(
    showVerificationSubmittedMessage,
  );
  const [detailsAssignment, setDetailsAssignment] =
    useState<AssignmentWithAlarm | null>(null);

  useEffect(() => {
    if (showVerificationSubmittedMessage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSuccess(true);
      router.replace("/rmp/tasks", { scroll: false });
    }
  }, [showVerificationSubmittedMessage, router]);

  const handleAccept = useCallback(
    async (assignmentId: string) => {
      const result = await acceptAssignment(assignmentId);
      if (result?.success) router.refresh();
      else if (result?.error) alert(result.error);
    },
    [router],
  );

  const handleViewDetails = useCallback((assignment: AssignmentWithAlarm) => {
    setDetailsAssignment(assignment);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsAssignment(null);
  }, []);

  const columns = useMemo(
    () =>
      getRmpTasksColumns({
        onViewDetails: handleViewDetails,
        onAccept: handleAccept,
      }),
    [handleViewDetails, handleAccept],
  );

  const alarm = detailsAssignment?.alarm;

  return (
    <>
      {showSuccess && (
        <Alert variant="info" className="mb-4">
          Verification submitted. An operator will review it and mark the alarm
          as <strong>Verified</strong> or <strong>False Alarm</strong>. This
          task has been removed from your list.
        </Alert>
      )}
      {assignments.length === 0 ? (
        <p className="py-4 text-(--text-muted)">You have no assigned tasks.</p>
      ) : (
        <Table data={assignments} columns={columns} />
      )}

      <Modal
        open={!!detailsAssignment}
        onClose={handleCloseDetails}
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
            <div className="flex flex-wrap justify-end gap-2 pt-2">
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
                onClick={handleCloseDetails}
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
