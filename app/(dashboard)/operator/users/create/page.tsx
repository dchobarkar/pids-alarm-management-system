import Link from "next/link";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PATHS } from "@/constants/paths";
import CreateUserForm from "./CreateUserForm";
import { findUsersByRoles } from "@/api/user/user.repository";
import { SUPERVISOR_ROLES } from "@/constants/roles";

const Page = async () => {
  const supervisors = await findUsersByRoles(SUPERVISOR_ROLES);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumb
          crumbs={[
            { label: "Operator", href: "/operator" },
            { label: "Users", href: PATHS.operatorUsers },
            { label: "Create user" },
          ]}
        />

        <Link href={PATHS.operatorUsers}>
          <Button variant="secondary">Back to users</Button>
        </Link>
      </div>

      <Card title="New user">
        <CreateUserForm supervisors={supervisors} />
      </Card>
    </div>
  );
};

export default Page;
