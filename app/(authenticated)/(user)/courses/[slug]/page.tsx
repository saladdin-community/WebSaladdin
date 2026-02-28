"use client";

import { useState, useEffect, use, useMemo } from "react";
import FeedbackModal from "@/app/components/modal/FeedbackModal";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import {
  BookOpen,
  CheckCircle,
  Circle,
  Lock,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  Download,
  Loader2,
  Eye,
  File,
} from "lucide-react";
import Link from "next/link";
import PrivateYouTubePlayer from "@/app/components/video/PrivateYoutubePlayer";
import QuizContent from "@/app/components/courses/QuizContent";
import {
  useGetApiCoursesSlug,
  useGetApiLessonsLessonid,
  usePostApiLessonsLessonidComplete,
  getApiCoursesSlugQueryKey,
} from "@/app/lib/generated/hooks";
import { useQueryClient } from "@tanstack/react-query";

interface LessonContent {
  source: string;
  url: string;
  mime: string | null;
}

interface LessonDetail {
  id: number;
  title: string;
  slug: string;
  type: "video" | "document" | "text" | "quiz";
  content?: LessonContent;
  content_text?: string;
  is_completed?: boolean;
}

interface CourseLessonItem {
  id: number;
  title: string;
  slug: string;
  type: "video" | "document" | "text" | "quiz";
  is_completed: boolean;
  duration?: number;
}

interface CourseSection {
  id: number;
  title: string;
  lessons: CourseLessonItem[];
}

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: slugIdRaw } = use(params);

  const [activeSection, setActiveSection] = useState<string>("");
  const [activeLesson, setActiveLesson] = useState<string>("");
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [isDocumentRead, setIsDocumentRead] = useState(false);
  const [isQuizPassed, setIsQuizPassed] = useState(false);

  const { modal: feedbackModal, success: showSuccess } = useFeedbackModal();
  const queryClient = useQueryClient();

  // Fetch course structure
  const { data: courseData, isLoading: isCourseLoading } =
    useGetApiCoursesSlug(slugIdRaw);

  // Fetch specific lesson details
  const { data: lessonData, isLoading: isLessonLoading } =
    useGetApiLessonsLessonid(activeLesson ? parseFloat(activeLesson) : 0, {
      query: {
        enabled: !!activeLesson,
      },
    });

  const completeLessonMutation = usePostApiLessonsLessonidComplete();

  // Resume logic
  useEffect(() => {
    if (
      courseData?.data?.sections &&
      courseData.data.sections.length > 0 &&
      !activeLesson
    ) {
      const sections: CourseSection[] = courseData.data.sections;
      const allLessons: { section: CourseSection; lesson: CourseLessonItem }[] =
        [];
      sections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          allLessons.push({ section, lesson });
        });
      });

      const resumeRef =
        allLessons.find((ref) => !ref.lesson.is_completed) ??
        allLessons[allLessons.length - 1];

      if (resumeRef) {
        setActiveSection(resumeRef.section.id.toString());
        setActiveLesson(resumeRef.lesson.id.toString());
      }
    }
  }, [courseData?.data?.sections, activeLesson]);

  // Reset flags
  useEffect(() => {
    setIsVideoCompleted(false);
    setIsDocumentRead(false);
    setIsQuizPassed(false);
  }, [activeLesson]);

  // Update video URL
  useEffect(() => {
    if (lessonData?.data?.type === "video" && lessonData.data.content?.url) {
      setCurrentVideoUrl(lessonData.data.content.url);
    }
  }, [lessonData]);

  // Locked lessons logic
  const lockedLessonIds = useMemo(() => {
    const lockedIds = new Set<string>();
    let foundFirstIncomplete = false;

    if (courseData?.data?.sections) {
      courseData.data.sections.forEach((section: CourseSection) => {
        section.lessons.forEach((lesson: CourseLessonItem) => {
          if (foundFirstIncomplete) {
            lockedIds.add(lesson.id.toString());
          } else if (!lesson.is_completed) {
            foundFirstIncomplete = true;
          }
        });
      });
    }
    return lockedIds;
  }, [courseData]);

  const handleLessonComplete = async (
    lessonId: number,
    navigateNext: boolean = false,
  ) => {
    try {
      await completeLessonMutation.mutateAsync({ lessonId });
      await queryClient.invalidateQueries({
        queryKey: getApiCoursesSlugQueryKey(slugIdRaw),
      });
      if (navigateNext) navigateToNextLesson();
    } catch (error) {
      console.error("Failed to complete lesson:", error);
      if (navigateNext) navigateToNextLesson();
    }
  };

  const navigateToNextLesson = () => {
    if (!courseData?.data?.sections) return;
    let currentSectionIndex = -1;
    let currentLessonIndex = -1;

    courseData.data.sections.forEach(
      (section: CourseSection, sIndex: number) => {
        const lIndex = section.lessons.findIndex(
          (l: CourseLessonItem) => l.id.toString() === activeLesson,
        );
        if (lIndex !== -1) {
          currentSectionIndex = sIndex;
          currentLessonIndex = lIndex;
        }
      },
    );

    if (currentSectionIndex === -1) return;
    const currentSection = courseData.data.sections[currentSectionIndex];

    if (currentLessonIndex < currentSection.lessons.length - 1) {
      const nextLesson = currentSection.lessons[currentLessonIndex + 1];
      setActiveLesson(nextLesson.id.toString());
    } else if (currentSectionIndex < courseData.data.sections.length - 1) {
      const nextSection = courseData.data.sections[currentSectionIndex + 1];
      setActiveSection(nextSection.id.toString());
      if (nextSection.lessons.length > 0) {
        setActiveLesson(nextSection.lessons[0].id.toString());
      }
    }
  };

  const handleNextButtonClick = () => {
    const currentConfig = getCurrentLessonConfig();
    if (currentConfig && !currentConfig.is_completed) {
      handleLessonComplete(currentConfig.id, true);
    } else {
      navigateToNextLesson();
    }
  };

  const handlePreviousLesson = () => {
    if (!courseData?.data?.sections) return;
    let currentSectionIndex = -1;
    let currentLessonIndex = -1;

    courseData.data.sections.forEach(
      (section: CourseSection, sIndex: number) => {
        const lIndex = section.lessons.findIndex(
          (l: CourseLessonItem) => l.id.toString() === activeLesson,
        );
        if (lIndex !== -1) {
          currentSectionIndex = sIndex;
          currentLessonIndex = lIndex;
        }
      },
    );

    if (currentSectionIndex === -1) return;
    const currentSection = courseData.data.sections[currentSectionIndex];

    if (currentLessonIndex > 0) {
      const prevLesson = currentSection.lessons[currentLessonIndex - 1];
      setActiveLesson(prevLesson.id.toString());
    } else if (currentSectionIndex > 0) {
      const prevSection = courseData.data.sections[currentSectionIndex - 1];
      setActiveSection(prevSection.id.toString());
      if (prevSection.lessons.length > 0) {
        setActiveLesson(
          prevSection.lessons[prevSection.lessons.length - 1].id.toString(),
        );
      }
    }
  };

  const getCurrentLessonConfig = (): CourseLessonItem | undefined => {
    if (!courseData?.data?.sections) return undefined;
    for (const section of courseData.data.sections) {
      const found = section.lessons.find(
        (l) => l.id.toString() === activeLesson,
      );
      if (found) return found;
    }
    return undefined;
  };

  const getLessonIcon = (
    type: string,
    isCompleted: boolean,
    isLocked: boolean,
  ) => {
    if (isLocked) return <Lock size={16} className="text-[#404040]" />;
    if (isCompleted)
      return <CheckCircle size={18} className="text-[#22c55e]" />;
    switch (type) {
      case "video":
        return <PlayCircle size={18} className="text-[#d4af35]" />;
      case "document":
        return <FileText size={18} className="text-[#3b82f6]" />;
      case "quiz":
        return <CheckCircle size={18} className="text-[#a3a3a3]" />;
      default:
        return <Circle size={18} className="text-[#404040]" />;
    }
  };

  if (isCourseLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="h-12 w-12 text-[#d4af35] animate-spin mb-4" />
        <p className="text-[#737373] font-medium tracking-wide">
          Loading course structure...
        </p>
      </div>
    );
  }

  const activeLessonDetail = lessonData?.data;
  const activeLessonConfig = getCurrentLessonConfig();
  const overallProgress =
    (courseData?.data?.sections?.reduce(
      (acc: number, sec: any) =>
        acc + sec.lessons.filter((l: any) => l.is_completed).length,
      0,
    ) /
      courseData?.data?.sections?.reduce(
        (acc: number, sec: any) => acc + sec.lessons.length,
        0,
      )) *
      100 || 0;

  return (
    <div className="pb-12">
      <FeedbackModal
        {...feedbackModal}
        actions={[
          {
            label: "Next Lesson",
            variant: "primary",
            onClick: navigateToNextLesson,
          },
          { label: "Stay Here", variant: "ghost", onClick: () => {} },
        ]}
      />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#737373] hover:text-[#d4af35] transition-colors mb-4 group"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Catalog
          </Link>
          <h1 className="text-3xl font-black text-white leading-tight">
            {courseData?.data?.title}
          </h1>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d4af35] rounded-full transition-all duration-1000"
                  style={{ width: `${overallProgress}%` }}
                ></div>
              </div>
              <span className="text-xs font-black text-[#d4af35]">
                {Math.round(overallProgress)}% Done
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {activeLessonConfig && !activeLessonConfig.is_completed ? (
            <button
              onClick={() => handleLessonComplete(activeLessonConfig.id)}
              disabled={completeLessonMutation.isPending}
              className="px-8 py-3 bg-[#d4af35] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#fde047] transition-all duration-300 shadow-lg shadow-[#d4af35]/10 disabled:opacity-50"
            >
              {completeLessonMutation.isPending
                ? "Updating..."
                : "Mark Complete"}
            </button>
          ) : (
            activeLessonConfig?.is_completed && (
              <div className="px-8 py-3 bg-white/5 border border-[#22c55e]/30 text-[#22c55e] font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-2">
                <CheckCircle size={16} />
                Completed
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {isLessonLoading ? (
            <div className="aspect-video bg-[#1a1a1a] rounded-3xl animate-pulse flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-[#262626] animate-spin" />
            </div>
          ) : activeLessonDetail ? (
            <>
              {activeLessonDetail.type === "video" && (
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-black">
                  <PrivateYouTubePlayer
                    youtubeUrl={activeLessonDetail.content?.url || ""}
                    title={activeLessonDetail.title}
                    onPlayPause={() => {}}
                    onEnded={async () => {
                      if (activeLessonConfig)
                        await handleLessonComplete(activeLessonConfig.id);
                      showSuccess(
                        "Lesson Completed!",
                        "You have finished the video. Ready for the next one?",
                      );
                      setIsVideoCompleted(true);
                    }}
                  />
                </div>
              )}

              {activeLessonDetail.type === "text" && (
                <div className="bg-[#1a1a1a] rounded-3xl p-8 lg:p-10 border border-white/5">
                  <div
                    className="prose prose-invert max-w-none text-[#a3a3a3] leading-relaxed prose-headings:text-white prose-strong:text-white"
                    dangerouslySetInnerHTML={{
                      __html: activeLessonDetail.content_text || "",
                    }}
                  />
                </div>
              )}

              {activeLessonDetail.type === "document" && (
                <div className="bg-[#1a1a1a] rounded-3xl overflow-hidden border border-white/5">
                  <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-[#d4af35]" />
                      <span className="text-sm font-bold text-white uppercase tracking-wider">
                        {activeLessonDetail.title}
                      </span>
                    </div>
                    {activeLessonDetail.content?.url && (
                      <a
                        href={activeLessonDetail.content.url}
                        download
                        onClick={() => setIsDocumentRead(true)}
                        className="p-2.5 bg-[#d4af35]/10 text-[#d4af35] rounded-xl hover:bg-[#d4af35]/20 transition-colors"
                      >
                        <Download size={18} />
                      </a>
                    )}
                  </div>
                  {activeLessonDetail.content?.url ? (
                    <iframe
                      src={`${activeLessonDetail.content.url}#toolbar=0`}
                      className="w-full h-[70vh] border-0"
                      onLoad={() => setIsDocumentRead(true)}
                    />
                  ) : (
                    <div className="h-96 flex items-center justify-center text-[#404040]">
                      Document not available
                    </div>
                  )}
                </div>
              )}

              {activeLessonDetail.type === "quiz" && (
                <QuizContent
                  lessonId={activeLessonDetail.id}
                  lessonTitle={activeLessonDetail.title}
                  onPassed={() => {
                    handleLessonComplete(activeLessonDetail.id);
                    setIsQuizPassed(true);
                  }}
                />
              )}

              {/* Lesson Description (Lower Section) */}
              <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1 w-12 bg-[#d4af35] rounded-full"></div>
                  <h2 className="text-xl font-bold text-white">
                    Lesson Overview
                  </h2>
                </div>
                <div
                  className="prose prose-invert max-w-none text-sm text-[#737373] leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: activeLessonDetail.content_text || "",
                  }}
                />
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-[#404040]">
              Select a lesson to begin.
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-2xl border border-white/5">
            <button
              onClick={handlePreviousLesson}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#737373] hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {(activeLessonDetail?.type === "video"
              ? isVideoCompleted
              : activeLessonDetail?.type === "document"
                ? isDocumentRead
                : activeLessonDetail?.type === "quiz"
                  ? isQuizPassed || activeLessonConfig?.is_completed
                  : true) && (
              <button
                onClick={handleNextButtonClick}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all duration-300"
              >
                Next Lesson
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar - Navigation Index */}
        <div className="lg:w-96 space-y-6">
          <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 h-fit sticky top-8">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6">
              Module Index
            </h3>
            <div className="space-y-4">
              {courseData?.data?.sections?.map((section: CourseSection) => (
                <div key={section.id} className="space-y-2">
                  <button
                    onClick={() =>
                      setActiveSection(
                        activeSection === section.id.toString()
                          ? ""
                          : section.id.toString(),
                      )
                    }
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center justify-between ${
                      activeSection === section.id.toString()
                        ? "bg-white/5"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        {section.title}
                      </h4>
                      <p className="text-[10px] text-[#404040] mt-1 uppercase font-bold">
                        {section.lessons.length} Lessons
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-[#404040] transition-transform duration-300 ${activeSection === section.id.toString() ? "rotate-90" : ""}`}
                    />
                  </button>

                  <div
                    className={`space-y-1 overflow-hidden transition-all duration-500 ${activeSection === section.id.toString() ? "max-h-[1000px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                  >
                    {section.lessons.map((lesson: CourseLessonItem) => {
                      const isLocked = lockedLessonIds.has(
                        lesson.id.toString(),
                      );
                      const isActive = activeLesson === lesson.id.toString();
                      return (
                        <button
                          key={lesson.id}
                          disabled={isLocked}
                          onClick={() => setActiveLesson(lesson.id.toString())}
                          className={`w-full group flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300 ${
                            isActive
                              ? "bg-[#d4af35]/10 border border-[#d4af35]/20"
                              : isLocked
                                ? "opacity-30 grayscale"
                                : "hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="shrink-0">
                            {getLessonIcon(
                              lesson.type,
                              lesson.is_completed,
                              isLocked,
                            )}
                          </div>
                          <span
                            className={`text-xs font-bold truncate text-left ${isActive ? "text-[#d4af35]" : isLocked ? "text-[#404040]" : "text-[#737373] group-hover:text-white"}`}
                          >
                            {lesson.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
