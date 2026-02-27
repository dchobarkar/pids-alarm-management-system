import { getSession } from "@/lib/auth/get-session";
import { getEscalatedAlarms } from "@/lib/alarm/alarm-repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import QrvAlarmsClient from "./QrvAlarmsClient";

const QrvAlarmsPage = async () => {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const alarms = await getEscalatedAlarms();

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[{ label: "QRV", href: "/qrv" }, { label: "Alarms" }]}
      />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Escalated alarms
      </h1>
      <Card>
        <QrvAlarmsClient alarms={alarms} />
      </Card>
    </div>
  );
};

export default QrvAlarmsPage;