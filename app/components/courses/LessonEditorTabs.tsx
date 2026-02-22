"use client";

import { useState, useEffect, useRef } from "react";
import {
  Video,
  FileText,
  HelpCircle,
  Upload,
  Link as LinkIcon,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";
import UploadArea from "../form/UploadArea";
import RichTextEditor from "../form/RichTextEditor";
import { Lesson } from "@/types/types";

interface LessonEditorTabsProps {
  lessonData: Partial<Lesson>;
  onUpdateLesson: (data: Partial<Lesson>) => void;
  onSave: () => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

type LessonType = "video" | "text" | "quiz";

export default function LessonEditorTabs({
  lessonData,
  onUpdateLesson,
  onSave,
  onCancel,
  mode,
}: LessonEditorTabsProps) {
  // Infer active type from data or default to video
  const [activeType, setActiveType] = useState<LessonType>("video");
  const [contentSourceType, setContentSourceType] = useState<"upload" | "url">(
    "upload",
  );

  useEffect(() => {
    if (lessonData.type) {
      if (lessonData.type === "document") {
        // Map document back to "video" tab (Video/Article)
        setActiveType("video");
      } else {
        setActiveType(lessonData.type as LessonType);
      }
    }

    if (lessonData.content_source === "external" || lessonData.content_url) {
      setContentSourceType("url");
    }
  }, [lessonData.type, lessonData.content_source, lessonData.content_url]);

  const handleTypeSelect = (type: LessonType) => {
    setActiveType(type);
    // Determine internal type based on selection
    // For 'video' tab, it defaults to 'video', but might be 'document' if they upload a PDF
    // We'll set a default here
    let newType = type;
    if (type === "video") newType = "video"; // or document, depends on upload. Default video.

    onUpdateLesson({ type: newType });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Reset selected file when modal reopens or mode changes
  useEffect(() => {
    if (!lessonData.articleFile) setSelectedFile(null);
  }, [lessonData.articleFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    onUpdateLesson({
      content_source: "upload",
      articleFile: file,
      type: "document",
    });
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onUpdateLesson({ articleFile: undefined, type: "video" });
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Lesson Title */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#d4d4d4]">
            Lesson Title
          </label>
          <input
            type="text"
            value={lessonData.title || ""}
            onChange={(e) => onUpdateLesson({ title: e.target.value })}
            placeholder="e.g., Introduction Video"
            className="w-full input py-3 bg-[#262626] border-[rgba(255,255,255,0.1)] text-white focus:border-[#d4af37]"
          />
        </div>

        {/* Lesson Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#d4d4d4]">
            Lesson Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleTypeSelect("video")}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                activeType === "video"
                  ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                  : "border-[rgba(255,255,255,0.1)] bg-[#262626] text-[#a3a3a3] hover:bg-[#333]"
              }`}
            >
              <Video className="h-6 w-6" />
              <span className="font-medium">Video / Article</span>
            </button>
            <button
              onClick={() => handleTypeSelect("text")}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                activeType === "text"
                  ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                  : "border-[rgba(255,255,255,0.1)] bg-[#262626] text-[#a3a3a3] hover:bg-[#333]"
              }`}
            >
              <FileText className="h-6 w-6" />
              <span className="font-medium">Text</span>
            </button>
            <button
              onClick={() => handleTypeSelect("quiz")}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                activeType === "quiz"
                  ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]"
                  : "border-[rgba(255,255,255,0.1)] bg-[#262626] text-[#a3a3a3] hover:bg-[#333]"
              }`}
            >
              <HelpCircle className="h-6 w-6" />
              <span className="font-medium">Quiz</span>
            </button>
          </div>
        </div>

        {/* Dynamic Content Based on Type */}
        {activeType === "video" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[#d4d4d4]">
                Content Source
              </label>
              <div className="flex p-1 bg-[#262626] rounded-lg border border-[rgba(255,255,255,0.1)]">
                <button
                  onClick={() => setContentSourceType("upload")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    contentSourceType === "upload"
                      ? "bg-[#333] text-white shadow-sm"
                      : "text-[#737373] hover:text-white"
                  }`}
                >
                  File Upload
                </button>
                <button
                  onClick={() => setContentSourceType("url")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    contentSourceType === "url"
                      ? "bg-[#333] text-white shadow-sm"
                      : "text-[#737373] hover:text-white"
                  }`}
                >
                  External URL
                </button>
              </div>
            </div>

            {contentSourceType === "upload" ? (
              <div className="border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl p-8 bg-[#262626]/50">
                {/* Hidden native file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {selectedFile ? (
                  /* ── File selected state ── */
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-[#737373] mt-0.5">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-sm btn-dark rounded-lg"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="px-3 py-2 text-sm btn-dark rounded-lg text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Empty state ── */
                  <div className="text-center">
                    <Upload className="h-10 w-10 text-[#737373] mx-auto mb-3" />
                    <p className="text-white font-medium mb-1">
                      Upload Document (PDF)
                    </p>
                    <p className="text-sm text-[#737373] mb-4">
                      PDF, DOC, DOCX — max 500MB
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#d4af35] text-black hover:bg-[#c4a030] transition-colors"
                    >
                      Browse File
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="e.g. https://youtube.com/watch?v=..."
                  className="w-full input py-3 bg-[#262626] border-[rgba(255,255,255,0.1)]"
                  value={lessonData.content_url || ""}
                  onChange={(e) =>
                    onUpdateLesson({
                      content_url: e.target.value,
                      content_source: "external",
                      type: "video", // Default to video for URL
                    })
                  }
                />
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-medium text-[#d4d4d4]">
                Lesson Overview
              </label>
              <RichTextEditor
                key={`editor-overview-${lessonData.id || "new"}`}
                value={lessonData.content_text || ""} // Mapped from overview/content_text
                onChange={(val) => onUpdateLesson({ content_text: val })}
                placeholder="Type lesson summary here..."
                className="bg-[#262626] border-[rgba(255,255,255,0.1)] rounded-lg"
              />
            </div>
          </div>
        )}

        {activeType === "text" && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-[#d4d4d4]">
                Lesson Content
              </label>
              <RichTextEditor
                key={`editor-content-${lessonData.id || "new"}`}
                value={lessonData.content_text || ""}
                onChange={(val) => onUpdateLesson({ content_text: val })}
                placeholder="Write your full article content here..."
                className="bg-[#262626] border-[rgba(255,255,255,0.1)] rounded-lg min-h-[400px]"
              />
            </div>
          </div>
        )}

        {activeType === "quiz" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#d4d4d4]">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={lessonData.duration || ""}
                  onChange={(e) =>
                    onUpdateLesson({ duration: parseInt(e.target.value) || 0 })
                  }
                  placeholder="e.g. 30"
                  className="w-full input py-3 bg-[#262626] border-[rgba(255,255,255,0.1)]"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-[#d4d4d4]">
                  Passing Grade (%)
                </label>
                <input
                  type="number"
                  value={lessonData.passingGrade || ""}
                  onChange={(e) =>
                    onUpdateLesson({
                      passingGrade: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="e.g. 70"
                  className="w-full input py-3 bg-[#262626] border-[rgba(255,255,255,0.1)]"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-[#d4d4d4]">
                Quiz Description / Instructions
              </label>
              <textarea
                value={lessonData.evaluationDesc || ""}
                onChange={(e) =>
                  onUpdateLesson({ evaluationDesc: e.target.value })
                }
                placeholder="e.g., Please read the questions carefully..."
                rows={4}
                className="w-full input py-3 bg-[#262626] border-[rgba(255,255,255,0.1)] resize-none"
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-4">
              <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-400 mb-1">Info</p>
                <p className="text-sm text-blue-300/80">
                  You can add questions in the next step after creating the
                  lesson.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-[rgba(255,255,255,0.1)] bg-[#1f1f1f] flex justify-end gap-3 rounded-b-2xl">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 rounded-lg text-[#a3a3a3] hover:text-white hover:bg-[#262626] transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-[#d4af37] text-black rounded-lg hover:bg-[#c4a030] transition-colors font-semibold"
        >
          {mode === "add"
            ? activeType === "quiz"
              ? "Create & Add Questions"
              : "Add Lesson"
            : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
