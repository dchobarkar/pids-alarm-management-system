import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";

const Page = () => {
  return (
    <div className="p-6">
      <Breadcrumb crumbs={[{ label: "RMP dashboard" }]} />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        RMP dashboard
      </h1>
      <Card title="Welcome">
        <p className="text-(--text-muted)">
          Dashboard placeholder. Field investigation and verification in a later
          phase.
        </p>
      </Card>
    </div>
  );
};

export default Page;
