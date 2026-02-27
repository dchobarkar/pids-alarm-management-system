import Link from "next/link";
import { redirect } from "next/navigation";

import Button from "@/components/ui/Button";
import { auth } from "@/lib/auth";
import { getDashboardPathForRole } from "@/lib/auth/auth-options";
import type { Role } from "@/lib/generated/prisma";

const Page = async () => {
  const session = await auth();

  if (session?.user?.role) {
    const role = session.user.role as Role;
    const dashboardPath = getDashboardPathForRole(role);
    redirect(dashboardPath);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-(--bg-app)">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
          PIDS Alarm Management System
        </h1>

        <p className="text-(--text-secondary) mb-8">
          Territory-mapped alarm dispatch and field investigation platform for
          pipeline intrusion detection operations.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/auth/signin">
            <Button>Sign in</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="secondary">Create account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
