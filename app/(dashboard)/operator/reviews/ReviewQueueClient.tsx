"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AlarmPendingReview } from "@/types/verification";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { CRITICALITY_BADGE_VARIANT } from "@/constants/badge-variants";
import { PATHS } from "@/constants/paths";
import { markVerified, markFalseAlarm } from "./actions";

interface Props {
  alarms: AlarmPendingReview[];
}

const ReviewQueueClient = ({ alarms }: Props) => {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleVerified = async (alarmId: string) => {
    setLoadingId(alarmId);
    const result = await markVerified(alarmId);
    setLoadingId(null);

    if (result.success) router.refresh();
    else alert(result.error);
  };

  const handleFalseAlarm = async (alarmId: string) => {
    setLoadingId(alarmId);
    const result = await markFalseAlarm(alarmId);
    setLoadingId(null);

    if (result.success) router.refresh();
    else alert(result.error);
  };

  if (alarms.length === 0) {
    return (
      <p className="py-8 text-center text-(--text-muted)">
        No alarms pending review.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {alarms.map((alarm) => {
        const latest = alarm.verifications[0];
        if (!latest) return null;

        const isLoading = loadingId === alarm.id;

        return (
          <article
            key={alarm.id}
            className="rounded-xl border border-(--border-default) bg-(--bg-surface) overflow-hidden shadow-(--shadow-card)"
          >
            {/* Alarm header: ID, chainage, meta */}
            <div className="border-b border-(--border-default) bg-(--bg-elevated) px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <Link
                  href={`${PATHS.operatorAlarms}/${alarm.id}`}
                  className="font-semibold text-(--brand-primary) hover:underline"
                >
                  Alarm {alarm.id.slice(0, 8)}
                </Link>

                <span className="text-(--text-secondary)">
                  {alarm.chainage.label} | {alarm.chainageValue.toFixed(3)} km
                </span>

                <Badge variant={CRITICALITY_BADGE_VARIANT[alarm.criticality]}>
                  {alarm.criticality}
                </Badge>

                <span className="text-(--text-muted) text-sm">
                  {alarm.alarmType}
                </span>
              </div>
              <p className="mt-1 text-sm text-(--text-muted)">
                Created by {alarm.createdBy.name}
                {" | "}
                Incident: {new Date(alarm.incidentTime).toLocaleString()}
              </p>
            </div>

            {/* Verification details */}
            <div className="px-4 py-3 sm:px-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-(--text-muted) mb-2">
                Latest verification
              </h4>

              <div className="grid gap-1 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-(--text-secondary)">Distance:</span>{" "}
                  {latest.distance.toFixed(0)} m
                  {latest.geoMismatch && (
                    <Badge variant="high" className="ml-2 align-middle">
                      Exceeds 100 m
                    </Badge>
                  )}
                </p>

                <p>
                  <span className="text-(--text-secondary)">Verified by:</span>{" "}
                  {latest.verifiedBy.name}
                </p>

                <p className="sm:col-span-2">
                  <span className="text-(--text-secondary)">At:</span>{" "}
                  {new Date(latest.verifiedAt).toLocaleString()}
                </p>

                {latest.remarks && (
                  <p className="sm:col-span-2">
                    <span className="text-(--text-secondary)">Remarks:</span>{" "}
                    {latest.remarks}
                  </p>
                )}
              </div>
            </div>

            {/* Evidence */}
            {alarm.evidences.length > 0 && (
              <div className="border-t border-(--border-default) px-4 py-3 sm:px-5 bg-(--bg-elevated)/50">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-(--text-muted) mb-2">
                  Evidence ({alarm.evidences.length})
                </h4>

                <div className="flex flex-wrap gap-3">
                  {alarm.evidences.map((ev) => (
                    <a
                      key={ev.id}
                      href={ev.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-(--border-default) bg-(--bg-surface)"
                    >
                      <Image
                        src={ev.fileUrl}
                        alt="Evidence"
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-(--border-default) px-4 py-3 sm:px-5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleFalseAlarm(alarm.id)}
                loading={isLoading}
                disabled={isLoading}
              >
                Mark false alarm
              </Button>

              <Button
                type="button"
                onClick={() => handleVerified(alarm.id)}
                loading={isLoading}
                disabled={isLoading}
              >
                Mark verified
              </Button>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ReviewQueueClient;
