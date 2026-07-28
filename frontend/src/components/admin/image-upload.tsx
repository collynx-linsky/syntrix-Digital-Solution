"use client";

import { useState, type ChangeEvent } from "react";
import { Loader2, Upload } from "lucide-react";

export function ImageUpload({
  currentUrl,
  onUpload,
}: {
  currentUrl: string | null;
  onUpload: (file: File) => Promise<void>;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setPreview(selected ? URL.createObjectURL(selected) : null);
    setError(null);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      await onUpload(file);
      setFile(null);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const displayUrl = preview ?? currentUrl;

  return (
    <div className="flex items-center gap-4">
      {displayUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={displayUrl} alt="" className="h-20 w-20 rounded-lg object-cover" />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-pale-100 text-ink-400 dark:bg-ink-800">
          <Upload className="h-6 w-6" />
        </div>
      )}
      <div className="space-y-2">
        <input type="file" accept="image/*" onChange={handleChange} className="text-sm text-ink-600 dark:text-ink-300" />
        {file && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-gold-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gold-500 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Upload
          </button>
        )}
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </div>
  );
}
