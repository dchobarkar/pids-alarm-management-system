"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { AlarmWithRelations } from "@/types/alarm";
import type { AlarmsSearchParams } from "@/types/alarm";
import Table from "@/components/ui/Table";
import OperatorAlarmsFilters from "@/components/alarms/OperatorAlarmsFilters";
import AssignAlarmModal from "@/components/alarms/AssignAlarmModal";
import { escalateAlarm } from "@/app/(dashboard)/supervisor/assignments/escalate-actions";
import { getSupervisorAlarmsColumns } from "@/config/supervisor-alarms-columns";

interface Props {
  alarms: AlarmWithRelations[];
  params: AlarmsSearchParams;
}

const SupervisorAlarmsClient = ({ alarms, params }: Props) => {
  const router = useRouter();
  const [assignModalAlarm, setAssignModalAlarm] =
    useState<AlarmWithRelations | null>(null);

  const handleAssignSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleEscalate = useCallback(
    async (alarmId: string) => {
      const result = await escalateAlarm(alarmId);
      if (result?.success) router.refresh();
      else if (result?.error) alert(result.error);
    },
    [router],
  );

  const handleAssignClick = useCallback((alarm: AlarmWithRelations) => {
    setAssignModalAlarm(alarm);
  }, []);

  const columns = useMemo(
    () =>
      getSupervisorAlarmsColumns({
        onAssignClick: handleAssignClick,
        onEscalate: handleEscalate,
      }),
    [handleAssignClick, handleEscalate],
  );

  return (
    <>
      <div className="space-y-5">
        <OperatorAlarmsFilters basePath="/supervisor/alarms" params={params} />

        {alarms.length === 0 ? (
          <p className="py-4 text-(--text-muted)">
            No alarms match the filters.
          </p>
        ) : (
          <Table data={alarms} columns={columns} />
        )}
      </div>
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
