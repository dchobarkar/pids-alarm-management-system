import Link from "next/link";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { AlarmWithRelations } from "@/lib/scope/alarm-scope";
import type { AlarmsSearchParams } from "@/lib/alarm/loadScopedAlarmsForCurrentUser";
import OperatorAlarmsTable from "./OperatorAlarmsTable";
import SupervisorAlarmsClient from "./SupervisorAlarmsClient";
import RmpAlarmsClient from "./RmpAlarmsClient";
import QrvAlarmsClient from "./QrvAlarmsClient";

type RoleKey = "operator" | "supervisor" | "rmp" | "qrv";

interface RoleAlarmsPageProps {
  role: RoleKey;
  alarms: AlarmWithRelations[];
  searchParams: AlarmsSearchParams;
}

const ROLE_CONFIG: Record<
  RoleKey,
  {
    breadcrumbLabel: string;
    breadcrumbHref: string;
    title: string;
  }
> = {
  operator: {
    breadcrumbLabel: "Operator",
    breadcrumbHref: "/operator",
    title: "Alarms",
  },
  supervisor: {
    breadcrumbLabel: "Supervisor",
    breadcrumbHref: "/supervisor",
    title: "Alarms (your chainages)",
  },
  rmp: {
    breadcrumbLabel: "RMP",
    breadcrumbHref: "/rmp",
    title: "Alarms (your chainages)",
  },
  qrv: {
    breadcrumbLabel: "QRV",
    breadcrumbHref: "/qrv",
    title: "Escalated alarms",
  },
};

const RoleAlarmsPage = ({
  role,
  alarms,
  searchParams,
}: RoleAlarmsPageProps) => {
  const cfg = ROLE_CONFIG[role];

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: cfg.breadcrumbLabel, href: cfg.breadcrumbHref },
          { label: "Alarms" },
        ]}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">
          {cfg.title}
        </h1>
        {role === "operator" && (
          <Link href="/operator/alarms/create">
            <Button>Create alarm</Button>
          </Link>
        )}
      </div>
      <Card>
        {role === "operator" && (
          <OperatorAlarmsTable
            alarms={alarms}
            searchParams={searchParams}
            basePath="/operator/alarms"
          />
        )}
        {role === "supervisor" && (
          <SupervisorAlarmsClient
            alarms={alarms}
            searchParams={{
              status: searchParams.status,
              criticality: searchParams.criticality,
            }}
          />
        )}
        {role === "rmp" && (
          <RmpAlarmsClient
            alarms={alarms}
            searchParams={{
              status: searchParams.status,
              criticality: searchParams.criticality,
            }}
          />
        )}
        {role === "qrv" && <QrvAlarmsClient alarms={alarms} />}
      </Card>
    </div>
  );
};

export default RoleAlarmsPage;
