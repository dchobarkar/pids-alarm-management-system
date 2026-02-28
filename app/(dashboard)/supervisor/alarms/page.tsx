import type { AlarmsSearchParams } from "@/types/alarm";
import { loadScopedAlarmsForCurrentUser } from "@/api/alarm/loadScopedAlarmsForCurrentUser";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import SupervisorAlarmsClient from "@/components/dashboard/alarms/SupervisorAlarmsClient";

type SearchParams = Pick<
  AlarmsSearchParams,
  "status" | "criticality" | "dateFrom" | "dateTo"
>;

const SupervisorAlarmsPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { user, alarms, params } =
    await loadScopedAlarmsForCurrentUser(searchParams);
  if (!user) return null;

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Supervisor", href: "/supervisor" },
          { label: "Alarms" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">
          Alarms (your chainages)
        </h1>
      </div>

      <Card>
        <SupervisorAlarmsClient alarms={alarms} params={params} />
      </Card>
    </div>
  );
};

export default SupervisorAlarmsPage;
