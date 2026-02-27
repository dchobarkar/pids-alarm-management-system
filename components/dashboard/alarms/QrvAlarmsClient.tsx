"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import type { AlarmWithRelations } from "@/types/alarm";
import {
  getRmpOptionsForEscalatedAlarm,
  reassignEscalatedAlarm,
} from "@/app/(dashboard)/qrv/alarms/actions";

const STATUS_VARIANT: Record<
  string,
  "created" | "assigned" | "investigating" | "closed"
> = {
  ESCALATED: "investigating",
};

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

  const openReassign = async (alarm: AlarmWithRelations) => {
    setReassignAlarm(alarm);
    setError(null);
    setSelectedRmpId("");
    setLoadingRmps(true);
    const res = await getRmpOptionsForEscalatedAlarm(alarm.id);
    setLoadingRmps(false);
    if (res.success) setRmps(res.rmps);
    else setError(res.error);
  };

  const handleReassign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignAlarm || !selectedRmpId) return;
    setSubmitting(true);
    setError(null);
    const result = await reassignEscalatedAlarm(
      reassignAlarm.id,
      selectedRmpId,
    );
    setSubmitting(false);
    if (result.success) {
      setReassignAlarm(null);
      router.refresh();
    } else setError(result.error);
  };

  const columns = [
    {
      header: "ID",
      accessor: "id" as const,
      render: (r: AlarmWithRelations) => r.id.slice(0, 8),
    },
    {
      header: "Chainage",
      accessor: "chainage" as const,
      render: (r: AlarmWithRelations) => r.chainage.label,
    },
    {
      header: "Value (km)",
      accessor: "chainageValue" as const,
      render: (r: AlarmWithRelations) => r.chainageValue.toFixed(3),
    },
    { header: "Type", accessor: "alarmType" as const },
    {
      header: "Criticality",
      accessor: "criticality" as const,
      render: (r: AlarmWithRelations) => (
        <Badge variant="medium">{r.criticality}</Badge>
      ),
    },
    {
      header: "Status",
      accessor: "status" as const,
      render: (r: AlarmWithRelations) => (
        <Badge variant={STATUS_VARIANT[r.status] ?? "created"}>
          {r.status}
        </Badge>
      ),
    },
    {
      header: "Incident time",
      accessor: "incidentTime" as const,
      render: (r: AlarmWithRelations) =>
        new Date(r.incidentTime).toLocaleString(),
    },
    {
      header: "Actions",
      accessor: "id" as const,
      render: (r: AlarmWithRelations) => (
        <button
          type="button"
          onClick={() => openReassign(r)}
          className="text-(--brand-primary) hover:underline text-sm"
        >
          Reassign
        </button>
      ),
    },
  ];

  if (alarms.length === 0) {
    return <p className="text-(--text-muted) py-4">No escalated alarms.</p>;
  }

  return (
    <>
      <Table data={alarms} columns={columns} />
      <Modal
        open={reassignAlarm != null}
        onClose={() => setReassignAlarm(null)}
        title="Reassign to RMP"
      >
        <form onSubmit={handleReassign} className="space-y-3">
          {loadingRmps ? (
            <p className="text-(--text-muted)">Loading RMPs…</p>
          ) : error ? (
            <p className="text-(--alarm-critical) text-sm">{error}</p>
          ) : rmps.length === 0 ? (
            <p className="text-(--text-muted)">No RMPs in this chainage.</p>
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
              onClick={() => setReassignAlarm(null)}
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
                {submitting ? "Reassigning…" : "Reassign"}
              </button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default QrvAlarmsClient;
