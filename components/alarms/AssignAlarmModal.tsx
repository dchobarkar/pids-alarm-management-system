"use client";

import { useEffect, useMemo, useState } from "react";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/Alert";
import type { AlarmWithRelations } from "@/types/alarm";
import { getRmpOptionsForAlarm, assignAlarm } from "@/app/(dashboard)/supervisor/assignments/actions";

interface Props {
  open: boolean;
  onClose: () => void;
  alarm: AlarmWithRelations | null;
  onSuccess: () => void;
}

const AssignAlarmModal = ({ open, onClose, alarm, onSuccess }: Props) => {
  const [rmps, setRmps] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRmpId, setSelectedRmpId] = useState("");

  useEffect(() => {
    if (!open || !alarm) return;
    setError(null);
    setSelectedRmpId("");
    setLoading(true);
    getRmpOptionsForAlarm(alarm.id)
      .then((res) => {
        if (res.success) setRmps(res.rmps);
        else setError(res.error);
      })
      .finally(() => setLoading(false));
  }, [open, alarm?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alarm || !selectedRmpId) return;
    setSubmitting(true);
    setError(null);
    const result = await assignAlarm(alarm.id, selectedRmpId);
    setSubmitting(false);
    if (result?.success) {
      onSuccess();
      onClose();
    } else if (result?.error) setError(result.error);
  };

  const rmpOptions = useMemo(
    () => [
      { value: "", label: "— Select RMP —" },
      ...rmps.map((r) => ({ value: r.id, label: r.name })),
    ],
    [rmps],
  );

  if (!alarm) return null;

  return (
    <Modal open={open} onClose={onClose} title="Assign alarm to RMP">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <Alert variant="error" className="mb-2">
            {error}
          </Alert>
        )}
        {loading ? (
          <p className="text-(--text-muted)">Loading RMPs…</p>
        ) : rmps.length === 0 && !error ? (
          <p className="text-(--text-muted)">
            No RMPs mapped to this alarm&apos;s chainage.
          </p>
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
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {rmps.length > 0 && (
            <Button type="submit" loading={submitting}>
              Assign
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AssignAlarmModal;
