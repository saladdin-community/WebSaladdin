"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Lesson } from "@/types/types";
import LessonEditorTabs from "./LessonEditorTabs";

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
  const [localLessonData, setLocalLessonData] = useState<Partial<Lesson>>({});

  useEffect(() => {
    if (lessonData) {
      setLocalLessonData(lessonData);
    } else {
      setLocalLessonData({});
    }
  }, [lessonData, isOpen]);

  const handleUpdateLesson = (data: Partial<Lesson>) => {
    setLocalLessonData((prev) => ({ ...prev, ...data }));
  };

  const handleSave = () => {
    onSave(localLessonData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] w-full max-w-4xl h-[85vh] rounded-2xl border border-[rgba(255,255,255,0.1)] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.1)] flex items-center justify-between bg-[#1f1f1f]">
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === "add" ? "Add New Lesson" : "Edit Lesson"}
            </h2>
            <p className="text-sm text-[#737373]">
              Configure lesson content, materials, and evaluation
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#262626] rounded-full transition-colors text-[#a3a3a3] hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content - Delegated to LessonEditorTabs */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <LessonEditorTabs
            lessonData={localLessonData}
            onUpdateLesson={handleUpdateLesson}
            onSave={handleSave}
            onCancel={onClose}
            mode={mode} // Pass mode to handle checking if it's "add" or "edit" for title/type locking if needed
          />
        </div>
      </div>
    </div>
  );
}
