"use client";

import { BookOpen } from "lucide-react";
import LessonEditorTabs from "./LessonEditorTabs";
import { Lesson, Section } from "@/types/types";

interface CourseFormOverviewProps {
  selectedLesson: { sectionId: number; lessonId: number } | null;
  sections: Section[];
  lessonData: Partial<Lesson>;
  onUpdateLessonData: (data: Partial<Lesson>) => void;
  onSaveLesson: () => void;
  onCancelLesson: () => void;
}

export default function CourseFormOverview({
  selectedLesson,
  sections,
  lessonData,
  onUpdateLessonData,
  onSaveLesson,
  onCancelLesson,
}: CourseFormOverviewProps) {
  const currentLesson = selectedLesson
    ? sections
        .find((s) => s.id === selectedLesson.sectionId)
        ?.lessons.find((l) => l.id === selectedLesson.lessonId)
    : null;

  return (
    <div className="w-1/2 h-full flex flex-col border-l border-[rgba(255,255,255,0.1)]">
      <div className="p-6 border-b border-[rgba(255,255,255,0.1)] bg-[#1f1f1f]">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#d4af35]" />
          {currentLesson
            ? `Edit Lesson: ${currentLesson.title}`
            : "Lessons Overview"}
        </h3>
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedLesson ? (
          <LessonEditorTabs
            lessonData={lessonData}
            onUpdateLesson={onUpdateLessonData}
            onSave={onSaveLesson}
            onCancel={onCancelLesson}
          />
        ) : (
          <div className="h-full overflow-y-auto p-6">
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="admin-card">
                  <h4 className="font-semibold text-white mb-3 text-[#d4af35]">
                    {section.title}
                  </h4>
                  <ul className="space-y-2">
                    {section.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex items-center gap-3 px-2 py-2 hover:bg-[#171717] rounded-lg transition-colors"
                      >
                        <div className="h-2 w-2 rounded-full bg-[#d4af35] flex-shrink-0" />
                        <span className="text-[#d4d4d4] font-medium">
                          {lesson.title}
                        </span>
                        {lesson.overview && (
                          <span className="text-xs text-[#737373] ml-auto">
                            Content Added
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
