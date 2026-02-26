import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/get-session";
import { getAlarmsByScope } from "@/lib/alarm/alarm-repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import RmpAlarmsClient from "./RmpAlarmsClient";

type SearchParams = { status?: string; criticality?: string };

export default async function RmpAlarmsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: { chainages: { select: { chainageId: true } } },
  });

  const params = await searchParams;
  const filters = {
    status: params.status as
      | "CREATED"
      | "UNASSIGNED"
      | "ASSIGNED"
      | "IN_PROGRESS"
      | "VERIFIED"
      | "FALSE_ALARM"
      | "ESCALATED"
      | "CLOSED"
      | undefined,
    criticality: params.criticality as
      | "LOW"
      | "MEDIUM"
      | "HIGH"
      | "CRITICAL"
      | undefined,
  };

  const alarms = await getAlarmsByScope(user, filters, {
    rmpStatusFilter: true,
  });

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[{ label: "RMP", href: "/rmp" }, { label: "Alarms" }]}
      />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Alarms (your chainages)
      </h1>
      <Card>
        <RmpAlarmsClient alarms={alarms} searchParams={params} />
      </Card>
    </div>
  );
}
