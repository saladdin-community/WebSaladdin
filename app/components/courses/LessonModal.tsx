"use client";

import { useState, useEffect } from "react";
import { X, Video, FileText, BookOpen, ChevronRight } from "lucide-react";
import UploadArea from "../form/UploadArea";
import { Lesson } from "@/types/types";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  lessonData?: Partial<Lesson>;
  onSave: (lessonData: Partial<Lesson>) => void;
}

export default function LessonModal({
  isOpen,
  onClose,
  mode,
  lessonData,
  onSave,
}: LessonModalProps) {
  const [activeTab, setActiveTab] = useState<"content" | "text" | "evaluation">(
    "content",
  );
  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [additionalText, setAdditionalText] = useState("");
  const [passingGrade, setPassingGrade] = useState(75);
  const [evaluationDesc, setEvaluationDesc] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [articleFile, setArticleFile] = useState<File | null>(null);

  useEffect(() => {
    if (lessonData) {
      setTitle(lessonData.title || "");
      setOverview(lessonData.overview || "");
      setAdditionalText(lessonData.additionalText || "");
      setPassingGrade(lessonData.passingGrade || 75);
      setEvaluationDesc(lessonData.evaluationDesc || "");
    } else {
      resetForm();
    }
  }, [lessonData]);

  const resetForm = () => {
    setTitle("");
    setOverview("");
    setAdditionalText("");
    setPassingGrade(75);
    setEvaluationDesc("");
    setVideoFile(null);
    setArticleFile(null);
    setActiveTab("content");
  };

  if (!isOpen) return null;

  const handleSave = () => {
    const lessonData: Partial<Lesson> = {
      title: title || `Lesson ${Date.now()}`,
      overview,
      additionalText,
      passingGrade,
      evaluationDesc,
    };
    onSave(lessonData);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-4xl bg-gradient-to-br from-[#1a1a1a] to-[#121212] rounded-2xl border border-[rgba(212,175,53,0.1)] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === "add" ? "Add New Lesson" : "Edit Lesson"}
            </h2>
            <p className="text-sm text-[#737373] mt-1">
              {mode === "add"
                ? "Create a new lesson for your course"
                : "Edit lesson content and materials"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#262626] rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-[#737373]" />
          </button>
        </div>

        {/* Lesson Title */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
          <div>
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Lesson Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Introduction to Tajweed"
              className="w-full input py-3"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[rgba(255,255,255,0.1)]">
          <div className="flex">
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
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {activeTab === "content" && (
            <div className="space-y-6">
              <UploadArea
                type="video"
                label="Upload Video"
                hint="MP4, MOV, AVI (max. 500MB)"
                onFileSelect={setVideoFile}
                accept="video/*"
              />
              {videoFile && (
                <p className="text-sm text-[#d4af35]">
                  Selected: {videoFile.name}
                </p>
              )}

              <UploadArea
                type="document"
                label="Upload Article/Document"
                hint="PDF, DOC, TXT (max. 20MB)"
                onFileSelect={setArticleFile}
                accept=".pdf,.doc,.docx,.txt"
              />
              {articleFile && (
                <p className="text-sm text-[#d4af35]">
                  Selected: {articleFile.name}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                  Lesson Overview
                </label>
                <textarea
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
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
                value={additionalText}
                onChange={(e) => setAdditionalText(e.target.value)}
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
                  value={passingGrade}
                  onChange={(e) => setPassingGrade(Number(e.target.value))}
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
                  value={evaluationDesc}
                  onChange={(e) => setEvaluationDesc(e.target.value)}
                  placeholder="Describe the evaluation criteria..."
                  rows={4}
                  className="w-full input py-3 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
                <button
                  onClick={() => {
                    alert("Redirecting to Quiz Setup page...");
                  }}
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

        {/* Footer Actions */}
        <div className="p-6 border-t border-[rgba(255,255,255,0.1)]">
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-6 py-3 btn-dark flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex-1"
            >
              {mode === "add" ? "Add Lesson" : "Save Changes"}
            </button>
          </div>
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
      className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-colors flex-1 ${
        active
          ? "text-[#d4af35] border-b-2 border-[#d4af35] bg-gradient-to-b from-[#1f1f1f] to-transparent"
          : "text-[#737373] hover:text-[#d4d4d4] hover:bg-[#1a1a1a]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
