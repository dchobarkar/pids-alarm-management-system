import { getSession } from "@/lib/auth/get-session";
import { findEscalatedAlarms } from "@/api/alarm/alarm.repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import QrvAlarmsClient from "@/components/dashboard/alarms/QrvAlarmsClient";

const QrvAlarmsPage = async () => {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const alarms = await findEscalatedAlarms();

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[{ label: "QRV", href: "/qrv" }, { label: "Alarms" }]}
      />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">
          Escalated alarms
        </h1>
      </div>

      <Card>
        {alarms.length === 0 ? (
          <p className="py-4 text-(--text-muted)">No escalated alarms.</p>
        ) : (
          <QrvAlarmsClient alarms={alarms} />
        )}
      </Card>
    </div>
  );
};

export default QrvAlarmsPage;
