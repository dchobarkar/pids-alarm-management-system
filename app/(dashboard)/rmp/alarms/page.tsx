import {
  loadScopedAlarmsForCurrentUser,
  type AlarmsSearchParams,
} from "@/lib/alarm/loadScopedAlarmsForCurrentUser";
import RoleAlarmsPage from "@/components/dashboard/alarms/RoleAlarmsPage";

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

  return <RoleAlarmsPage role="rmp" alarms={alarms} searchParams={params} />;
};

export default RmpAlarmsPage;
