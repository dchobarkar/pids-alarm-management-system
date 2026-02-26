import Link from "next/link";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Table from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

// Placeholder data
const alarms = [
  { id: "A-001", chainage: "12.4 km", severity: "high", status: "assigned" },
  {
    id: "A-002",
    chainage: "8.1 km",
    severity: "medium",
    status: "investigating",
  },
  { id: "A-003", chainage: "22.0 km", severity: "low", status: "created" },
];

const AlarmsPage = () => {
  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Chainage", accessor: "chainage" as const },
    {
      header: "Severity",
      accessor: "severity" as const,
      render: (row: (typeof alarms)[0]) => (
        <Badge variant={row.severity as "high" | "medium" | "low"}>
          {row.severity}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessor: "status" as const,
      render: (row: (typeof alarms)[0]) => (
        <Badge variant={row.status as "created" | "assigned" | "investigating"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Alarms" },
        ]}
      />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">Alarms</h1>
        <Link href="/dashboard/alarms/new">
          <Button>New alarm</Button>
        </Link>
      </div>

      <Card>
        <Table data={alarms} columns={columns} />
      </Card>
    </div>
  );
};

export default AlarmsPage;
