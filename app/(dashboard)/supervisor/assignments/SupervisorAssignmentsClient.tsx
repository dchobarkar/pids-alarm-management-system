"use client";

import { useMemo } from "react";

import Table from "@/components/ui/Table";
import { getSupervisorAssignmentsColumns } from "@/config/supervisor-assignments-columns";
import type { AssignmentWithAlarm } from "@/types/assignment";

interface Props {
  assignments: AssignmentWithAlarm[];
}

const SupervisorAssignmentsClient = ({ assignments }: Props) => {
  const columns = useMemo(() => getSupervisorAssignmentsColumns(), []);

  if (assignments.length === 0) {
    return (
      <p className="py-4 text-(--text-muted)">
        No active assignments in your chainages. Assign alarms from the Alarms
        page.
      </p>
    );
  }

  return <Table data={assignments} columns={columns} />;
};

export default SupervisorAssignmentsClient;
