"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, CheckCircle2, AlertCircle, X } from "lucide-react";

interface ImageUploadProps {
  folder: "properties" | "documents" | "avatars";
  onUpload: (url: string) => void;
  label?: string;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export default function ImageUpload({ folder, onUpload, label = "Upload Image" }: ImageUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setState("uploading");
    setErrorMsg("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error ?? "Upload failed");
      }

      onUpload(json.url);
      setState("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
      setState("error");
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setState("idle");
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {label && (
        <p className="text-sm font-medium text-[#111] mb-2">{label}</p>
      )}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => state === "idle" && inputRef.current?.click()}
        className={[
          "relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors",
          state === "idle" || state === "error"
            ? isDragging
              ? "border-indigo-400 bg-indigo-50 cursor-pointer"
              : "border-[#E8E6E0] bg-[#F4F5F7] hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer"
            : "border-[#E8E6E0] bg-[#F4F5F7]",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />

        {state === "idle" && (
          <>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Upload size={20} className="text-indigo-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[#111]">
                Drop an image here or <span className="text-indigo-500">browse</span>
              </p>
              <p className="text-xs text-[#7C7870] mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </>
        )}

        {state === "uploading" && (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Upload size={20} className="text-indigo-500 animate-bounce" />
            </div>
            <p className="text-sm text-[#7C7870]">Uploading…</p>
            <div className="w-full max-w-xs h-1.5 bg-indigo-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full animate-pulse w-2/3" />
            </div>
          </div>
        )}

        {state === "success" && (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 size={32} className="text-emerald-500" />
            <p className="text-sm font-medium text-emerald-700">Upload successful</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="text-xs text-[#7C7870] hover:text-[#111] flex items-center gap-1 mt-1"
            >
              <X size={12} /> Upload another
            </button>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle size={28} className="text-red-500" />
            <p className="text-sm font-medium text-red-600">Upload failed</p>
            <p className="text-xs text-red-500 text-center max-w-xs">{errorMsg}</p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="text-xs text-indigo-500 hover:text-indigo-700 mt-1"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
