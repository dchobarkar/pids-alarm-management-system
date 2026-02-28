"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/lib/generated/prisma";
import type { UserWithSupervisor } from "@/types/user";
import { ROLE_OPTIONS } from "@/constants/roles";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/form/Input";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/Alert";
import { updateUserAction, deleteUserAction } from "./actions";

interface Props {
  users: UserWithSupervisor[];
  supervisors: User[];
}

const UsersTable = ({ users, supervisors }: Props) => {
  const router = useRouter();
  const [editing, setEditing] = useState<UserWithSupervisor | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supervisorOptions = [
    { value: "", label: "— None —" },
    ...supervisors.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.email})`,
    })),
  ];

  async function handleUpdateSubmit(formData: FormData) {
    if (!editing) return;
    setError("");
    setLoading(true);
    const result = await updateUserAction(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setEditing(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    await deleteUserAction(id);
    router.refresh();
  }

  const columns = [
    { header: "Name", accessor: "name" as const },
    { header: "Email", accessor: "email" as const },
    {
      header: "Role",
      accessor: "role" as const,
      render: (row: UserWithSupervisor) => (
        <span className="text-(--text-secondary)">
          {row.role.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      header: "Supervisor",
      accessor: "supervisorId" as const,
      render: (row: UserWithSupervisor) =>
        row.supervisor ? row.supervisor.name : "—",
    },
    {
      header: "Actions",
      accessor: "id" as const,
      render: (row: UserWithSupervisor) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(row)}
            className="text-sm text-(--brand-primary) hover:underline"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            className="text-sm text-(--alarm-critical) hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {users.length > 0 ? (
        <Table data={users} columns={columns} />
      ) : (
        <p className="text-(--text-muted) py-4">
          No users yet. Create one above.
        </p>
      )}

      <Modal
        open={!!editing}
        onClose={() => {
          setEditing(null);
          setError("");
        }}
        title="Edit user"
      >
        {error && (
          <Alert variant="error" className="mb-3">
            {error}
          </Alert>
        )}
        <form action={handleUpdateSubmit} className="space-y-3">
          {editing && <input type="hidden" name="id" value={editing.id} />}
          <Input
            label="Name"
            name="name"
            defaultValue={editing?.name}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            defaultValue={editing?.email}
            required
          />
          {editing && (
            <Input
              label="New password (leave blank to keep)"
              name="newPassword"
              type="password"
            />
          )}
          <Select
            label="Role"
            name="role"
            options={ROLE_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
            defaultValue={editing?.role ?? ""}
            required
          />
          <Select
            label="Supervisor"
            name="supervisorId"
            options={supervisorOptions}
            defaultValue={editing?.supervisorId ?? ""}
          />
          <Input
            label="Phone"
            name="phone"
            defaultValue={editing?.phone ?? ""}
          />
          <div className="flex gap-2 pt-2">
            <Button type="submit" loading={loading}>
              Save
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditing(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default UsersTable;
