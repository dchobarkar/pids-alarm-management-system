import Breadcrumb from "@/components/ui/Breadcrumb";
import ProfileContent from "./ProfileContent";

const ProfilePage = () => {
  return (
    <div className="p-6">
      <Breadcrumb crumbs={[{ label: "Profile" }]} />
      <ProfileContent />
    </div>
  );
};

export default ProfilePage;
