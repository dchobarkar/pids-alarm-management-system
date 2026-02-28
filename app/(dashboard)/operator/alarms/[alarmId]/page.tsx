import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/get-session";
import { getAlarmById } from "@/api/alarm/alarm-repository";
import { getVerificationsByAlarm } from "@/api/verification/verification-repository";
import { getSlaInfo } from "@/lib/sla/elapsed";
import { findEvidenceByAlarmId } from "@/api/evidence/evidence-repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import CloseAlarmButton from "./CloseAlarmButton";

type Props = { params: Promise<{ alarmId: string }> };

export default async function Page({ params }: Props) {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const { alarmId } = await params;
  const alarm = await getAlarmById(alarmId);
  if (!alarm) redirect("/operator/alarms");

  const verifications = await getVerificationsByAlarm(alarmId);
  const evidences = await findEvidenceByAlarmId(alarmId);

  const slaInfo = getSlaInfo(
    alarm.status as "UNASSIGNED" | "ASSIGNED" | "IN_PROGRESS",
    alarm.createdAt,
    alarm.assignments[0]
      ? {
          assignedAt: alarm.assignments[0].assignedAt,
          acceptedAt: alarm.assignments[0].acceptedAt,
        }
      : null,
  );
  const canClose =
    alarm.status === "VERIFIED" || alarm.status === "FALSE_ALARM";

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Operator", href: "/operator" },
          { label: "Alarms", href: "/operator/alarms" },
          { label: alarmId.slice(0, 8) },
        ]}
      />

      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Alarm {alarmId.slice(0, 8)}
      </h1>

      <div className="space-y-4">
        <Card>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-(--text-secondary)">Chainage</span>

            <span>
              {alarm.chainage.label} ({alarm.chainageValue.toFixed(3)} km)
            </span>

            <span className="text-(--text-secondary)">Type / Criticality</span>

            <span>
              {alarm.alarmType} / {alarm.criticality}
            </span>

            <span className="text-(--text-secondary)">Status</span>

            <span>
              <Badge variant={alarm.status === "CLOSED" ? "closed" : "created"}>
                {alarm.status}
              </Badge>
            </span>

            <span className="text-(--text-secondary)">Created by</span>

            <span>{alarm.createdBy.name}</span>

            <span className="text-(--text-secondary)">Incident time</span>

            <span>{new Date(alarm.incidentTime).toLocaleString()}</span>

            {alarm.assignments[0] && (
              <>
                <span className="text-(--text-secondary)">Assigned RMP</span>
                <span>{alarm.assignments[0].rmp.name}</span>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-(--border-default) pt-4">
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
            {canClose && <CloseAlarmButton alarmId={alarmId} />}
          </div>
        </Card>

        {verifications.length > 0 && (
          <Card>
            <h2 className="text-sm font-semibold mb-2">Verifications</h2>
            <ul className="space-y-2 text-sm">
              {verifications.map((v) => (
                <li key={v.id}>
                  {v.verifiedBy.name} — {v.distance.toFixed(0)}m
                  {v.geoMismatch && " (exceeds 100m)"} —{" "}
                  {new Date(v.verifiedAt).toLocaleString()}
                  {v.remarks && ` — ${v.remarks}`}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {evidences.length > 0 && (
          <Card>
            <h2 className="text-sm font-semibold mb-2">Evidence</h2>
            <div className="flex flex-wrap gap-2">
              {evidences.map((e) => (
                <a
                  key={e.id}
                  href={e.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--brand-primary) hover:underline text-sm"
                >
                  {e.fileUrl.split("/").pop()}
                </a>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
