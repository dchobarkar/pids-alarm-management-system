import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";

const Page = () => {
  return (
    <div className="p-6">
      <Breadcrumb crumbs={[{ label: "Operator dashboard" }]} />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Operator dashboard
      </h1>
      <Card title="Welcome">
        <p className="text-(--text-muted)">
          Manage users, chainages, and chainage mapping from the sidebar.
        </p>
      </Card>
    </div>
  );
};

export default Page;
