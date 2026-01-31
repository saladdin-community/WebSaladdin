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
      [type === "video" ? "videoUrl" : "articleUrl"]: URL.createObjectURL(file),
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
          label="Additional Text"
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

            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Lesson Overview
              </label>
              <textarea
                value={lessonData.overview || ""}
                onChange={(e) => onUpdateLesson({ overview: e.target.value })}
                placeholder="Write an overview of this lesson..."
                rows={4}
                className="w-full input py-3 resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === "text" && (
          <div>
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Additional Text Content
            </label>
            <textarea
              value={lessonData.additionalText || ""}
              onChange={(e) =>
                onUpdateLesson({ additionalText: e.target.value })
              }
              placeholder="Enter additional text content for this lesson..."
              rows={12}
              className="w-full input py-3 resize-none"
            />
            <p className="text-sm text-[#737373] mt-2">
              You can add supplementary materials, notes, or references here.
            </p>
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
                value={lessonData.passingGrade || 75}
                onChange={(e) =>
                  onUpdateLesson({ passingGrade: Number(e.target.value) })
                }
                min="0"
                max="100"
                className="w-full input py-3"
              />
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
                placeholder="Describe the evaluation criteria..."
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
