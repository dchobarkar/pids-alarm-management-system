import {
  loadScopedAlarmsForCurrentUser,
  type AlarmsSearchParams,
} from "@/app/(dashboard)/_shared/alarms/loadScopedAlarmsForCurrentUser";
import RoleAlarmsPage from "@/components/dashboard/alarms/RoleAlarmsPage";

type SearchParams = AlarmsSearchParams;

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { user, alarms, params } =
    await loadScopedAlarmsForCurrentUser(searchParams);
  if (!user) return null;

  return (
    <RoleAlarmsPage role="operator" alarms={alarms} searchParams={params} />
  );
};

export default Page;
