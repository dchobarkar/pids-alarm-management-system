"use client";

import { createUser } from "@/app/actions/users";
import { useState } from "react";

const ROLES = [
  "OPERATOR",
  "SUPERVISOR",
  "NIGHT_SUPERVISOR",
  "RMP",
  "ER",
  "QRV_SUPERVISOR",
] as const;

export function CreateUserForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = await createUser(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setShowForm(false);
    form.reset();
    window.location.reload();
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Add User
        </h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90"
        >
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-[var(--destructive)]/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Name
            </label>
            <input
              name="name"
              required
              className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Role
            </label>
            <select
              name="role"
              required
              className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)]"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Chainage Start (km)
              </label>
              <input
                name="chainageStart"
                type="number"
                step="0.001"
                required
                defaultValue="0"
                className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)]">
                Chainage End (km)
              </label>
              <input
                name="chainageEnd"
                type="number"
                step="0.001"
                required
                defaultValue="100"
                className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[var(--primary)] px-6 py-3 font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      )}
    </div>
  );
}
