import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/get-session";
import { getAlarmById } from "@/api/alarm/alarm.repository";
import { findActiveAssignmentForAlarm } from "@/api/assignment/assignment.repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import VerifyAlarmForm from "@/components/formComponents/VerifyAlarmForm/VerifyAlarmForm";

type Props = { params: Promise<{ alarmId: string }> };

const RmpVerifyAlarmPage = async ({ params }: Props) => {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const { alarmId } = await params;
  const alarm = await getAlarmById(alarmId);
  if (!alarm) redirect("/rmp/tasks");

  const assignment = await findActiveAssignmentForAlarm(alarmId);
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
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">
          Submit verification
        </h1>
      </div>
      <Card>
        <p className="mb-4 text-sm text-(--text-secondary)">
          Alarm at chainage {alarm.chainage.label} (
          {alarm.chainageValue.toFixed(3)} km). Capture your location and add
          remarks and evidence.
        </p>
        <VerifyAlarmForm alarmId={alarmId} />
      </Card>
    </div>
  );
};

export default RmpVerifyAlarmPage;
