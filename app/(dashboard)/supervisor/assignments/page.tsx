import { getSession } from "@/lib/auth/get-session";
import { findUserByIdWithChainages } from "@/api/user/user.repository";
import { findAssignmentsForChainages } from "@/api/assignment/assignment.repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import SupervisorAssignmentsClient from "./SupervisorAssignmentsClient";

const SupervisorAssignmentsPage = async () => {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const user = await findUserByIdWithChainages(session.user.id);
  const chainageIds = user.chainages.map((c) => c.chainageId);
  const assignments = await findAssignmentsForChainages(chainageIds);

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Supervisor", href: "/supervisor" },
          { label: "Assignments" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">
          Assigned tasks
        </h1>
        <p className="mt-1 text-sm text-(--text-secondary)">
          Tasks (alarms) assigned to RMPs in your chainages.
        </p>
      </div>

      <Card>
        <SupervisorAssignmentsClient assignments={assignments} />
      </Card>
    </div>
  );
};

export default SupervisorAssignmentsPage;
