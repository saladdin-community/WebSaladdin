"use client";

import { useState } from "react";
import { Video, FileText, BookOpen, ChevronRight } from "lucide-react";
import UploadArea from "../form/UploadArea";
import { Lesson } from "@/types/types";

interface LessonEditorTabsProps {
  lessonData: Partial<Lesson>;
  onUpdateLesson: (data: Partial<Lesson>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function LessonEditorTabs({
  lessonData,
  onUpdateLesson,
  onSave,
  onCancel,
}: LessonEditorTabsProps) {
  const [activeTab, setActiveTab] = useState<"content" | "text" | "evaluation">(
    "content",
  );

  const handleFileUpload = (type: "video" | "article", file: File) => {
    onUpdateLesson({
      // For preview, we might still want a URL, but for state we use file
      // If uploading, we might set content_source="upload"
      content_source: "upload",
      // content_url usually for external. For upload preview we can use object URL but typically we just hold the file
      [type === "video" ? "videoFile" : "articleFile"]: file,
      type: type === "video" ? "video" : "document", // Ensure type is set
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-[rgba(255,255,255,0.1)]">
        <TabButton
          active={activeTab === "content"}
          onClick={() => setActiveTab("content")}
          icon={<Video className="h-4 w-4" />}
          label="Content"
        />
        <TabButton
          active={activeTab === "text"}
          onClick={() => setActiveTab("text")}
          icon={<FileText className="h-4 w-4" />}
          label="Text Content"
        />
        <TabButton
          active={activeTab === "evaluation"}
          onClick={() => setActiveTab("evaluation")}
          icon={<BookOpen className="h-4 w-4" />}
          label="Evaluation"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "content" && (
          <div className="space-y-6">
            <UploadArea
              type="video"
              label="Upload Video"
              hint="MP4, MOV, AVI (max. 500MB)"
              onFileSelect={(file) => handleFileUpload("video", file)}
              accept="video/*"
            />

            <UploadArea
              type="document"
              label="Upload Article/Document"
              hint="PDF, DOC, TXT (max. 20MB)"
              onFileSelect={(file) => handleFileUpload("article", file)}
              accept=".pdf,.doc,.docx,.txt"
            />

            {/* Optional: Add External URL Input here if needed */}
            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                External Content URL (Video/Doc)
              </label>
              <input
                type="text"
                placeholder="https://..."
                className="w-full input py-3"
                value={lessonData.content_url || ""}
                onChange={(e) =>
                  onUpdateLesson({
                    content_url: e.target.value,
                    content_source: "external",
                    // Infer type if empty?
                    type: lessonData.type || "video",
                  })
                }
              />
            </div>
          </div>
        )}

        {activeTab === "text" && (
          <div>
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Lesson Text Content
            </label>
            <textarea
              value={lessonData.content_text || ""}
              onChange={(e) => onUpdateLesson({ content_text: e.target.value })}
              placeholder="Enter text content for this lesson..."
              rows={12}
              className="w-full input py-3 resize-none"
            />
          </div>
        )}

        {activeTab === "evaluation" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Passing Grade (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={lessonData.passingGrade || ""}
                onChange={(e) =>
                  onUpdateLesson({ passingGrade: parseInt(e.target.value) })
                }
                placeholder="e.g., 75"
                className="w-full input py-3"
              />
              <p className="text-xs text-[#737373] mt-2">
                Leave empty if no grading required for this lesson.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Evaluation Description
              </label>
              <textarea
                value={lessonData.evaluationDesc || ""}
                onChange={(e) =>
                  onUpdateLesson({ evaluationDesc: e.target.value })
                }
                placeholder="Instructions for the quiz/evaluation..."
                rows={4}
                className="w-full input py-3 resize-none"
              />
            </div>

            <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
              <button
                onClick={() => alert("Redirecting to Quiz Setup page...")}
                className="px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white font-semibold rounded-lg hover:opacity-90 flex items-center gap-2 transition-opacity"
              >
                Setup Quiz Questions
                <ChevronRight className="h-4 w-4" />
              </button>
              <p className="text-sm text-[#737373] mt-2">
                Click to configure detailed quiz questions and answers
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-[rgba(255,255,255,0.1)]">
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-6 py-3 btn-dark flex-1">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex-1"
          >
            Save Lesson
          </button>
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-colors ${
        active
          ? "text-[#d4af35] border-b-2 border-[#d4af35] bg-gradient-to-b from-[#1f1f1f] to-transparent"
          : "text-[#737373] hover:text-[#d4d4d4]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
