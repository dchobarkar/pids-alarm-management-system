"use client";

import Link from "next/link";

import type { AlarmWithRelations } from "@/lib/scope/alarm-scope";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

const STATUS_VARIANT: Record<
  string,
  "created" | "assigned" | "investigating" | "done" | "closed"
> = {
  CREATED: "created",
  UNASSIGNED: "created",
  ASSIGNED: "assigned",
  IN_PROGRESS: "investigating",
  VERIFIED: "done",
  FALSE_ALARM: "closed",
  ESCALATED: "investigating",
  CLOSED: "closed",
};

const CRITICALITY_VARIANT = {
  LOW: "low" as const,
  MEDIUM: "medium" as const,
  HIGH: "high" as const,
  CRITICAL: "critical" as const,
};

interface Props {
  alarms: AlarmWithRelations[];
  searchParams: {
    status?: string;
    criticality?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

const OperatorAlarmsTable = ({ alarms, searchParams }: Props) => {
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
        <Badge variant={CRITICALITY_VARIANT[r.criticality]}>
          {r.criticality}
        </Badge>
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
      header: "Created by",
      accessor: "createdBy" as const,
      render: (r: AlarmWithRelations) => r.createdBy.name,
    },
  ];

  const base = "/operator/alarms";
  const q = (overrides: Record<string, string>) => {
    const p = { ...searchParams, ...overrides };
    const s = new URLSearchParams();
    Object.entries(p).forEach(([k, v]) => {
      if (v) s.set(k, v);
    });
    const qs = s.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <span className="text-(--text-secondary)">Filters:</span>
        <Link href={q({})} className="text-(--brand-primary) hover:underline">
          All
        </Link>
        {(["UNASSIGNED", "ASSIGNED", "CLOSED"] as const).map((s) => (
          <Link
            key={s}
            href={q({ status: s })}
            className="text-(--brand-primary) hover:underline"
          >
            {s}
          </Link>
        ))}
        <span className="text-(--text-muted)">|</span>
        {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((c) => (
          <Link
            key={c}
            href={q({ criticality: c })}
            className="text-(--brand-primary) hover:underline"
          >
            {c}
          </Link>
        ))}
        <form
          method="get"
          action={base}
          className="flex flex-wrap gap-2 items-center ml-2"
        >
          <input
            type="hidden"
            name="status"
            value={searchParams.status ?? ""}
          />
          <input
            type="hidden"
            name="criticality"
            value={searchParams.criticality ?? ""}
          />
          <label className="text-(--text-secondary)">From</label>
          <input
            type="date"
            name="dateFrom"
            defaultValue={searchParams.dateFrom}
            className="bg-(--bg-surface) border border-(--border-default) rounded px-2 py-1 text-sm"
          />
          <label className="text-(--text-secondary)">To</label>
          <input
            type="date"
            name="dateTo"
            defaultValue={searchParams.dateTo}
            className="bg-(--bg-surface) border border-(--border-default) rounded px-2 py-1 text-sm"
          />
          <button
            type="submit"
            className="text-(--brand-primary) hover:underline text-sm"
          >
            Apply
          </button>
        </form>
      </div>
      {alarms.length === 0 ? (
        <p className="text-(--text-muted) py-4">No alarms match the filters.</p>
      ) : (
        <Table data={alarms} columns={columns} />
      )}
    </div>
  );
};

export default OperatorAlarmsTable;
