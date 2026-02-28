import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import { prisma } from "@/api/db";
import AssignForm from "@/components/formComponents/ChainageMappingForm/AssignForm";
import MappingsList from "./MappingsList";
import MappedByChainage from "./MappedByChainage";

export default async function OperatorChainageMappingPage() {
  const [users, chainages, mappings, chainagesWithUsers] = await Promise.all([
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.chainage.findMany({ orderBy: { startKm: "asc" } }),
    prisma.chainageUser.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        chainage: {
          select: { id: true, label: true, startKm: true, endKm: true },
        },
      },
    }),
    prisma.chainage.findMany({
      orderBy: { startKm: "asc" },
      include: {
        users: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    }),
  ]);

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Operator", href: "/operator" },
          { label: "Chainage mapping" },
        ]}
      />

      <Card title="Assign user to chainage(s)" className="mb-6">
        <AssignForm users={users} chainages={chainages} />
      </Card>

      <Card title="Current mappings" className="mb-6">
        <MappingsList mappings={mappings} />
      </Card>

      <Card title="Mapped users per chainage">
        <MappedByChainage chainages={chainagesWithUsers} />
      </Card>
    </div>
  );
}
