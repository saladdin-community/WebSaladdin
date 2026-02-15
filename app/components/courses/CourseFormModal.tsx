"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import CourseFormSection from "./CourseFormSection";
import CourseFormOverview from "./CourseFormOverview";
import {
  CourseData,
  CourseFormModalProps,
  Lesson,
  Section,
} from "@/types/types";

export default function CourseFormModal({
  isOpen,
  onClose,
  mode,
  courseData,
}: CourseFormModalProps) {
  const [formData, setFormData] = useState<Omit<CourseData, "sections">>({
    title: "",
    instructor: "",
    description: "",
    thumbnail: undefined,
  });

  const [sections, setSections] = useState<Section[]>([
    {
      id: 1,
      title: "Introduction",
      lessons: [
        { id: 1, title: "Welcome Video", type: "video" },
        { id: 2, title: "Course Syllabus", type: "document" },
      ],
    },
  ]);

  const [expandedSections, setExpandedSections] = useState<number[]>([1]);
  const [selectedLesson, setSelectedLesson] = useState<{
    sectionId: number;
    lessonId: number;
  } | null>(null);
  const [currentLessonData, setCurrentLessonData] = useState<Partial<Lesson>>(
    {},
  );

  useEffect(() => {
    if (courseData) {
      setFormData({
        title: courseData.title,
        instructor: courseData.instructor,
        description: courseData.description,
        thumbnail: courseData.thumbnail,
      });
      setSections(courseData.sections || []);
    }
  }, [courseData]);

  if (!isOpen) return null;

  const handleAddSection = () => {
    const newId =
      sections.length > 0 ? Math.max(...sections.map((s) => s.id)) + 1 : 1;
    const newSections = [
      ...sections,
      {
        id: newId,
        title: `Section ${sections.length + 1}`,
        lessons: [],
      },
    ];
    setSections(newSections);
    setExpandedSections([...expandedSections, newId]);
  };

  // ...
  const handleAddLesson = (sectionId: number) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const newLessonId =
          section.lessons.length > 0
            ? Math.max(...section.lessons.map((l) => l.id)) + 1
            : 1;
        return {
          ...section,
          lessons: [
            ...section.lessons,
            {
              id: newLessonId,
              title: `Lesson ${section.lessons.length + 1}`,
              type: "text", // Initialize type as required
            } as Lesson, // Force cast or ensure type matches
          ],
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleEditLesson = (sectionId: number, lessonId: number) => {
    const section = sections.find((s) => s.id === sectionId);
    const lesson = section?.lessons.find((l) => l.id === lessonId);

    if (lesson) {
      setSelectedLesson({ sectionId, lessonId });
      setCurrentLessonData({
        content_text: lesson.content_text || "",
        content_url: lesson.content_url || "",
        passingGrade: lesson.passingGrade || 75,
        evaluationDesc: lesson.evaluationDesc || "",
        type: lesson.type,
        content_source: lesson.content_source,
      });
    }
  };
  // ...

  const handleSaveLesson = () => {
    if (!selectedLesson) return;

    const updatedSections = sections.map((section) => {
      if (section.id === selectedLesson.sectionId) {
        return {
          ...section,
          lessons: section.lessons.map((lesson) => {
            if (lesson.id === selectedLesson.lessonId) {
              return {
                ...lesson,
                ...currentLessonData,
              };
            }
            return lesson;
          }),
        };
      }
      return section;
    });

    setSections(updatedSections);
    setSelectedLesson(null);
    setCurrentLessonData({});
  };

  const handleDeleteSection = (sectionId: number) => {
    if (sections.length <= 1) {
      alert("At least one section is required");
      return;
    }
    const newSections = sections.filter((s) => s.id !== sectionId);
    setSections(newSections);
    setExpandedSections(expandedSections.filter((id) => id !== sectionId));
  };

  const handleDeleteLesson = (sectionId: number, lessonId: number) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
        };
      }
      return section;
    });
    setSections(updatedSections);

    if (
      selectedLesson?.sectionId === sectionId &&
      selectedLesson.lessonId === lessonId
    ) {
      setSelectedLesson(null);
      setCurrentLessonData({});
    }
  };

  const handleSaveCourse = () => {
    const completeCourseData: CourseData = {
      ...formData,
      sections,
    };
    console.log("Saving course:", completeCourseData);
    // API call would go here
    onClose();
  };

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="flex w-full max-w-6xl h-[90vh] admin-card border border-[rgba(212,175,53,0.1)] rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#1f1f1f] hover:bg-[#262626] rounded-full border border-[rgba(255,255,255,0.1)] transition-colors"
        >
          <X className="h-5 w-5 text-[#d4d4d4]" />
        </button>

        <div className="flex w-full h-full">
          <CourseFormSection
            courseData={formData}
            sections={sections}
            expandedSections={expandedSections}
            onUpdateCourseData={(data) =>
              setFormData((prev) => ({ ...prev, ...data }))
            }
            onToggleSection={toggleSection}
            onAddSection={handleAddSection}
            onAddLesson={handleAddLesson}
            onDeleteSection={handleDeleteSection}
            onDeleteLesson={handleDeleteLesson}
            onEditLesson={handleEditLesson}
            onCancel={onClose}
            onSave={handleSaveCourse}
            mode={mode}
          />

          <CourseFormOverview
            selectedLesson={selectedLesson}
            sections={sections}
            lessonData={currentLessonData}
            onUpdateLessonData={(data) =>
              setCurrentLessonData((prev) => ({ ...prev, ...data }))
            }
            onSaveLesson={handleSaveLesson}
            onCancelLesson={() => {
              setSelectedLesson(null);
              setCurrentLessonData({});
            }}
          />
        </div>
      </div>
    </div>
  );
}
