import Link from "next/link";

import type { UserWithSupervisor } from "@/types/user";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { findUsers } from "@/api/user/user.repository";
import { PATHS } from "@/constants/paths";
import { getOperatorUsersColumns } from "@/config/operator-users-columns";

const Page = async () => {
  const users = await findUsers({ includeSupervisor: true });
  const userList = users as UserWithSupervisor[];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumb
          crumbs={[
            { label: "Operator", href: "/operator" },
            { label: "Users" },
          ]}
        />

        <Link href={PATHS.operatorUsersCreate}>
          <Button>Create user</Button>
        </Link>
      </div>

      <Card>
        {userList.length === 0 ? (
          <p className="py-4 text-(--text-muted)">
            No users yet. Create one to get started.
          </p>
        ) : (
          <Table
            data={userList}
            columns={getOperatorUsersColumns(PATHS.operatorUsers)}
          />
        )}
      </Card>
    </div>
  );
};

export default Page;
