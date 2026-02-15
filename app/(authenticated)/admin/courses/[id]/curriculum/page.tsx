"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/app/lib/api-client";
import { Lesson } from "@/types/types";
import { useGetApiAdminCoursesId } from "@/app/lib/generated/hooks/useGetApiAdminCoursesId";
import { useGetApiAdminCoursesCourseidSections } from "@/app/lib/generated/hooks/useGetApiAdminCoursesCourseidSections";
import { useDeleteApiAdminSectionsSectionid } from "@/app/lib/generated/hooks/useDeleteApiAdminSectionsSectionid";
import { useDeleteApiAdminLessonsLessonid } from "@/app/lib/generated/hooks/useDeleteApiAdminLessonsLessonid";
import {
  postApiAdminCoursesCourseIdSections,
  postApiAdminSectionsSectionIdLessons,
} from "@/app/lib/api/admin-courses";
import { ArrowLeft, Plus } from "lucide-react";
import CourseSectionList from "@/app/components/courses/CourseSectionList";
import LessonModal from "@/app/components/courses/LessonModal";
import { getApiAdminSectionsSectionidLessons } from "@/app/lib/generated/hooks/useGetApiAdminSectionsSectionidLessons";

export default function CurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseIdRaw } = use(params);
  const courseId = parseInt(courseIdRaw);
  const router = useRouter();

  // State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonModalMode, setLessonModalMode] = useState<"add" | "edit">("add");
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [activeLessonData, setActiveLessonData] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [sectionLessons, setSectionLessons] = useState<
    Record<number, Lesson[]>
  >({});

  // Fetch Course Data (for title context)
  const { data: courseData } = useGetApiAdminCoursesId(courseId);

  // Fetch Sections
  const { data: sectionsData, refetch: refetchSections } =
    useGetApiAdminCoursesCourseidSections(courseId);

  // Fetch Lessons Helper
  const fetchLessonsForSection = async (sectionId: number) => {
    try {
      const res = await getApiAdminSectionsSectionidLessons(sectionId);
      if (res.status === "success" || res.data) {
        // Handle both possible response structures (Kubb generated might return data directly or wrapped)
        // Checking generated file: returns res.data.
        // If API returns { status: "success", data: [] }, then res is that object.
        const data = res.data || [];

        const mappedLessons = data.map((l: any) => ({
          id: l.id,
          title: l.title,
          type: l.type,
          content_source: l.content_source,
          content_url: l.content_url || l.video_url || l.article_url,
          content_path: l.content_path,
          content_text: l.content_text || l.overview || l.additional_text,
          passingGrade: l.passing_grade,
          evaluationDesc: l.evaluation_description,
        }));
        setSectionLessons((prev) => ({
          ...prev,
          [sectionId]: mappedLessons,
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch lessons for section ${sectionId}`, error);
    }
  };

  // Mutations
  const { mutate: deleteSection } = useDeleteApiAdminSectionsSectionid({
    mutation: {
      onSuccess: () => {
        refetchSections();
        alert("Section deleted successfully");
      },
      onError: (error) => {
        console.error("Failed to delete section", error);
        alert("Failed to delete section");
      },
    },
  });

  const { mutate: deleteLesson } = useDeleteApiAdminLessonsLessonid({
    mutation: {
      onSuccess: () => {
        // Refresh specific section
        expandedSections.forEach((id) => fetchLessonsForSection(id));
        alert("Lesson deleted successfully");
      },
      onError: (error) => {
        console.error("Failed to delete lesson", error);
        alert("Failed to delete lesson");
      },
    },
  });

  // Handlers
  const handleAddSection = async () => {
    const title = window.prompt("Enter section title:");
    if (!title) return;

    try {
      await postApiAdminCoursesCourseIdSections(courseId, { title });
      refetchSections();
    } catch (error) {
      console.error("Failed to add section", error);
      alert("Failed to add section");
    }
  };

  const handleToggleSection = (sectionId: number) => {
    setExpandedSections((prev) => {
      const isExpanding = !prev.includes(sectionId);
      if (isExpanding) {
        fetchLessonsForSection(sectionId);
        return [...prev, sectionId];
      } else {
        return prev.filter((id) => id !== sectionId);
      }
    });
  };

  const handleAddLesson = (sectionId: number) => {
    setActiveSectionId(sectionId);
    setLessonModalMode("add");
    setActiveLessonData(null);
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (sectionId: number, lessonId: number) => {
    setActiveSectionId(sectionId);
    setActiveLessonId(lessonId);
    setLessonModalMode("edit");

    const lesson = sectionLessons[sectionId]?.find((l) => l.id === lessonId);
    setActiveLessonData(lesson || {});
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (lessonData: Partial<Lesson>) => {
    if (!activeSectionId) return;

    try {
      const payload = new FormData();
      if (lessonData.title) payload.append("title", lessonData.title);
      if (lessonData.content_text)
        payload.append("content_text", lessonData.content_text);
      if (lessonData.content_url)
        payload.append("content_url", lessonData.content_url);

      if (lessonData.passingGrade)
        payload.append("passing_grade", lessonData.passingGrade.toString());
      if (lessonData.evaluationDesc)
        payload.append("evaluation_description", lessonData.evaluationDesc);

      let type = lessonData.type || "text";
      let contentSource = lessonData.content_source || "external";

      if (lessonData.videoFile) {
        type = "video";
        contentSource = "upload";
      } else if (lessonData.articleFile) {
        type = "document";
        contentSource = "upload";
      } else if (lessonData.passingGrade) {
        type = "quiz";
      }

      payload.append("type", type);
      payload.append("content_source", contentSource);

      payload.append("type", type);

      if (lessonData.videoFile) {
        payload.append("content_source", "upload");
        payload.append("content_path", lessonData.videoFile);
      }

      if (lessonData.articleFile) {
        payload.append("content_source", "upload");
        payload.append("content_path", lessonData.articleFile);
      }

      await postApiAdminSectionsSectionIdLessons(activeSectionId, payload);

      setIsLessonModalOpen(false);
      refetchSections();
      fetchLessonsForSection(activeSectionId);
    } catch (error) {
      console.error("Failed to save lesson", error);
      alert("Failed to save lesson");
    }
  };

  // Merge Data
  const sectionsWithLessons =
    sectionsData?.data?.map((section: any) => ({
      ...section,
      lessons: sectionLessons[section.id] || [],
    })) || [];

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.1)] pb-6">
          <div>
            <button
              onClick={() => router.push(`/admin/courses/${courseId}/edit`)}
              className="flex items-center gap-2 text-[#737373] hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Course Details
            </button>
            <h1 className="text-2xl font-bold">Curriculum Management</h1>
            <p className="text-[#a3a3a3] mt-1">
              Manage sections and lessons for{" "}
              <span className="text-[#d4af35]">
                {courseData?.data?.title || "Loading..."}
              </span>
            </p>
          </div>
          <button
            onClick={handleAddSection}
            className="flex items-center gap-2 px-4 py-2 bg-[#d4af35] text-black font-semibold rounded-lg hover:bg-[#b8952b] transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </button>
        </div>

        {/* Sections List */}
        <div className="bg-[#1a1a1a] rounded-xl border border-[rgba(255,255,255,0.05)] p-6">
          <CourseSectionList
            sections={sectionsWithLessons}
            expandedSections={expandedSections}
            onToggleSection={handleToggleSection}
            onAddLesson={handleAddLesson}
            onDeleteSection={(id) => {
              if (confirm("Are you sure you want to delete this section?"))
                deleteSection({ sectionId: id });
            }}
            onDeleteLesson={(sectionId, lessonId) => {
              if (confirm("Are you sure you want to delete this lesson?"))
                deleteLesson({ lessonId });
            }}
            onEditLesson={handleEditLesson}
          />

          {sectionsWithLessons.length === 0 && (
            <div className="text-center py-12 text-[#737373]">
              <p>No sections yet. Click "Add Section" to get started.</p>
            </div>
          )}
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
