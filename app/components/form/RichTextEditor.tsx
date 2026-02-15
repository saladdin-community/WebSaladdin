"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import "react-quill-new/dist/quill.snow.css";

// Dynamic import to avoid SSR issues with Quill
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[150px] bg-[#262626] animate-pulse rounded-lg border border-[rgba(255,255,255,0.1)]" />
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  className = "",
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    }),
    [],
  );

  if (!mounted) {
    return (
      <div className={`rich-text-editor ${className}`}>
        <div className="h-[200px] bg-[#262626] animate-pulse rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
          <p className="text-[#737373] text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <style jsx global>{`
        .ql-toolbar {
          background-color: #262626;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .ql-container {
          background-color: #1a1a1a;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          color: white;
          font-size: 1rem;
        }
        .ql-editor {
          min-height: 150px;
          color: white; /* Ensure text is visible */
        }
        .ql-toolbar button {
          color: #a3a3a3 !important;
        }
        .ql-toolbar button:hover {
          color: white !important;
        }
        /* Ensure dropdowns are visible above other elements */
        .ql-picker-options {
          z-index: 9999 !important;
        }
      `}</style>
      <div className="relative z-0">
        <ReactQuill
          theme="snow"
          value={value || ""}
          onChange={(content) => onChange(content)}
          modules={modules}
          placeholder={placeholder}
          className="text-white"
        />
      </div>
    </div>
  );
}
