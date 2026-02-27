import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import UsersTable from "./UsersTable";
import UserCreateButton from "./UserCreateButton";

const OperatorUsersPage = async () => {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    include: {
      supervisor: { select: { id: true, name: true, email: true } },
    },
  });
  const supervisors = await prisma.user.findMany({
    where: {
      role: { in: ["SUPERVISOR", "NIGHT_SUPERVISOR", "QRV_SUPERVISOR"] },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[{ label: "Operator", href: "/operator" }, { label: "Users" }]}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">Users</h1>
        <UserCreateButton supervisors={supervisors} />
      </div>
      <Card>
        <UsersTable users={users} supervisors={supervisors} />
      </Card>
    </div>
  );
};

export default OperatorUsersPage;