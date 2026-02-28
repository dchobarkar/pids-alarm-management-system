import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import { prisma } from "@/api/db";
import ChainagesTable from "./ChainagesTable";
import ChainageCreateButton from "@/components/formComponents/CreateChainageForm/form";

const Page = async () => {
  const chainages = await prisma.chainage.findMany({
    orderBy: { startKm: "asc" },
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumb
          crumbs={[
            { label: "Operator", href: "/operator" },
            { label: "Chainages" },
          ]}
        />
        <ChainageCreateButton />
      </div>

      <Card>
        <ChainagesTable chainages={chainages} />
      </Card>
    </div>
  );
};

export default Page;
