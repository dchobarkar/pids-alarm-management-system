import Link from "next/link";
import { redirect } from "next/navigation";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { SUPERVISOR_ROLES } from "@/constants/roles";
import { PATHS } from "@/constants/paths";
import UserDetailClient from "./UserDetailClient";
import {
  findUserByIdWithSupervisor,
  findUsersByRoles,
} from "@/api/user/user.repository";

type Props = { params: Promise<{ userId: string }> };

const Page = async ({ params }: Props) => {
  const { userId } = await params;
  const [user, supervisors] = await Promise.all([
    findUserByIdWithSupervisor(userId),
    findUsersByRoles(SUPERVISOR_ROLES),
  ]);

  if (!user) redirect(PATHS.operatorUsers);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumb
          crumbs={[
            { label: "Operator", href: "/operator" },
            { label: "Users", href: PATHS.operatorUsers },
            { label: user.name },
          ]}
        />
        <Link href={PATHS.operatorUsers}>
          <Button variant="secondary">Back to users</Button>
        </Link>
      </div>

      <h1 className="text-xl font-semibold text-(--text-primary) mb-4">
        User details
      </h1>

      <div className="space-y-4">
        <Card>
          <dl className="grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
            <dt className="font-medium text-(--text-secondary)">Name</dt>
            <dd className="text-(--text-primary)">{user.name}</dd>

            <dt className="font-medium text-(--text-secondary)">Email</dt>
            <dd className="text-(--text-primary)">{user.email}</dd>

            <dt className="font-medium text-(--text-secondary)">Role</dt>
            <dd className="text-(--text-primary)">
              {user.role.replace(/_/g, " ")}
            </dd>

            <dt className="font-medium text-(--text-secondary)">Supervisor</dt>
            <dd className="text-(--text-primary)">
              {user.supervisor ? user.supervisor.name : "—"}
            </dd>

            <dt className="font-medium text-(--text-secondary)">Phone</dt>
            <dd className="text-(--text-primary)">{user.phone ?? "—"}</dd>
          </dl>
        </Card>

        <UserDetailClient user={user} supervisors={supervisors} />
      </div>
    </div>
  );
};

export default Page;
