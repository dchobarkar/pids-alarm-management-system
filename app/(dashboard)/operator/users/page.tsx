import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import {
  findUsers,
  findUsersByRoles,
} from "@/api/user/user-repository";
import { SUPERVISOR_ROLES } from "@/constants/roles";
import type { UserWithSupervisor } from "@/types/user";
import UsersTable from "./UsersTable";
import UserCreateButton from "./UserCreateButton";

const OperatorUsersPage = async () => {
  const [users, supervisors] = await Promise.all([
    findUsers({ includeSupervisor: true }),
    findUsersByRoles(SUPERVISOR_ROLES),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumb
          crumbs={[
            { label: "Operator", href: "/operator" },
            { label: "Users" },
          ]}
        />
        <UserCreateButton supervisors={supervisors} />
      </div>
      <Card>
        <UsersTable users={users as UserWithSupervisor[]} supervisors={supervisors} />
      </Card>
    </div>
  );
};

export default OperatorUsersPage;
