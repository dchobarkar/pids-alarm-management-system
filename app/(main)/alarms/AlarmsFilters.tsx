"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function AlarmsFilters({
  currentStatus,
  currentCriticality,
}: {
  currentStatus?: string;
  currentCriticality?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/alarms?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="block text-sm font-medium text-[var(--muted)] mb-1">
          Status
        </label>
        <select
          value={currentStatus ?? ""}
          onChange={(e) => updateFilter("status", e.target.value || null)}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
        >
          <option value="">All</option>
          <option value="CREATED">Created</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="INVESTIGATION_DONE">Investigation Done</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-[var(--muted)] mb-1">
          Criticality
        </label>
        <select
          value={currentCriticality ?? ""}
          onChange={(e) => updateFilter("criticality", e.target.value || null)}
          className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
        >
          <option value="">All</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
    </div>
  );
}
