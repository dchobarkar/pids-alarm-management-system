import { getSession } from "@/lib/auth/get-session";
import { findRmpAssignments } from "@/api/assignment/assignment.repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import RmpTasksClient from "./RmpTasksClient";

type Props = { searchParams: Promise<{ verification_submitted?: string }> };

const Page = async ({ searchParams }: Props) => {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const params = await searchParams;
  const assignments = await findRmpAssignments(session.user.id);

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[{ label: "RMP", href: "/rmp" }, { label: "Tasks" }]}
      />
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-(--text-primary)">
          My assignments
        </h1>
      </div>
      <Card>
        <RmpTasksClient
          assignments={assignments}
          showVerificationSubmittedMessage={
            params.verification_submitted === "1"
          }
        />
      </Card>
    </div>
  );
};

export default Page;
