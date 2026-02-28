import type {
  ChainageMapping,
  ChainageWithUsers,
} from "@/types/chainage-mapping";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import AssignForm from "@/components/formComponents/ChainageMappingForm/AssignForm";
import { findUsersForSelect } from "@/api/user/user.repository";
import { findChainageUsersWithDetails } from "@/api/chainage-user/chainage-user.repository";
import MappingsList from "./MappingsList";
import MappedByChainage from "./MappedByChainage";
import {
  findChainages,
  findChainagesWithUsers,
} from "@/api/chainage/chainage.repository";

const sortMappingsByChainage = (
  mappings: ChainageMapping[],
): ChainageMapping[] =>
  [...mappings].sort((a, b) => {
    const cmp = a.chainage.startKm - b.chainage.startKm;
    if (cmp !== 0) return cmp;
    return a.chainage.label.localeCompare(b.chainage.label);
  });

const OperatorChainageMappingPage = async () => {
  const [users, chainages, mappingsRaw, chainagesWithUsers] = await Promise.all(
    [
      findUsersForSelect(),
      findChainages(),
      findChainageUsersWithDetails(),
      findChainagesWithUsers(),
    ],
  );
  const mappings = sortMappingsByChainage(
    mappingsRaw as unknown as ChainageMapping[],
  );

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Operator", href: "/operator" },
          { label: "Chainage mapping" },
        ]}
      />

      <Card title="Assign user to chainage(s)" className="mb-6">
        <AssignForm users={users} chainages={chainages} mappings={mappings} />
      </Card>

      <Card title="Current mappings" className="mb-6">
        <MappingsList mappings={mappings} />
      </Card>

      <Card title="Mapped users per chainage">
        <MappedByChainage
          chainages={chainagesWithUsers as ChainageWithUsers[]}
        />
      </Card>
    </div>
  );
};

export default OperatorChainageMappingPage;
