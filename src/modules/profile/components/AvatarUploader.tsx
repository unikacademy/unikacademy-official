"use client";

import { useRef, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { resizeToSquareJpeg } from "@/modules/profile/resizeImage";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_INPUT_BYTES = 10 * 1024 * 1024; // before resizing

/**
 * Uploads straight from the browser to avatars/<userId>/<random>.jpg (storage
 * RLS only allows the user's own folder), then asks the server to use it.
 */
export function AvatarUploader({
  userId,
  name,
  avatarUrl,
  canRemove,
  onChange,
  onError,
}: {
  userId: string;
  name: string;
  avatarUrl: string | null;
  canRemove: boolean;
  onChange: (avatarUrl: string | null) => void;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      onError("Please choose a JPG, PNG or WebP image");
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      onError("Image is too large (max 10 MB)");
      return;
    }

    setBusy(true);
    try {
      const blob = await resizeToSquareJpeg(file);
      const path = `${userId}/${crypto.randomUUID()}.jpg`;

      const { error: uploadError } = await getSupabase()
        .storage.from("avatars")
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (uploadError) throw uploadError;

      const res = await fetch("/api/profile/avatar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save photo");
      onChange(data.avatarUrl);
    } catch (e) {
      console.error(e);
      onError("Failed to upload photo");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/profile/avatar", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onChange(data.avatarUrl);
    } catch {
      onError("Failed to remove photo");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-20 h-20 flex-shrink-0">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="w-20 h-20 rounded-full object-cover border border-gray-100"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <span className="text-accent font-bold text-2xl">
              {name[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 rounded-full bg-white/70 flex items-center justify-center">
            <svg
              className="animate-spin w-6 h-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-50"
          >
            {avatarUrl ? "Change photo" : "Upload photo"}
          </button>
          {canRemove && (
            <button
              type="button"
              disabled={busy}
              onClick={remove}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Remove photo
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400">
          JPG, PNG or WebP. Cropped to a square and resized automatically.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>
    </div>
  );
}
