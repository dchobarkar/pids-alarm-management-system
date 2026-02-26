"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/lib/generated/prisma";
import type { Chainage } from "@/lib/generated/prisma";
import Button from "@/components/ui/Button";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/Alert";
import { assignChainages } from "./actions";

interface Props {
  users: Pick<User, "id" | "name" | "email" | "role">[];
  chainages: Chainage[];
}

const AssignForm = ({ users, chainages }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.email}) — ${u.role}`,
  }));

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const result = await assignChainages(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="User"
          name="userId"
          options={[{ value: "", label: "— Select user —" }, ...userOptions]}
          required
        />
        <div className="space-y-2">
          <label className="text-sm text-(--text-secondary)">Chainages</label>
          <div className="border border-(--border-default) rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
            {chainages.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="chainageIds"
                  value={c.id}
                  className="rounded"
                />
                <span className="text-(--text-primary)">
                  {c.label} ({c.startKm}–{c.endKm} km)
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <Button type="submit" loading={loading}>
        Assign
      </Button>
    </form>
  );
};

export default AssignForm;
