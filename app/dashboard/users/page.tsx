import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";

// Placeholder data
const users = [
  { name: "Admin User", email: "admin@company.com", role: "Operator" },
  { name: "Jane Supervisor", email: "jane@company.com", role: "Supervisor" },
  { name: "John RMP", email: "john@company.com", role: "RMP" },
];

const UsersPage = () => {
  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Email", accessor: "email" as const },
    { header: "Role", accessor: "role" as const },
  ];

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Users" },
        ]}
      />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Users
      </h1>

      <Card>
        <Table data={users} columns={columns} />
      </Card>
    </div>
  );
};

export default UsersPage;
