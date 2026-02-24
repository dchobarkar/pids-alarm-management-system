import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";

const ReportsPage = () => {
  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Reports" },
        ]}
      />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Reports
      </h1>

      <Card title="Investigation reports">
        <p className="text-(--text-muted)">
          Field investigation reports will be listed here. Export and filters
          coming soon.
        </p>
      </Card>
    </div>
  );
};

export default ReportsPage;
