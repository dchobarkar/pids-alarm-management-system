import AuthFooter from "@/components/layout/AuthFooter";
import AuthNavbar from "@/components/layout/AuthNavbar";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <AuthNavbar />
      {children}
      <AuthFooter />
    </>
  );
};

export default Layout;
