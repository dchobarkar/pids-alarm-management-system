import Breadcrumb from "@/components/ui/Breadcrumb";

const Page = () => {
  return (
    <div className="p-6">
      <Breadcrumb crumbs={[{ label: "QRV dashboard" }]} />
      <h1 className="text-xl font-semibold text-(--text-primary)">
        QRV Supervisor dashboard
      </h1>
      <p className="text-(--text-secondary) mt-2">
        Manage escalated alarms from the Alarms page.
      </p>
    </div>
  );
};

export default Page;
