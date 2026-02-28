import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { findUserProfileById } from "@/api/user/user.repository";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import ProfileForm from "@/components/formComponents/ProfileForm/ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await findUserProfileById(session.user.id);
  if (!user) redirect("/auth/signin");

  return (
    <div className="p-6">
      <Breadcrumb crumbs={[{ label: "Profile" }]} />
      <h1 className="text-xl font-semibold text-(--text-primary) mb-6">
        Profile
      </h1>
      <Card>
        <ProfileForm
          name={user.name}
          email={user.email}
          phone={user.phone}
        />
      </Card>
    </div>
  );
}
