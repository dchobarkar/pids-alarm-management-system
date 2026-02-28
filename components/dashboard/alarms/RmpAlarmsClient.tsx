"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import type { AlarmWithRelations } from "@/types/alarm";
import type { AlarmsSearchParams } from "@/types/alarm";
import Table from "@/components/ui/Table";
import OperatorAlarmsFilters from "@/components/alarms/OperatorAlarmsFilters";
import { selfAssignAlarm } from "@/app/(dashboard)/rmp/tasks/actions";
import { getRmpAlarmsColumns } from "@/config/rmp-alarms-columns";

const RMP_ALARMS_PATH = "/rmp/alarms";

interface Props {
  alarms: AlarmWithRelations[];
  params: AlarmsSearchParams;
}

const RmpAlarmsClient = ({ alarms, params }: Props) => {
  const router = useRouter();

  const handleSelfAssign = useCallback(
    async (alarmId: string) => {
      const result = await selfAssignAlarm(alarmId);
      if (result?.success) router.refresh();
      else if (result?.error) alert(result.error);
    },
    [router],
  );

  const columns = useMemo(
    () =>
      getRmpAlarmsColumns({
        onSelfAssign: handleSelfAssign,
      }),
    [handleSelfAssign],
  );

  return (
    <div className="space-y-5">
      <OperatorAlarmsFilters basePath={RMP_ALARMS_PATH} params={params} />

      {alarms.length === 0 ? (
        <p className="py-4 text-(--text-muted)">No alarms match the filters.</p>
      ) : (
        <Table data={alarms} columns={columns} />
      )}
    </div>
  );
};

export default RmpAlarmsClient;
