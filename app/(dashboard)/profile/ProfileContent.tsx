"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import Card from "@/components/ui/Card";
import ProfileForm from "@/components/formComponents/ProfileForm/ProfileForm";
import { getProfileForCurrentUser } from "@/components/formComponents/ProfileForm/actions";
import { AUTH_SIGN_IN_PATH } from "@/constants/auth";
import type { UserWithSupervisor } from "@/types/user";

const formatRole = (role: string) => role.replace(/_/g, " ");

const ProfileContent = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserWithSupervisor | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect(AUTH_SIGN_IN_PATH);
      return;
    }
    if (status !== "authenticated" || !session?.user?.id) return;

    const load = async () => {
      setLoading(true);
      setLoadError(null);
      const { user: profileUser, error } = await getProfileForCurrentUser();
      setLoading(false);
      if (error) setLoadError(error);
      else if (profileUser) setUser(profileUser);
    };

    load();
  }, [status, session?.user?.id]);

  if (status === "loading" || loading) {
    return <p className="text-(--text-muted) py-4">Loading profile…</p>;
  }

  if (loadError || !user) {
    return (
      <p className="text-(--text-muted) py-4">
        {loadError ?? "Could not load profile."}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-xl font-semibold text-(--text-primary) mb-4">
        Profile details
      </h1>

      <Card className="mb-6">
        <dl className="grid gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
          <dt className="font-medium text-(--text-secondary)">Name</dt>
          <dd className="text-(--text-primary)">{user.name}</dd>

          <dt className="font-medium text-(--text-secondary)">Email</dt>
          <dd className="text-(--text-primary)">{user.email}</dd>

          <dt className="font-medium text-(--text-secondary)">Role</dt>
          <dd className="text-(--text-primary)">{formatRole(user.role)}</dd>

          <dt className="font-medium text-(--text-secondary)">Supervisor</dt>
          <dd className="text-(--text-primary)">
            {user.supervisor ? user.supervisor.name : "—"}
          </dd>

          <dt className="font-medium text-(--text-secondary)">Phone</dt>
          <dd className="text-(--text-primary)">{user.phone ?? "—"}</dd>
        </dl>
      </Card>

      <Card>
        <ProfileForm user={user} />
      </Card>
    </div>
  );
};

export default ProfileContent;
