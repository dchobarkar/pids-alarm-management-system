import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";

// Placeholder data
const assignments = [
  { id: "A-001", assignee: "J. Smith", status: "assigned", due: "Today" },
  {
    id: "A-002",
    assignee: "M. Jones",
    status: "investigating",
    due: "Tomorrow",
  },
];

const AssignmentsPage = () => {
  const columns = [
    { header: "Alarm ID", accessor: "id" as const },
    { header: "Assignee", accessor: "assignee" as const },
    {
      header: "Status",
      accessor: "status" as const,
      render: (row: (typeof assignments)[0]) => (
        <Badge variant={row.status as "assigned" | "investigating"}>
          {row.status}
        </Badge>
      ),
    },
    { header: "Due", accessor: "due" as const },
  ];

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Assignments" },
        ]}
      />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Assignments
      </h1>

      <Card>
        <Table data={assignments} columns={columns} />
      </Card>
    </div>
  );
};

export default AssignmentsPage;
