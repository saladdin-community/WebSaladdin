"use client";

import { useState, useRef } from "react";
import { Save, Upload, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  usePostApiAdminCourses,
  postApiAdminCourses,
} from "@/app/lib/generated/hooks/usePostApiAdminCourses";
import {
  postApiAdminCoursesCourseIdSections,
  postApiAdminSectionsSectionIdLessons,
} from "@/app/lib/api/admin-courses";
import { Section, Lesson } from "@/types/types";
import CourseSectionList from "@/app/components/courses/CourseSectionList";
import LessonModal from "@/app/components/courses/LessonModal";

export default function CreateCoursePage() {
  const router = useRouter();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // Basic Info State
  const [title, setTitle] = useState("");
  const [instructor_name, setInstructorName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  // Curriculum State
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  // Modal State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonModalMode, setLessonModalMode] = useState<"add" | "edit">("add");
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [activeLessonData, setActiveLessonData] = useState<any>(null);

  const [isSaving, setIsSaving] = useState(false);

  // Handlers - Basic Info
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreviewThumbnail(URL.createObjectURL(file));
    }
  };

  // Handlers - Curriculum (Local State Only)
  const handleAddSection = () => {
    const title = window.prompt("Enter section title:");
    if (!title) return;

    const newSection: Section = {
      id: -Date.now(), // Temporary ID
      title,
      lessons: [],
    };

    setSections((prev) => [...prev, newSection]);
    setExpandedSections((prev) => [...prev, newSection.id]);
  };

  const handleToggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const handleDeleteSection = (sectionId: number) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
    }
  };

  const handleAddLesson = (sectionId: number) => {
    setActiveSectionId(sectionId);
    setLessonModalMode("add");
    setActiveLessonData(null);
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (sectionId: number, lessonId: number) => {
    const section = sections.find((s) => s.id === sectionId);
    const lesson = section?.lessons.find((l) => l.id === lessonId);

    if (lesson) {
      setActiveSectionId(sectionId);
      setActiveLessonId(lessonId);
      setLessonModalMode("edit");
      setActiveLessonData(lesson);
      setIsLessonModalOpen(true);
    }
  };

  const handleDeleteLesson = (sectionId: number, lessonId: number) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      setSections((prev) =>
        prev.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              lessons: section.lessons.filter((l) => l.id !== lessonId),
            };
          }
          return section;
        }),
      );
    }
  };

  const handleSaveLesson = (lessonData: Partial<Lesson>) => {
    if (!activeSectionId) return;

    setSections((prev) =>
      prev.map((section) => {
        if (section.id === activeSectionId) {
          if (lessonModalMode === "add") {
            const newLesson: Lesson = {
              id: -Date.now(),
              title: lessonData.title || "Untitled Lesson",
              type: lessonData.type || "text",
              content_source: lessonData.content_source || "upload",
              content_url: lessonData.content_url,
              content_text: lessonData.content_text,
              passingGrade: lessonData.passingGrade,
              evaluationDesc: lessonData.evaluationDesc,
              videoFile: lessonData.videoFile,
              articleFile: lessonData.articleFile,
              duration: lessonData.duration,
            };
            return { ...section, lessons: [...section.lessons, newLesson] };
          } else {
            return {
              ...section,
              lessons: section.lessons.map((l) =>
                l.id === activeLessonId ? { ...l, ...lessonData } : l,
              ),
            };
          }
        }
        return section;
      }),
    );
    setIsLessonModalOpen(false);
  };

  // Sync Save Process
  const handleSaveCourse = async () => {
    if (!title || !instructor_name || !price || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setIsSaving(true);

      // 1. Create Course
      const courseFormData = new FormData();
      courseFormData.append("title", title);
      courseFormData.append("price", price.replace(/[^0-9]/g, ""));
      courseFormData.append("instructor_name", instructor_name);
      courseFormData.append("description", description);
      if (thumbnail) {
        courseFormData.append("thumbnail", thumbnail);
      }

      // We use the direct API call instead of hook `mutate` to await the result easily in this async flow
      const courseRes = await postApiAdminCourses({
        data: courseFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const courseId = courseRes.data.id; // Adjust based on actual API response structure

      // 2. Create Sections & Lessons
      for (const section of sections) {
        // Create Section
        const sectionRes = await postApiAdminCoursesCourseIdSections(courseId, {
          title: section.title,
        });
        const sectionId = sectionRes.data?.id || sectionRes.id; // Adjust based on return

        // Create Lessons
        for (const lesson of section.lessons) {
          const lessonPayload = new FormData();
          if (lesson.title) lessonPayload.append("title", lesson.title);
          if (lesson.content_text)
            lessonPayload.append("content_text", lesson.content_text);
          if (lesson.content_url)
            lessonPayload.append("content_url", lesson.content_url);

          if (lesson.passingGrade)
            lessonPayload.append(
              "passing_grade",
              lesson.passingGrade.toString(),
            );
          if (lesson.evaluationDesc)
            lessonPayload.append(
              "evaluation_description",
              lesson.evaluationDesc,
            );
          if (lesson.duration)
            lessonPayload.append("duration", lesson.duration.toString());

          let type = lesson.type || "text";
          let contentSource = lesson.content_source || "external";

          if (lesson.videoFile) {
            type = "video";
            contentSource = "upload";
          } else if (lesson.articleFile) {
            type = "document";
            contentSource = "upload";
          } else if (lesson.content_url) {
            contentSource = "external";
          } else if (lesson.passingGrade) {
            type = "quiz";
          }

          lessonPayload.append("type", type);
          lessonPayload.append("content_source", contentSource);

          if (lesson.videoFile) {
            lessonPayload.append("content_path", lesson.videoFile);
          }
          if (lesson.articleFile) {
            lessonPayload.append("content_path", lesson.articleFile);
          }

          await postApiAdminSectionsSectionIdLessons(sectionId, lessonPayload);
        }
      }

      alert("Course and curriculum created successfully!");
      router.push("/admin/courses");
    } catch (error) {
      console.error("Failed to save course", error);
      alert(
        "Failed to save course. Please checking your inputs and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[rgba(255,255,255,0.1)] bg-[#121212] z-10 sticky top-0">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Course</h1>
            <p className="text-[#737373] mt-1">
              Design your course structure and content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/courses" className="px-5 py-2.5 btn-dark">
              Cancel
            </Link>
            <button
              onClick={handleSaveCourse}
              disabled={isSaving}
              className="px-6 py-2.5 btn-gradient flex items-center gap-2 font-semibold disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {isSaving ? "Saving..." : "Save Course"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 overflow-hidden">
        <div className="flex match-height h-[calc(100vh-100px)] max-w-[1600px] mx-auto w-full">
          {/* Left Column: Basic Info */}
          <div className="w-1/2 p-8 overflow-y-auto border-r border-[rgba(255,255,255,0.1)]">
            <h2 className="text-xl font-bold text-white mb-6">
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Advanced Tajweed"
                  className="w-full input py-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                    Instructor Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={instructor_name}
                    onChange={(e) => setInstructorName(e.target.value)}
                    placeholder="Ustadz/Ustadzah Name"
                    className="w-full input py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                    Price (IDR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 199000"
                    className="w-full input py-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a brief description of the course..."
                  rows={6}
                  className="w-full input py-3 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                  Course Thumbnail
                </label>
                <div
                  className="border-2 border-dashed border-[rgba(212,175,53,0.3)] rounded-lg p-8 text-center cursor-pointer hover:border-[#d4af35] transition-colors bg-[#1a1a1a]"
                  onClick={() => thumbnailInputRef.current?.click()}
                >
                  {previewThumbnail ? (
                    <img
                      src={previewThumbnail}
                      alt="Thumbnail"
                      className="h-48 w-auto mx-auto mb-3 object-cover rounded"
                    />
                  ) : (
                    <Upload className="h-10 w-10 text-[#d4af35] mx-auto mb-3" />
                  )}
                  <p className="text-white mb-1">
                    {thumbnail
                      ? `Selected: ${thumbnail.name}`
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-[#737373]">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </p>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Curriculum */}
          <div className="w-1/2 p-8 overflow-y-auto bg-[#1a1a1a]/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Curriculum & Content
              </h2>
              <p className="text-sm text-[#737373]">
                Drag to reorder (Coming soon)
              </p>
            </div>

            <div className="space-y-6">
              <CourseSectionList
                sections={sections}
                expandedSections={expandedSections}
                onToggleSection={handleToggleSection}
                onAddLesson={handleAddLesson}
                onDeleteSection={handleDeleteSection}
                onDeleteLesson={handleDeleteLesson}
                onEditLesson={handleEditLesson}
              />

              <button
                onClick={handleAddSection}
                className="w-full py-4 border border-dashed border-[#d4af35] text-[#d4af35] rounded-xl hover:bg-[#d4af35]/10 transition-colors flex items-center justify-center gap-2 font-semibold"
              >
                <Plus className="h-5 w-5" />
                Add New Section
              </button>

              {sections.length === 0 && (
                <div className="text-center py-12 text-[#737373] border border-[rgba(255,255,255,0.05)] rounded-xl bg-[#1a1a1a]">
                  <p>No sections yet. Start by adding your first section.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        mode={lessonModalMode}
        lessonData={activeLessonData}
        onSave={handleSaveLesson}
      />
    </div>
  );
}
