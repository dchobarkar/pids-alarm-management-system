import DBNavbar from "@/components/layout/DBNavbar";
import Sidebar from "@/components/layout/Sidebar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <DBNavbar />
      <Sidebar />

      {children}
    </>
  );
};

export default Layout;
