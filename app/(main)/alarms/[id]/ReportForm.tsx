"use client";

import { submitFieldReport } from "@/app/actions/reports";
import { useState, useCallback } from "react";

export function ReportForm({ alarmId }: { alarmId: string }) {
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geoLat, setGeoLat] = useState<number | null>(null);
  const [geoLng, setGeoLng] = useState<number | null>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const captureGeo = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoLat(pos.coords.latitude);
          setGeoLng(pos.coords.longitude);
        },
        () => setError("Could not get location")
      );
    }
  }, []);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    setError("");

    for (const file of Array.from(files)) {
      try {
        const res = await fetch("/api/uploads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Upload failed");
        }

        const { uploadUrl, blobUrl } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": file.type,
          },
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload to storage");
        }

        setPhotoUrls((prev) => [...prev, blobUrl]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        break;
      }
    }

    setUploading(false);
    e.target.value = "";
  }

  function removePhoto(url: string) {
    setPhotoUrls((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await submitFieldReport(
      alarmId,
      remark,
      geoLat ?? undefined,
      geoLng ?? undefined,
      photoUrls
    );

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setRemark("");
    setGeoLat(null);
    setGeoLng(null);
    setPhotoUrls([]);
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-[var(--destructive)]/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="remark"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Remark
        </label>
        <textarea
          id="remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          required
          rows={4}
          className="mt-2 block w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          placeholder="Enter investigation findings..."
        />
      </div>

      <div>
        <button
          type="button"
          onClick={captureGeo}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)]"
        >
          Capture GPS Location
        </button>
        {(geoLat != null || geoLng != null) && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            Lat: {geoLat?.toFixed(6)}, Lng: {geoLng?.toFixed(6)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Photos
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-[var(--muted)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--primary)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--primary-foreground)] file:hover:opacity-90"
        />
        {uploading && (
          <p className="mt-1 text-sm text-[var(--muted)]">Uploading...</p>
        )}
        {photoUrls.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {photoUrls.map((url) => (
              <div
                key={url}
                className="flex items-center gap-2 rounded-lg bg-[var(--secondary)] px-3 py-2 text-sm"
              >
                <span className="truncate max-w-[200px] text-[var(--muted)]">
                  Photo added
                </span>
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
