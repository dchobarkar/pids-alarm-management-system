import { getSession } from "@/lib/auth/get-session";
import { getEscalatedAlarms } from "@/api/alarm";
import RoleAlarmsPage from "@/components/dashboard/alarms/RoleAlarmsPage";

const QrvAlarmsPage = async () => {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const alarms = await getEscalatedAlarms();

  return <RoleAlarmsPage role="qrv" alarms={alarms} searchParams={{}} />;
};

export default QrvAlarmsPage;
