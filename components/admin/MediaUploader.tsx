"use client";

import { useState } from "react";
import { uploadProjectFileAction } from "@/lib/actions/admin";
import { Label } from "@/components/ui/Label";

type MediaUploaderProps = {
  bucket: "project-images" | "project-videos";
  label: string;
  accept: string;
  onUploaded: (url: string) => void;
};

export function MediaUploader({ bucket, label, accept, onUploaded }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);

    const result = await uploadProjectFileAction(formData);
    setUploading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.url) {
      onUploaded(result.url);
    }

    e.target.value = "";
  }

  return (
    <div>
      <Label>{label}</Label>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="mt-2 block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-950 hover:file:bg-cyan-300"
      />
      {uploading && <p className="mt-2 text-sm text-slate-400">Uploading...</p>}
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
