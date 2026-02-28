import type { AlarmsSearchParams } from "@/types/alarm";
import { loadScopedAlarmsForCurrentUser } from "@/api/alarm/loadScopedAlarmsForCurrentUser";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import RmpAlarmsClient from "@/components/dashboard/alarms/RmpAlarmsClient";

type SearchParams = Pick<
  AlarmsSearchParams,
  "status" | "criticality" | "dateFrom" | "dateTo"
>;

const RmpAlarmsPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { user, alarms, params } = await loadScopedAlarmsForCurrentUser(
    searchParams,
    { rmpStatusFilter: true },
  );
  if (!user) return null;

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[{ label: "RMP", href: "/rmp" }, { label: "Alarms" }]}
      />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">
          Alarms (your chainages)
        </h1>
      </div>

      <Card>
        <RmpAlarmsClient alarms={alarms} params={params} />
      </Card>
    </div>
  );
};

export default RmpAlarmsPage;
