"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/lib/generated/prisma";
import type { UserWithSupervisor } from "@/types/user";
import { ROLE_OPTIONS } from "@/constants/roles";
import { PATHS } from "@/constants/paths";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import Select from "@/components/form/Select";
import Alert from "@/components/ui/Alert";
import {
  updateUserAction,
  deleteUserAction,
  changePasswordAction,
} from "../actions";

type Props = {
  user: UserWithSupervisor;
  supervisors: User[];
};

const UserDetailClient = ({ user, supervisors }: Props) => {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const supervisorOptions = [
    { value: "", label: "— None —" },
    ...supervisors.map((s) => ({
      value: s.id,
      label: `${s.name} (${s.email})`,
    })),
  ];

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setEditLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("id", user.id);
    const result = await updateUserAction(formData);
    setEditLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setEditOpen(false);
    router.push(PATHS.operatorUsers);
    router.refresh();
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const newPassword = (formData.get("newPassword") as string) ?? "";
    const confirmPassword = (formData.get("confirmPassword") as string) ?? "";
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    const result = await changePasswordAction(user.id, newPassword);
    setPasswordLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setPasswordOpen(false);
    router.push(PATHS.operatorUsers);
    router.refresh();
  };

  const handleDeleteConfirm = async () => {
    setError("");
    setDeleteLoading(true);
    const result = await deleteUserAction(user.id);
    setDeleteLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setDeleteOpen(false);
    router.push(PATHS.operatorUsers);
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => setEditOpen(true)}>Edit user</Button>

        <Button variant="secondary" onClick={() => setPasswordOpen(true)}>
          Change password
        </Button>

        <Button
          variant="danger"
          onClick={() => {
            setError("");
            setDeleteOpen(true);
          }}
          disabled={deleteLoading}
        >
          Delete user
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mb-2">
          {error}
        </Alert>
      )}

      <Modal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setError("");
        }}
        title="Edit user"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input label="Name" name="name" defaultValue={user.name} required />

          <p className="text-sm text-(--text-muted)">
            <strong>Email:</strong> {user.email} (not editable)
          </p>

          <Select
            label="Role"
            name="role"
            options={ROLE_OPTIONS}
            defaultValue={user.role}
            required
          />

          <Select
            label="Supervisor"
            name="supervisorId"
            options={supervisorOptions}
            defaultValue={user.supervisorId ?? ""}
          />

          <Input label="Phone" name="phone" defaultValue={user.phone ?? ""} />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" loading={editLoading}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={passwordOpen}
        onClose={() => {
          setPasswordOpen(false);
          setError("");
        }}
        title="Change password"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <PasswordInput
            label="New password"
            name="newPassword"
            required
            helperText="Min 8 characters"
          />
          <PasswordInput
            label="Confirm password"
            name="confirmPassword"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPasswordOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={passwordLoading}>
              Update password
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setError("");
        }}
        title="Delete user"
      >
        {error && deleteOpen && (
          <Alert variant="error" className="mb-3">
            {error}
          </Alert>
        )}
        <p className="text-sm text-(--text-secondary) mb-4">
          Are you sure you want to delete <strong>{user.name}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setDeleteOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDeleteConfirm}
            loading={deleteLoading}
          >
            Delete user
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default UserDetailClient;
