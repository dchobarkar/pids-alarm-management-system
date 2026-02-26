import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/db";
import ChainagesTable from "./ChainagesTable";
import ChainageCreateButton from "./ChainageCreateButton";

export default async function OperatorChainagesPage() {
  const chainages = await prisma.chainage.findMany({
    orderBy: { startKm: "asc" },
  });

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Operator", href: "/operator" },
          { label: "Chainages" },
        ]}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">
          Chainages
        </h1>
        <ChainageCreateButton />
      </div>
      <Card>
        <ChainagesTable chainages={chainages} />
      </Card>
    </div>
  );
}
