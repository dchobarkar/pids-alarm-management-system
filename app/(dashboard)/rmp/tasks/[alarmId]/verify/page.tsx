import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/get-session";
import { getAlarmById } from "@/api/alarm";
import { getActiveAssignmentForAlarm } from "@/api/assignment";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import VerifyAlarmForm from "@/components/formComponents/VerifyAlarmForm/VerifyAlarmForm";

type Props = { params: Promise<{ alarmId: string }> };

export default async function RmpVerifyAlarmPage({ params }: Props) {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const { alarmId } = await params;
  const alarm = await getAlarmById(alarmId);
  if (!alarm) redirect("/rmp/tasks");

  const assignment = await getActiveAssignmentForAlarm(alarmId);
  if (!assignment || assignment.rmpId !== session.user.id) {
    redirect("/rmp/tasks");
  }
  if (alarm.status !== "IN_PROGRESS") {
    redirect("/rmp/tasks");
  }

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "RMP", href: "/rmp" },
          { label: "Tasks", href: "/rmp/tasks" },
          { label: `Verify ${alarmId.slice(0, 8)}` },
        ]}
      />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Submit verification
      </h1>
      <Card>
        <p className="text-sm text-(--text-secondary) mb-4">
          Alarm at chainage {alarm.chainage.label} (
          {alarm.chainageValue.toFixed(3)} km). Capture your location and add
          remarks and evidence.
        </p>
        <VerifyAlarmForm alarmId={alarmId} />
      </Card>
    </div>
  );
}
