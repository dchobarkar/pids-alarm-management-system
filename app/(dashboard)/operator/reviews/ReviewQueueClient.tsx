"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Badge from "@/components/ui/Badge";
import { markVerified, markFalseAlarm } from "./actions";
import type { AlarmPendingReview } from "@/types/verification";

interface Props {
  alarms: AlarmPendingReview[];
}

const ReviewQueueClient = ({ alarms }: Props) => {
  const router = useRouter();

  const handleVerified = async (alarmId: string) => {
    const result = await markVerified(alarmId);
    if (result.success) router.refresh();
    else alert(result.error);
  };

  const handleFalseAlarm = async (alarmId: string) => {
    const result = await markFalseAlarm(alarmId);
    if (result.success) router.refresh();
    else alert(result.error);
  };

  if (alarms.length === 0) {
    return (
      <p className="text-(--text-muted) py-4">
        No alarms pending review (IN_PROGRESS with verification).
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {alarms.map((alarm) => {
        const latest = alarm.verifications[0];
        if (!latest) return null;
        return (
          <div
            key={alarm.id}
            className="border border-(--border-default) rounded-lg p-4 space-y-3"
          >
            <div className="flex flex-wrap gap-4 items-start justify-between">
              <div>
                <p className="font-medium text-(--text-primary)">
                  Alarm {alarm.id.slice(0, 8)} — {alarm.chainage.label} (
                  {alarm.chainageValue.toFixed(3)} km)
                </p>
                <p className="text-sm text-(--text-secondary)">
                  Type: {alarm.alarmType} · Criticality: {alarm.criticality} ·
                  Created by {alarm.createdBy.name}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleVerified(alarm.id)}
                  className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark Verified
                </button>
                <button
                  type="button"
                  onClick={() => handleFalseAlarm(alarm.id)}
                  className="px-3 py-1.5 text-sm bg-(--bg-surface) border border-(--border-default) rounded hover:bg-(--bg-card)"
                >
                  Mark False Alarm
                </button>
              </div>
            </div>

            <div className="text-sm space-y-1">
              <p>
                <span className="text-(--text-secondary)">
                  Distance from site:
                </span>{" "}
                {latest.distance.toFixed(0)} m
                {latest.geoMismatch && (
                  <Badge variant="high" className="ml-2">
                    Exceeds 100m
                  </Badge>
                )}
              </p>
              <p>
                <span className="text-(--text-secondary)">Verified by:</span>{" "}
                {latest.verifiedBy.name} at{" "}
                {new Date(latest.verifiedAt).toLocaleString()}
              </p>
              {latest.remarks && (
                <p>
                  <span className="text-(--text-secondary)">Remarks:</span>{" "}
                  {latest.remarks}
                </p>
              )}
            </div>

            {alarm.evidences.length > 0 && (
              <div>
                <p className="text-sm font-medium text-(--text-secondary) mb-2">
                  Evidence
                </p>
                <div className="flex flex-wrap gap-2">
                  {alarm.evidences.map((ev) => (
                    <a
                      key={ev.id}
                      href={ev.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative w-24 h-24 rounded border border-(--border-default) overflow-hidden bg-(--bg-surface)"
                    >
                      <Image
                        src={ev.fileUrl}
                        alt="Evidence"
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReviewQueueClient;
