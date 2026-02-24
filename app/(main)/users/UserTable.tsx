"use client";

import { useState } from "react";
import { updateUser } from "@/app/actions/users";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  chainageStart: { toString: () => string };
  chainageEnd: { toString: () => string };
  createdAt: Date;
};

const ROLES = [
  "OPERATOR",
  "SUPERVISOR",
  "NIGHT_SUPERVISOR",
  "RMP",
  "ER",
  "QRV_SUPERVISOR",
] as const;

export function UserTable({ users }: { users: User[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, userId: string) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = await updateUser(userId, formData);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setEditingId(null);
    window.location.reload();
  }

  if (users.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-[var(--muted)]">
        No users yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--secondary)]">
            <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
              Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
              Email
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
              Role
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-[var(--foreground)]">
              Chainage
            </th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-[var(--secondary)]/50">
              {editingId === user.id ? (
                <td colSpan={5} className="px-6 py-4">
                  <form
                    onSubmit={(e) => handleSubmit(e, user.id)}
                    className="space-y-4"
                  >
                    {error && (
                      <p className="text-sm text-red-400">{error}</p>
                    )}
                    <div className="grid gap-4 sm:grid-cols-4">
                      <input
                        name="name"
                        defaultValue={user.name}
                        required
                        className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm"
                      />
                      <input
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm opacity-60"
                      />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <input
                          name="chainageStart"
                          type="number"
                          step="0.001"
                          defaultValue={Number(user.chainageStart.toString())}
                          className="w-24 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm"
                        />
                        <span className="self-center">-</span>
                        <input
                          name="chainageEnd"
                          type="number"
                          step="0.001"
                          defaultValue={Number(user.chainageEnd.toString())}
                          className="w-24 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        name="password"
                        type="password"
                        placeholder="New password (optional)"
                        minLength={8}
                        className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm w-48"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)]"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </td>
              ) : (
                <>
                  <td className="px-6 py-4 text-sm">{user.name}</td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.role}</td>
                  <td className="px-6 py-4 text-sm">
                    {Number(user.chainageStart).toFixed(3)} -{" "}
                    {Number(user.chainageEnd).toFixed(3)} km
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setEditingId(user.id)}
                      className="text-sm font-medium text-[var(--primary)] hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
