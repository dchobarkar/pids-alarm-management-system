import Link from "next/link";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/get-session";
import { getAlarmsByScope } from "@/lib/alarm/alarm-repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import OperatorAlarmsTable from "./OperatorAlarmsTable";

type SearchParams = {
  status?: string;
  criticality?: string;
  dateFrom?: string;
  dateTo?: string;
};

export default async function OperatorAlarmsPage({
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
    dateFrom: params.dateFrom ? new Date(params.dateFrom) : undefined,
    dateTo: params.dateTo ? new Date(params.dateTo) : undefined,
  };

  const alarms = await getAlarmsByScope(user, filters);

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[{ label: "Operator", href: "/operator" }, { label: "Alarms" }]}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">Alarms</h1>
        <Link href="/operator/alarms/create">
          <Button>Create alarm</Button>
        </Link>
      </div>
      <Card>
        <OperatorAlarmsTable alarms={alarms} searchParams={params} />
      </Card>
    </div>
  );
}
