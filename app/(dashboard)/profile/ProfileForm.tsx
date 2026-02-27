"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "./actions";
import Alert from "@/components/ui/Alert";

type Props = {
  name: string;
  email: string;
  phone: string | null;
};

export default function ProfileForm({ name, email, phone }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    setSubmitting(false);
    if (result.success) {
      setSuccess(true);
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="error">{error}</Alert>
      )}
      {success && (
        <Alert variant="info">Profile updated successfully.</Alert>
      )}

      <div>
        <label htmlFor="profile-name" className="block text-sm font-medium text-(--text-secondary) mb-1">
          Name
        </label>
        <input
          id="profile-name"
          type="text"
          name="name"
          defaultValue={name}
          required
          className="w-full max-w-md bg-(--bg-surface) border border-(--border-default) rounded px-3 py-2 text-sm text-(--text-primary)"
        />
      </div>

      <div>
        <label htmlFor="profile-email" className="block text-sm font-medium text-(--text-secondary) mb-1">
          Email
        </label>
        <input
          id="profile-email"
          type="email"
          value={email}
          readOnly
          className="w-full max-w-md bg-(--bg-muted) border border-(--border-default) rounded px-3 py-2 text-sm text-(--text-muted) cursor-not-allowed"
          tabIndex={-1}
          aria-readonly
        />
        <p className="mt-1 text-xs text-(--text-muted)">Email cannot be changed here.</p>
      </div>

      <div>
        <label htmlFor="profile-phone" className="block text-sm font-medium text-(--text-secondary) mb-1">
          Phone
        </label>
        <input
          id="profile-phone"
          type="tel"
          name="phone"
          defaultValue={phone ?? ""}
          className="w-full max-w-md bg-(--bg-surface) border border-(--border-default) rounded px-3 py-2 text-sm text-(--text-primary)"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 text-sm font-medium bg-(--brand-primary) text-white rounded-md hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
