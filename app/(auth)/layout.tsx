import AuthFooter from "@/components/layout/AuthFooter";
import AuthNavbar from "@/components/layout/AuthNavbar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex flex-col bg-(--bg-app)">
      <AuthNavbar />
      <div className="flex-1">{children}</div>
      <AuthFooter />
    </div>
  );
};

export default Layout;
