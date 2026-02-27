import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import CreateAlarmForm from "../../../../../components/formComponents/CreateAlarmForm/CreateAlarmForm";

const Page = () => {
  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Operator", href: "/operator" },
          { label: "Alarms", href: "/operator/alarms" },
          { label: "Create" },
        ]}
      />

      <Card title="New alarm">
        <p className="text-(--text-secondary) text-sm mb-4">
          Chainage is derived automatically from the chainage value (must fall
          within an existing range).
        </p>
        <CreateAlarmForm />
      </Card>
    </div>
  );
};

export default Page;
