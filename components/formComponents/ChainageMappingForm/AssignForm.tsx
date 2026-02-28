"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/lib/generated/prisma";
import type { Chainage } from "@/lib/generated/prisma";
import type { ChainageMapping } from "@/types/chainage-mapping";
import Button from "@/components/ui/Button";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/Alert";
import { assignChainages } from "./actions";
import ChainageMultiSelect from "@/components/form/MultiSelect";

interface Props {
  users: Pick<User, "id" | "name" | "email" | "role">[];
  chainages: Chainage[];
  mappings: ChainageMapping[];
}

const AssignForm = ({ users, chainages, mappings }: Props) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.email}) — ${u.role}`,
  }));

  const excludedChainageIds = useMemo(
    () =>
      selectedUserId
        ? mappings
            .filter((m) => m.user.id === selectedUserId)
            .map((m) => m.chainage.id)
        : [],
    [mappings, selectedUserId],
  );

  const handleSubmit = async (formData: FormData) => {
    setError("");
    setLoading(true);
    const result = await assignChainages(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  };

  const handleDiscard = () => {
    setError("");
    setSelectedUserId("");
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="User"
          name="userId"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          options={[{ value: "", label: "— Select user —" }, ...userOptions]}
          required
        />

        <div className="space-y-2">
          <label className="text-sm text-(--text-secondary)">Chainages</label>
          <ChainageMultiSelect
            chainages={chainages}
            excludeChainageIds={excludedChainageIds}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={handleDiscard}>
          Discard
        </Button>
        <Button type="submit" loading={loading}>
          Assign
        </Button>
      </div>
    </form>
  );
};

export default AssignForm;
