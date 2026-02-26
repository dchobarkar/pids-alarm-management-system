"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { getCurrentLocation } from "@/lib/geo/get-current-location";
import { submitVerification } from "@/app/(dashboard)/rmp/verify/actions";

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 5;

interface Props {
  alarmId: string;
}

const VerifyAlarmForm = ({ alarmId }: Props) => {
  const router = useRouter();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [remarks, setRemarks] = useState("");

  const handleCaptureLocation = async () => {
    setLocationError(null);
    setCapturing(true);
    try {
      const pos = await getCurrentLocation();
      setLatitude(pos.latitude);
      setLongitude(pos.longitude);
    } catch (e) {
      setLocationError(
        e instanceof Error ? e.message : "Failed to get location",
      );
    } finally {
      setCapturing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (latitude == null || longitude == null) {
      setLocationError("Please capture your location first.");
      return;
    }
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("latitude", String(latitude));
    formData.set("longitude", String(longitude));
    formData.set("remarks", remarks);

    const result = await submitVerification(alarmId, formData);
    setSubmitting(false);
    if (result.success) {
      router.push("/rmp/tasks");
      router.refresh();
    } else {
      setLocationError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        {locationError && (
          <p className="text-sm text-red-500 mt-1">{locationError}</p>
        )}
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
          Evidence (images, max {MAX_FILES} files, {MAX_FILE_SIZE_MB}MB each)
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
