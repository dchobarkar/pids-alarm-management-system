import DBNavbar from "@/components/layout/DBNavbar";
import Sidebar from "@/components/layout/Sidebar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen bg-(--bg-app)">
      <DBNavbar />
      <Sidebar />
      <main className="pl-64 pt-14 min-h-screen">{children}</main>
    </div>
  );
};

export default Layout;
