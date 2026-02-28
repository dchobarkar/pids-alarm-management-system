import type { RoleAlarmsPageProps } from "@/types/dashboard";
import { ROLE_ALARMS_CONFIG } from "@/constants/dashboard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import SupervisorAlarmsClient from "./SupervisorAlarmsClient";

const RoleAlarmsPage = ({
  role,
  alarms,
  searchParams,
}: RoleAlarmsPageProps) => {
  const cfg = ROLE_ALARMS_CONFIG[role];

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: cfg.breadcrumbLabel, href: cfg.breadcrumbHref },
          { label: "Alarms" },
        ]}
      />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">
          {cfg.title}
        </h1>
      </div>
      <Card>
        {role === "supervisor" && (
          <SupervisorAlarmsClient
            alarms={alarms}
            searchParams={{
              status: searchParams.status,
              criticality: searchParams.criticality,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default RoleAlarmsPage;
