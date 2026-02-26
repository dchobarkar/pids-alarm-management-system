"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Chainage } from "@/lib/generated/prisma";
import Table from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/form/Input";
import Alert from "@/components/ui/Alert";
import { updateChainage, deleteChainage } from "./actions";

interface Props {
  chainages: Chainage[];
}

const ChainagesTable = ({ chainages }: Props) => {
  const router = useRouter();
  const [editing, setEditing] = useState<Chainage | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  async function handleDelete(id: string) {
    if (!confirm("Delete this chainage? Mappings will be removed.")) return;
    await deleteChainage(id);
    router.refresh();
  }

  const columns = [
    { header: "Label", accessor: "label" as const },
    {
      header: "Start (km)",
      accessor: "startKm" as const,
      render: (r: Chainage) => r.startKm,
    },
    {
      header: "End (km)",
      accessor: "endKm" as const,
      render: (r: Chainage) => r.endKm,
    },
    {
      header: "Lat",
      accessor: "latitude" as const,
      render: (r: Chainage) => (r.latitude != null ? r.latitude : "—"),
    },
    {
      header: "Long",
      accessor: "longitude" as const,
      render: (r: Chainage) => (r.longitude != null ? r.longitude : "—"),
    },
    {
      header: "Actions",
      accessor: "id" as const,
      render: (row: Chainage) => (
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
        )}
      </Modal>
    </>
  );
};

export default ChainagesTable;
