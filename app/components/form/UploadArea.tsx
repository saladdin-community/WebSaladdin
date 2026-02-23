"use client";

import { Upload, Video, FileText, Image } from "lucide-react";

interface UploadAreaProps {
  type: "image" | "video" | "document";
  label: string;
  hint: string;
  onFileSelect: (file: File) => void;
  accept?: string;
  compact?: boolean;
}

export default function UploadArea({
  type,
  label,
  hint,
  onFileSelect,
  accept,
  compact,
}: UploadAreaProps) {
  const getIcon = () => {
    switch (type) {
      case "image":
        return (
          <Image
            className={`${compact ? "h-6 w-6" : "h-8 w-8"} text-[#d4af35] mx-auto`}
          />
        );
      case "video":
        return (
          <Video
            className={`${compact ? "h-6 w-6" : "h-8 w-8"} text-[#d4af35] mx-auto`}
          />
        );
      case "document":
        return (
          <FileText
            className={`${compact ? "h-6 w-6" : "h-8 w-8"} text-[#d4af35] mx-auto`}
          />
        );
      default:
        return (
          <Upload
            className={`${compact ? "h-6 w-6" : "h-8 w-8"} text-[#d4af35] mx-auto`}
          />
        );
    }
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      accept ||
      (type === "image" ? "image/*" : type === "video" ? "video/*" : "*/*");
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onFileSelect(file);
    };
    input.click();
  };

  return (
    <div
      onClick={handleClick}
      className={`border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-xl cursor-pointer hover:border-[#d4af37] hover:bg-[#262626] transition-all bg-[#1a1a1a]/50 text-center flex flex-col items-center justify-center ${
        compact ? "p-4 min-w-[140px]" : "p-8 w-full"
      }`}
    >
      <div className="mb-2">{getIcon()}</div>
      <p
        className={`text-white font-medium ${compact ? "text-xs" : "text-base"}`}
      >
        {label}
      </p>
      {hint && !compact && (
        <p className="text-sm text-[#737373] mt-1">{hint}</p>
      )}
    </div>
  );
}
