"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { AlarmWithRelations } from "@/types/alarm";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/Alert";
import { getQrvAlarmsColumns } from "@/config/qrv-alarms-columns";
import {
  getRmpOptionsForEscalatedAlarm,
  reassignEscalatedAlarm,
} from "@/app/(dashboard)/qrv/alarms/actions";

interface Props {
  alarms: AlarmWithRelations[];
}

const QrvAlarmsClient = ({ alarms }: Props) => {
  const router = useRouter();
  const [reassignAlarm, setReassignAlarm] = useState<AlarmWithRelations | null>(
    null,
  );
  const [rmps, setRmps] = useState<{ id: string; name: string }[]>([]);
  const [loadingRmps, setLoadingRmps] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRmpId, setSelectedRmpId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const openReassign = useCallback(async (alarm: AlarmWithRelations) => {
    setReassignAlarm(alarm);
    setError(null);
    setSelectedRmpId("");
    setLoadingRmps(true);
    const res = await getRmpOptionsForEscalatedAlarm(alarm.id);
    setLoadingRmps(false);
    if (res.success) setRmps(res.rmps);
    else setError(res.error);
  }, []);

  const handleReassign = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reassignAlarm || !selectedRmpId) return;
      setSubmitting(true);
      setError(null);
      const result = await reassignEscalatedAlarm(
        reassignAlarm.id,
        selectedRmpId,
      );
      setSubmitting(false);
      if (result?.success) {
        setReassignAlarm(null);
        router.refresh();
      } else if (result?.error) setError(result.error);
    },
    [reassignAlarm, selectedRmpId, router],
  );

  const handleCloseReassign = useCallback(() => {
    setReassignAlarm(null);
    setError(null);
    setSelectedRmpId("");
  }, []);

  const columns = useMemo(
    () =>
      getQrvAlarmsColumns({
        onReassign: openReassign,
      }),
    [openReassign],
  );

  const rmpOptions = useMemo(
    () => [
      { value: "", label: "— Select RMP —" },
      ...rmps.map((r) => ({ value: r.id, label: r.name })),
    ],
    [rmps],
  );

  if (alarms.length === 0) {
    return <p className="text-(--text-muted) py-4">No escalated alarms.</p>;
  }

  return (
    <>
      <Table data={alarms} columns={columns} />

      <Modal
        open={reassignAlarm != null}
        onClose={handleCloseReassign}
        title="Reassign to RMP"
      >
        <form onSubmit={handleReassign} className="space-y-3">
          {error && (
            <Alert variant="error" className="mb-2">
              {error}
            </Alert>
          )}
          {loadingRmps ? (
            <p className="text-(--text-muted)">Loading RMPs…</p>
          ) : rmps.length === 0 && !error ? (
            <p className="text-(--text-muted)">No RMPs in this chainage.</p>
          ) : (
            <Select
              label="RMP"
              name="rmpId"
              options={rmpOptions}
              value={selectedRmpId}
              onChange={(e) => setSelectedRmpId(e.target.value)}
              required
            />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseReassign}
            >
              Cancel
            </Button>
            {rmps.length > 0 && (
              <Button type="submit" loading={submitting}>
                Reassign
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default QrvAlarmsClient;
