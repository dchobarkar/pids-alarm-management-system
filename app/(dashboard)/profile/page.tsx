import { redirect } from "next/navigation";
import { findUserProfileById } from "@/api/user/user.repository";
import { AUTH_SIGN_IN_PATH } from "@/constants/auth";
import { getSession } from "@/lib/auth/get-session";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Card from "@/components/ui/Card";
import ProfileForm from "@/components/formComponents/ProfileForm/ProfileForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user?.id) redirect(AUTH_SIGN_IN_PATH);

  const user = await findUserProfileById(session.user.id);
  if (!user) redirect(AUTH_SIGN_IN_PATH);

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
