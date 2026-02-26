import { getSession } from "@/lib/auth/get-session";
import { getRmpAssignments } from "@/lib/assignment/assignment-repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import RmpTasksClient from "./RmpTasksClient";

export default async function RmpTasksPage() {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const assignments = await getRmpAssignments(session.user.id);

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[{ label: "RMP", href: "/rmp" }, { label: "Tasks" }]}
      />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        My assignments
      </h1>
      <Card>
        <RmpTasksClient assignments={assignments} />
      </Card>
    </div>
  );
}
