"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Chainage } from "@/lib/generated/prisma";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/form/Input";
import Alert from "@/components/ui/Alert";
import { getOperatorChainagesColumns } from "@/config/operator-chainages-columns";
import {
  updateChainage,
  deleteChainage,
} from "@/components/formComponents/CreateChainageForm/actions";

interface Props {
  chainages: Chainage[];
}

const ChainagesTable = ({ chainages }: Props) => {
  const router = useRouter();
  const [editing, setEditing] = useState<Chainage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Chainage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleUpdate(formData: FormData) {
    if (!editing) return;
    setError("");
    setLoading(true);
    const result = await updateChainage(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setEditing(null);
    router.refresh();
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setError("");
    setDeleteLoading(true);
    await deleteChainage(deleteTarget.id);
    setDeleteLoading(false);
    setDeleteTarget(null);
    router.refresh();
  }

  const columns = useMemo(
    () =>
      getOperatorChainagesColumns({
        onEdit: setEditing,
        onDelete: setDeleteTarget,
      }),
    [],
  );

  return (
    <>
      {chainages.length > 0 ? (
        <Table data={chainages} columns={columns} />
      ) : (
        <p className="text-(--text-muted) py-4">
          No chainages yet. Create one above.
        </p>
      )}

      <Modal
        open={!!editing}
        onClose={() => {
          setEditing(null);
          setError("");
        }}
        title="Edit chainage"
      >
        {error && (
          <Alert variant="error" className="mb-3">
            {error}
          </Alert>
        )}
        {editing && (
          <form action={handleUpdate} className="space-y-3">
            <input type="hidden" name="id" value={editing.id} />
            <Input
              label="Label"
              name="label"
              defaultValue={editing.label}
              required
            />
            <Input
              label="Start KM"
              name="startKm"
              type="number"
              step="any"
              defaultValue={editing.startKm}
              required
            />
            <Input
              label="End KM"
              name="endKm"
              type="number"
              step="any"
              defaultValue={editing.endKm}
              required
            />
            <Input
              label="Latitude (optional)"
              name="latitude"
              type="number"
              step="any"
              defaultValue={editing.latitude ?? ""}
            />
            <Input
              label="Longitude (optional)"
              name="longitude"
              type="number"
              step="any"
              defaultValue={editing.longitude ?? ""}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                Save
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => {
          setDeleteTarget(null);
          setError("");
        }}
        title="Delete chainage"
      >
        {deleteTarget && (
          <>
            <p className="text-sm text-(--text-secondary) mb-4">
              Are you sure you want to delete chainage{" "}
              <strong>{deleteTarget.label}</strong> ({deleteTarget.startKm}–
              {deleteTarget.endKm} km)? User mappings for this chainage will be
              removed.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleDeleteConfirm}
                loading={deleteLoading}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default ChainagesTable;
