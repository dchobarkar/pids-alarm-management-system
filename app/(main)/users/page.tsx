import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canManageUsers } from "@/lib/rbac";
import { redirect } from "next/navigation";
import { UserTable } from "./UserTable";
import { CreateUserForm } from "./CreateUserForm";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || !canManageUsers(session.user.role)) {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      chainageStart: true,
      chainageEnd: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          User Management
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Create and manage users
        </p>
      </div>

      <CreateUserForm />

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Users
          </h2>
        </div>
        <UserTable users={users} />
      </div>
    </div>
  );
}
