"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/form/Input";
import Alert from "@/components/ui/Alert";
import { createChainage } from "./actions";

const ChainageCreateButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const result = await createChainage(formData);
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
      <Button onClick={() => setOpen(true)}>New chainage</Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setError("");
        }}
        title="New chainage"
      >
        {error && (
          <Alert variant="error" className="mb-3">
            {error}
          </Alert>
        )}
        <form action={handleSubmit} className="space-y-3">
          <Input label="Label" name="label" placeholder="e.g. 0-10" required />
          <Input
            label="Start KM"
            name="startKm"
            type="number"
            step="any"
            required
          />
          <Input
            label="End KM"
            name="endKm"
            type="number"
            step="any"
            required
          />
          <Input
            label="Latitude (optional)"
            name="latitude"
            type="number"
            step="any"
          />
          <Input
            label="Longitude (optional)"
            name="longitude"
            type="number"
            step="any"
          />
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

export default ChainageCreateButton;
