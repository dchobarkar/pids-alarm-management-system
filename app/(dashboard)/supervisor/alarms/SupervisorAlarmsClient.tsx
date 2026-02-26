"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ScopedAlarmsTable from "@/components/alarms/ScopedAlarmsTable";
import AssignAlarmModal from "@/components/alarms/AssignAlarmModal";
import type { AlarmWithRelations } from "@/lib/scope/alarm-scope";

interface Props {
  alarms: AlarmWithRelations[];
  searchParams: { status?: string; criticality?: string };
}

const SupervisorAlarmsClient = ({ alarms, searchParams }: Props) => {
  const router = useRouter();
  const [assignModalAlarm, setAssignModalAlarm] =
    useState<AlarmWithRelations | null>(null);

  const handleAssignSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <ScopedAlarmsTable
        alarms={alarms}
        basePath="/supervisor/alarms"
        searchParams={searchParams}
        showAssignmentColumns
        assignMode="supervisor"
        onAssignClick={setAssignModalAlarm}
      />
      <AssignAlarmModal
        open={assignModalAlarm != null}
        onClose={() => setAssignModalAlarm(null)}
        alarm={assignModalAlarm}
        onSuccess={handleAssignSuccess}
      />
    </>
  );
};

export default SupervisorAlarmsClient;
