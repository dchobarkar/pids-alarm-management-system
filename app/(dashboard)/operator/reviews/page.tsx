import { getSession } from "@/lib/auth/get-session";
import { getAlarmsPendingReview } from "@/lib/verification/verification-repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import ReviewQueueClient from "./ReviewQueueClient";

export default async function OperatorReviewsPage() {
  const session = await getSession();
  if (!session?.user?.id) return null;

  const alarms = await getAlarmsPendingReview();

  return (
    <div className="p-6">
      <Breadcrumb
        crumbs={[
          { label: "Operator", href: "/operator" },
          { label: "Reviews" },
        ]}
      />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Verification review queue
      </h1>
      <Card>
        <ReviewQueueClient alarms={alarms} />
      </Card>
    </div>
  );
}
