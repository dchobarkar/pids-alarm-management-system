"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentLocation } from "@/lib/geo/get-current-location";
import { submitVerification } from "./actions";
import Alert from "@/components/ui/Alert";

const MAX_FILES = 5;

interface Props {
  alarmId: string;
}

const VerifyAlarmForm = ({ alarmId }: Props) => {
  const router = useRouter();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [remarks, setRemarks] = useState("");

  const handleCaptureLocation = async () => {
    setError(null);
    setCapturing(true);
    try {
      const pos = await getCurrentLocation();
      setLatitude(pos.latitude);
      setLongitude(pos.longitude);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to get location. Enable location access and try again.",
      );
    } finally {
      setCapturing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (latitude == null || longitude == null) {
      setError("Please capture your location first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      formData.set("latitude", String(latitude));
      formData.set("longitude", String(longitude));
      formData.set("remarks", remarks);

      const result = await submitVerification(alarmId, formData);
      if (result.success) {
        router.push("/rmp/tasks?verification_submitted=1");
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Alert variant="info" className="mb-4">
        After you submit, an operator will review your verification (location,
        remarks, evidence) and either <strong>Mark Verified</strong> (issue
        confirmed) or <strong>Mark False Alarm</strong> (dismissed). This task
        will then leave your list. You can return to Tasks to see other
        assignments.
      </Alert>
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      <div>
        <label className="block text-sm font-medium text-(--text-secondary) mb-1">
          Location (required)
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCaptureLocation}
            disabled={capturing}
            className="px-3 py-1.5 text-sm bg-(--brand-primary) text-white rounded disabled:opacity-50"
          >
            {capturing ? "Capturing…" : "Capture current location"}
          </button>
          {latitude != null && longitude != null && (
            <span className="text-sm text-(--text-muted)">
              {latitude.toFixed(5)}, {longitude.toFixed(5)}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-(--text-secondary) mb-1">
          Remarks
        </label>
        <textarea
          name="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          rows={3}
          className="w-full bg-(--bg-surface) border border-(--border-default) rounded px-2 py-1.5 text-sm"
          placeholder="Optional observations at site"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-(--text-secondary) mb-1">
          Evidence (images, max {MAX_FILES} files)
        </label>
        <input
          type="file"
          name="evidence"
          accept="image/jpeg,image/png,image/jpg"
          multiple
          className="w-full text-sm text-(--text-secondary)"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => router.push("/rmp/tasks")}
          className="px-3 py-1.5 text-sm border border-(--border-default) rounded hover:bg-(--bg-surface)"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || latitude == null || longitude == null}
          className="px-3 py-1.5 text-sm bg-(--brand-primary) text-white rounded disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit verification"}
        </button>
      </div>
    </form>
  );
};

export default VerifyAlarmForm;

