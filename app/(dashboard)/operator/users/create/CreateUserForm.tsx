"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/lib/generated/prisma";
import { ROLE_OPTIONS } from "@/constants/roles";
import { PATHS } from "@/constants/paths";
import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { createUserAction } from "../actions";

type Props = { supervisors: User[] };

const CreateUserForm = ({ supervisors }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supervisorOptions = [
    { value: "", label: "— None —" },
    ...supervisors.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.email})`,
    })),
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createUserAction(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push(PATHS.operatorUsers);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {error && <Alert variant="error">{error}</Alert>}
      <Input label="Name" name="name" required />

      <Input label="Email" name="email" type="email" required />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        helperText="Min 8 characters"
      />
      <Select label="Role" name="role" options={ROLE_OPTIONS} required />
      <Select
        label="Supervisor"
        name="supervisorId"
        options={supervisorOptions}
      />
      <Input label="Phone" name="phone" />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create user
        </Button>
      </div>
    </form>
  );
};

export default CreateUserForm;
