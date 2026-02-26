"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/lib/generated/prisma";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/Alert";
import { createUser } from "./actions";

const ROLE_OPTIONS = [
  { value: "OPERATOR", label: "Operator" },
  { value: "SUPERVISOR", label: "Supervisor" },
  { value: "NIGHT_SUPERVISOR", label: "Night Supervisor" },
  { value: "RMP", label: "RMP" },
  { value: "ER", label: "ER" },
  { value: "QRV_SUPERVISOR", label: "QRV Supervisor" },
];

const UserCreateButton = ({ supervisors }: { supervisors: User[] }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supervisorOptions = [
    { value: "", label: "— None —" },
    ...supervisors.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.email})`,
    })),
  ];

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const result = await createUser(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>New user</Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setError("");
        }}
        title="New user"
      >
        {error && (
          <Alert variant="error" className="mb-3">
            {error}
          </Alert>
        )}
        <form action={handleSubmit} className="space-y-3">
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
          <div className="flex gap-2 pt-2">
            <Button type="submit" loading={loading}>
              Create
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UserCreateButton;
