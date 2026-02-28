import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import { findUsersForSelect } from "@/api/user/user.repository";
import {
  findChainages,
  findChainagesWithUsers,
} from "@/api/chainage/chainage.repository";
import { findChainageUsersWithDetails } from "@/api/chainage-user/chainage-user.repository";
import AssignForm from "@/components/formComponents/ChainageMappingForm/AssignForm";
import MappingsList from "./MappingsList";
import MappedByChainage from "./MappedByChainage";

export default async function OperatorChainageMappingPage() {
  const [users, chainages, mappings, chainagesWithUsers] = await Promise.all([
    findUsersForSelect(),
    findChainages(),
    findChainageUsersWithDetails(),
    findChainagesWithUsers(),
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
