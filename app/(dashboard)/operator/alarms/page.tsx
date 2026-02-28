import Link from "next/link";

import type { AlarmsSearchParams } from "@/types/alarm";
import { loadScopedAlarmsForCurrentUser } from "@/api/alarm/loadScopedAlarmsForCurrentUser";
import OperatorAlarmsFilters from "@/components/alarms/OperatorAlarmsFilters";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import { PATHS } from "@/constants/paths";
import { getOperatorAlarmsColumns } from "@/config/operator-alarms-columns";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<AlarmsSearchParams>;
}) => {
  const { user, alarms, params } =
    await loadScopedAlarmsForCurrentUser(searchParams);

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <Breadcrumb
          crumbs={[
            { label: "Operator", href: "/operator" },
            { label: "Alarms" },
          ]}
        />

        <Link href={PATHS.operatorAlarmsCreate}>
          <Button>Create alarm</Button>
        </Link>
      </div>

      <Card>
        <div className="space-y-5">
          <OperatorAlarmsFilters
            basePath={PATHS.operatorAlarms}
            params={params}
          />

          {alarms.length === 0 ? (
            <p className="mt-4 py-4 text-(--text-muted)">
              No alarms match the filters.
            </p>
          ) : (
            <Table
              data={alarms}
              columns={getOperatorAlarmsColumns(PATHS.operatorAlarms)}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Page;
