"use client";

import { assignAlarmToSelf, assignAlarmToUser } from "@/app/actions/assignments";
import { useState } from "react";

export function AssignAlarmButton({
  alarmId,
  assigneeId,
  assigneeName,
}: {
  alarmId: string;
  assigneeId?: string;
  assigneeName?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");

    const result = assigneeId
      ? await assignAlarmToUser(alarmId, assigneeId)
      : await assignAlarmToSelf(alarmId);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    window.location.reload();
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
      >
        {assigneeId ? `Assign to ${assigneeName}` : "Assign to Me"}
      </button>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
