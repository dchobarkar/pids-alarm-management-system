import DashboardShell from "@/components/layout/DashboardShell";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DashboardShell>{children}</DashboardShell>;
};

export default Layout;
