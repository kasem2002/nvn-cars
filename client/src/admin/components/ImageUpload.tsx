import { ChangeEvent, useRef, useState } from "react";
import { useUploadImageMutation } from "@/services/api";

interface Props {
  label: string;
  value: string | null | undefined;
  onChange: (url: string) => void;
  aspect?: string;
}

export function ImageUpload({ label, value, onChange, aspect = "aspect-video" }: Props) {
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    try {
      const result = await uploadImage(file).unwrap();
      onChange(result.url);
    } catch (err) {
      const message =
        err && typeof err === "object" && "data" in err && err.data && typeof err.data === "object" && "error" in err.data
          ? String((err.data as { error?: unknown }).error)
          : "Upload failed. Please try again.";
      setError(message);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/50">{label}</span>

      <div className={`relative w-full overflow-hidden rounded-md border border-white/15 bg-[#0B0B0C] ${aspect}`}>
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/30">No image uploaded</div>
        )}

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white">Uploading…</div>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 hover:border-nvn-red hover:text-nvn-red disabled:opacity-50"
        >
          {value ? "Replace Image" : "Upload Image"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-white/40 hover:text-red-400">
            Remove
          </button>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-nvn-red">{error}</p>}
    </div>
  );
}
