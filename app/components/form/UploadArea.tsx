"use client";

import { Upload, Video, FileText, Image } from "lucide-react";

interface UploadAreaProps {
  type: "image" | "video" | "document";
  label: string;
  hint: string;
  onFileSelect: (file: File) => void;
  accept?: string;
}

export default function UploadArea({
  type,
  label,
  hint,
  onFileSelect,
  accept,
}: UploadAreaProps) {
  const getIcon = () => {
    switch (type) {
      case "image":
        return <Image className="h-8 w-8 text-[#d4af35]" />;
      case "video":
        return <Video className="h-8 w-8 text-[#d4af35]" />;
      case "document":
        return <FileText className="h-8 w-8 text-[#d4af35]" />;
      default:
        return <Upload className="h-8 w-8 text-[#d4af35]" />;
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
      className="border-2 border-dashed border-[rgba(212,175,53,0.3)] rounded-lg p-8 text-center cursor-pointer hover:border-[#d4af35] transition-colors bg-[#1a1a1a]"
      onClick={handleClick}
    >
      {getIcon()}
      <p className="text-white mt-3 mb-1 font-medium">{label}</p>
      <p className="text-sm text-[#737373]">{hint}</p>
    </div>
  );
}
