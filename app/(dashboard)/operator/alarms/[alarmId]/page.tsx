import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/get-session";
import { getAlarmById } from "@/lib/alarm/alarm-repository";
import { getVerificationsByAlarm } from "@/lib/verification/verification-repository";
import { prisma } from "@/lib/db";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import OperatorAlarmDetailClient from "./OperatorAlarmDetailClient";

type Props = { params: Promise<{ alarmId: string }> };

export default async function OperatorAlarmDetailPage({ params }: Props) {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const { alarmId } = await params;
  const alarm = await getAlarmById(alarmId);
  if (!alarm) redirect("/operator/alarms");

  const verifications = await getVerificationsByAlarm(alarmId);
  const evidences = await prisma.evidence.findMany({
    where: { alarmId },
    orderBy: { uploadedAt: "desc" },
  });

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
          <OperatorAlarmDetailClient
            alarmId={alarmId}
            status={alarm.status}
            createdAt={alarm.createdAt}
            assignment={alarm.assignments[0] ?? null}
          />
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
