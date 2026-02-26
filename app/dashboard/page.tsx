import Link from "next/link";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const stats = [
  {
    label: "Open alarms",
    value: "12",
    variant: "high" as const,
    href: "/dashboard/alarms",
  },
  {
    label: "Assigned",
    value: "8",
    variant: "assigned" as const,
    href: "/dashboard/assignments",
  },
  {
    label: "Under investigation",
    value: "5",
    variant: "investigating" as const,
    href: "/dashboard/alarms",
  },
  {
    label: "Closed today",
    value: "3",
    variant: "closed" as const,
    href: "/dashboard/alarms",
  },
];

const Page = () => {
  return (
    <div className="p-6">
      <Breadcrumb crumbs={[{ label: "Dashboard" }]} />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:border-(--border-strong) transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-sm text-(--text-secondary)">
                  {s.label}
                </span>
                <Badge variant={s.variant}>{s.value}</Badge>
              </div>
              <p className="text-2xl font-semibold text-(--text-primary) mt-2">
                {s.value}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <Card
        title="Recent activity"
        action={
          <Link href="/dashboard/alarms">
            <Button variant="ghost" className="text-xs">
              View all
            </Button>
          </Link>
        }
      >
        <p className="text-(--text-muted)">
          No recent alarms. Alarms will appear here once created.
        </p>
      </Card>
    </div>
  );
};

export default Page;
