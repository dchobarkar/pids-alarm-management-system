import DashboardShell from "@/components/layout/DashboardShell";

/** All dashboard pages need DB and auth; do not prerender at build time (no DB in CI). */
export const dynamic = "force-dynamic";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DashboardShell>{children}</DashboardShell>;
};

export default Layout;
