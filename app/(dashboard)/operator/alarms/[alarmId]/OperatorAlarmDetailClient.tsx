"use client";

import { useRouter } from "next/navigation";

import { closeAlarm } from "./actions";
import { getSlaInfo } from "@/lib/sla/elapsed";

interface Props {
  alarmId: string;
  status: string;
  createdAt: Date;
  assignment: {
    assignedAt: Date;
    acceptedAt: Date | null;
    rmp: { id: string; name: string };
    supervisor: { id: string; name: string } | null;
  } | null;
}

const OperatorAlarmDetailClient = ({
  alarmId,
  status,
  createdAt,
  assignment,
}: Props) => {
  const router = useRouter();

  const slaInfo = getSlaInfo(
    status as "UNASSIGNED" | "ASSIGNED" | "IN_PROGRESS",
    createdAt,
    assignment,
  );

  const handleClose = async () => {
    const result = await closeAlarm(alarmId);
    if (result.success) router.refresh();
    else alert(result.error);
  };

  return (
    <div className="mt-4 pt-4 border-t border-(--border-default) flex flex-wrap items-center gap-4">
      {slaInfo && (
        <span
          className="text-sm"
          title={`${slaInfo.label} (${slaInfo.status})`}
          style={{
            color:
              slaInfo.status === "breached"
                ? "var(--color-red-500, red)"
                : slaInfo.status === "warning"
                  ? "var(--color-amber-500, orange)"
                  : "var(--color-green-600, green)",
          }}
        >
          SLA: {slaInfo.label}
        </span>
      )}
      {(status === "VERIFIED" || status === "FALSE_ALARM") && (
        <button
          type="button"
          onClick={handleClose}
          className="px-3 py-1.5 text-sm bg-(--brand-primary) text-white rounded hover:opacity-90"
        >
          Close alarm
        </button>
      )}
    </div>
  );
};

export default OperatorAlarmDetailClient;
