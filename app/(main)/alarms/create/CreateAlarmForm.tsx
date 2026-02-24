"use client";

import { createAlarm } from "@/app/actions/alarms";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ALARM_TYPES = [
  "TRACK_INTRUSION",
  "DOOR_ALARM",
  "FIRE_ALARM",
  "CCTV_FAULT",
  "POWER_FAULT",
  "OTHER",
];

export function CreateAlarmForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = await createAlarm(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    if (result?.success && result.alarmId) {
      router.push(`/alarms/${result.alarmId}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-[var(--destructive)]/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Latitude
          </label>
          <input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            required
            className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            placeholder="1.3521"
          />
        </div>
        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            Longitude
          </label>
          <input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            required
            className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            placeholder="103.8198"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="chainage"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Chainage (km, 3 decimal precision)
        </label>
        <input
          id="chainage"
          name="chainage"
          type="number"
          step="0.001"
          min="0"
          required
          className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          placeholder="12.345"
        />
      </div>

      <div>
        <label
          htmlFor="alarmType"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Alarm Type
        </label>
        <select
          id="alarmType"
          name="alarmType"
          required
          className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        >
          {ALARM_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="criticality"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Criticality
        </label>
        <select
          id="criticality"
          name="criticality"
          required
          className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="incidentTime"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Incident Time
        </label>
        <input
          id="incidentTime"
          name="incidentTime"
          type="datetime-local"
          required
          className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Alarm"}
        </button>
        <a
          href="/alarms"
          className="rounded-lg border border-[var(--border)] px-6 py-3 font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
