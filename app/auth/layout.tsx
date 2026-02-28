import AuthFooter from "@/components/layout/AuthFooter";
import AuthNavbar from "@/components/layout/AuthNavbar";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen flex flex-col bg-(--bg-app)">
      <AuthNavbar />
      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
      <AuthFooter />
    </div>
  );
};

export default AuthLayout;
