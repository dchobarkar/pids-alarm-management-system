"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { UserWithSupervisor } from "@/types/user";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/form/Input";
import PasswordInput from "@/components/form/PasswordInput";
import Alert from "@/components/ui/Alert";
import { updateProfile, changePasswordProfile } from "./actions";

type Props = {
  user: UserWithSupervisor;
};

const formatRole = (role: string) => role.replace(/_/g, " ");

const ProfileForm = ({ user }: Props) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [error, setError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setEditLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    setEditLoading(false);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    setEditOpen(false);
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
    const result = await changePasswordProfile(newPassword);
    setPasswordLoading(false);
    if ("error" in result && result.error) {
      setError(result.error);
      return;
    }
    setPasswordOpen(false);
    router.refresh();
  };

  const handleDiscardEdit = () => {
    setError("");
    setEditOpen(false);
    formRef.current?.reset();
  };

  return (
    <>
      <div className="flex flex-wrap justify-end gap-2">
        <Button onClick={() => setEditOpen(true)}>Edit</Button>
        <Button variant="secondary" onClick={() => setPasswordOpen(true)}>
          Change password
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mb-2">
          {error}
        </Alert>
      )}

      <Modal open={editOpen} onClose={handleDiscardEdit} title="Edit profile">
        <form
          key={`${user.id}-${user.name}-${user.phone ?? ""}`}
          ref={formRef}
          onSubmit={handleEditSubmit}
          className="space-y-4"
        >
          <Input label="Name" name="name" defaultValue={user.name} required />

          <p className="text-sm text-(--text-muted)">
            <strong>Email:</strong> {user.email} (not editable)
          </p>

          <p className="text-sm text-(--text-muted)">
            <strong>Role:</strong> {formatRole(user.role)} (not editable)
          </p>

          <p className="text-sm text-(--text-muted)">
            <strong>Supervisor:</strong>{" "}
            {user.supervisor ? user.supervisor.name : "—"} (not editable)
          </p>

          <Input label="Phone" name="phone" defaultValue={user.phone ?? ""} />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDiscardEdit}
            >
              Discard
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
    </>
  );
};

export default ProfileForm;
