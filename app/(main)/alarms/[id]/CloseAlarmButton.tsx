"use client";

import { closeAlarm } from "@/app/actions/closure";
import { useState } from "react";

export function CloseAlarmButton({ alarmId }: { alarmId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (!confirm("Are you sure you want to close this alarm?")) return;

    setLoading(true);
    setError("");

    const result = await closeAlarm(alarmId);

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
        className="rounded-lg bg-[var(--success)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Closing..." : "Close Alarm"}
      </button>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
