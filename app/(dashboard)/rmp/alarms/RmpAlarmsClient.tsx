"use client";

import { useRouter } from "next/navigation";

import ScopedAlarmsTable from "@/components/alarms/ScopedAlarmsTable";
import { selfAssignAlarm } from "@/app/(dashboard)/rmp/tasks/actions";
import type { AlarmWithRelations } from "@/lib/scope/alarm-scope";

interface Props {
  alarms: AlarmWithRelations[];
  searchParams: { status?: string; criticality?: string };
}

const RmpAlarmsClient = ({ alarms, searchParams }: Props) => {
  const router = useRouter();

  const handleSelfAssign = async (alarmId: string) => {
    const result = await selfAssignAlarm(alarmId);
    if (result.success) router.refresh();
    else alert(result.error);
  };

  return (
    <ScopedAlarmsTable
      alarms={alarms}
      basePath="/rmp/alarms"
      searchParams={searchParams}
      assignMode="rmp"
      onSelfAssign={handleSelfAssign}
    />
  );
};

export default RmpAlarmsClient;
