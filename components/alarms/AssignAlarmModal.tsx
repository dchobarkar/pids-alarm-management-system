"use client";

import { useState, useEffect } from "react";

import Modal from "@/components/ui/Modal";
import type { AlarmWithRelations } from "@/lib/scope/alarm-scope";
import { getRmpOptionsForAlarm } from "@/app/(dashboard)/supervisor/assignments/actions";
import { assignAlarm } from "@/app/(dashboard)/supervisor/assignments/actions";

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);
    setSelectedRmpId("");
    setLoading(true);
    getRmpOptionsForAlarm(alarm.id)
      .then((res) => {
        if (res.success) setRmps(res.rmps);
        else setError(res.error);
      })
      .finally(() => setLoading(false));
  }, [open, alarm?.id, alarm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alarm || !selectedRmpId) return;
    setSubmitting(true);
    setError(null);
    const result = await assignAlarm(alarm.id, selectedRmpId);
    setSubmitting(false);
    if (result.success) {
      onSuccess();
      onClose();
    } else setError(result.error);
  };

  if (!alarm) return null;

  return (
    <Modal open={open} onClose={onClose} title="Assign alarm to RMP">
      <form onSubmit={handleSubmit} className="space-y-3">
        {loading ? (
          <p className="text-(--text-muted)">Loading RMPs…</p>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : rmps.length === 0 ? (
          <p className="text-(--text-muted)">
            No RMPs mapped to this alarm&apos;s chainage.
          </p>
        ) : (
          <>
            <label className="block text-sm font-medium text-(--text-secondary)">
              RMP
            </label>
            <select
              value={selectedRmpId}
              onChange={(e) => setSelectedRmpId(e.target.value)}
              required
              className="w-full bg-(--bg-surface) border border-(--border-default) rounded px-2 py-1.5 text-sm"
            >
              <option value="">Select RMP</option>
              {rmps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </>
        )}
        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-sm border border-(--border-default) rounded hover:bg-(--bg-surface)"
          >
            Cancel
          </button>
          {rmps.length > 0 && (
            <button
              type="submit"
              disabled={submitting}
              className="px-3 py-1.5 text-sm bg-(--brand-primary) text-white rounded disabled:opacity-50"
            >
              {submitting ? "Assigning…" : "Assign"}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AssignAlarmModal;
