import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";

const SupervisorDashboardPage = () => {
  return (
    <div className="p-6">
      <Breadcrumb crumbs={[{ label: "Supervisor dashboard" }]} />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Supervisor dashboard
      </h1>
      <Card title="Welcome">
        <p className="text-(--text-muted)">
          Dashboard placeholder. Alarm assignment and monitoring in a later
          phase.
        </p>
      </Card>
    </div>
  );
};

export default SupervisorDashboardPage;
