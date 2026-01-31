"use client";

import { Section } from "@/types/types";
import { ChevronDown, ChevronUp, Trash2, Plus } from "lucide-react";

interface CourseSectionListProps {
  sections: Section[];
  expandedSections: number[];
  onToggleSection: (sectionId: number) => void;
  onAddLesson: (sectionId: number) => void;
  onDeleteSection: (sectionId: number) => void;
  onDeleteLesson: (sectionId: number, lessonId: number) => void;
  onEditLesson: (sectionId: number, lessonId: number) => void;
}

export default function CourseSectionList({
  sections,
  expandedSections,
  onToggleSection,
  onAddLesson,
  onDeleteSection,
  onDeleteLesson,
  onEditLesson,
}: CourseSectionListProps) {
  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div
          key={section.id}
          className="border border-[rgba(255,255,255,0.1)] rounded-lg overflow-hidden"
        >
          <div className="bg-[#1f1f1f] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleSection(section.id)}
                className="p-1 hover:bg-[#262626] rounded transition-colors"
              >
                {expandedSections.includes(section.id) ? (
                  <ChevronUp className="h-4 w-4 text-[#737373]" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#737373]" />
                )}
              </button>
              <h4 className="font-medium text-white">{section.title}</h4>
            </div>
            <button
              onClick={() => onDeleteSection(section.id)}
              className="p-1 hover:bg-[#262626] rounded transition-colors text-[#ef4444]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {expandedSections.includes(section.id) && (
            <div className="p-4 space-y-3 bg-[#1a1a1a]">
              {section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between bg-[#171717] px-4 py-3 rounded-lg border border-[rgba(255,255,255,0.05)]"
                >
                  <span className="text-[#d4d4d4] font-medium">
                    {lesson.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditLesson(section.id, lesson.id)}
                      className="px-3 py-1.5 text-sm btn-dark"
                    >
                      Edit Lesson
                    </button>
                    <button
                      onClick={() => onDeleteLesson(section.id, lesson.id)}
                      className="p-1.5 hover:bg-[#262626] rounded transition-colors text-[#ef4444]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => onAddLesson(section.id)}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-[#d4af35] hover:bg-[#1f1f1f] rounded-lg border border-dashed border-[rgba(212,175,53,0.3)] transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Lesson
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
