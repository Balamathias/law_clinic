"use client";

import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { uploadImage } from "@/lib/uploads";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  category: "publications" | "gallery" | "avatars" | "sponsors" | "events";
  id: string;
  className?: string;
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  category,
  id,
  className,
  label = "Upload image",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage({ file, category, id, onProgress: setProgress });
      onChange(url);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded"
            className="h-32 w-32 rounded-lg border border-border object-cover"
          />
          <button
            onClick={() => onChange(null)}
            type="button"
            aria-label="Remove image"
            className="absolute -right-2 -top-2 rounded-full bg-surface p-1 text-ink shadow-sm hover:bg-surface-muted"
          >
            <X className="size-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface-muted/40 px-4 text-small text-ink-muted transition-colors hover:border-border-strong hover:bg-surface-muted disabled:opacity-60"
        >
          <UploadCloud className="size-5" />
          <span>{uploading ? `Uploading… ${progress}%` : label}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {error && <p className="mt-2 text-small text-destructive">{error}</p>}
    </div>
  );
}
