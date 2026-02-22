"use client";

import { useState, useEffect, use, useMemo } from "react";
import FeedbackModal from "@/app/components/modal/FeedbackModal";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import {
  BookOpen,
  Clock,
  MessageSquare,
  FileText,
  CheckCircle,
  Circle,
  Lock,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  File,
} from "lucide-react";
import Link from "next/link";
import PrivateYouTubePlayer from "@/app/components/video/PrivateYoutubePlayer";
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
  is_completed?: boolean; // Might come from course list or detail
}

interface CourseLessonItem {
  id: number;
  title: string;
  slug: string;
  type: "video" | "document" | "text" | "quiz";
  is_completed: boolean;
  duration?: number; // Not in provided example, but kept for UI if available later
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
  // true once the currently-playing video has ended and been marked complete
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);

  const { modal: feedbackModal, success: showSuccess } = useFeedbackModal();

  const queryClient = useQueryClient();

  // Fetch course structure (Sections & Lesson List)
  const { data: courseData, isLoading: isCourseLoading } =
    useGetApiCoursesSlug(slugIdRaw);

  // Fetch specific lesson details when activeLesson changes
  const { data: lessonData, isLoading: isLessonLoading } =
    useGetApiLessonsLessonid(activeLesson ? parseFloat(activeLesson) : 0, {
      query: {
        enabled: !!activeLesson,
      },
    });

  // Mutation for completing lesson
  const completeLessonMutation = usePostApiLessonsLessonidComplete();

  // Initialize Active Section/Lesson on Load
  useEffect(() => {
    if (
      courseData?.data?.sections &&
      courseData.data.sections.length > 0 &&
      !activeLesson
    ) {
      const firstSection = courseData.data.sections[0];
      setActiveSection(firstSection.id.toString());
      if (firstSection.lessons && firstSection.lessons.length > 0) {
        setActiveLesson(firstSection.lessons[0].id.toString());
      }
    }
  }, [courseData?.data?.sections, activeLesson]);

  // Reset video-completed flag whenever the user switches lesson
  useEffect(() => {
    setIsVideoCompleted(false);
  }, [activeLesson]);

  // Update video URL when lesson detail is loaded
  useEffect(() => {
    if (lessonData?.data?.type === "video" && lessonData.data.content?.url) {
      setCurrentVideoUrl(lessonData.data.content.url);
    }
  }, [lessonData]);

  // Calculate locked lessons
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

  // Handler functions
  const handlePlayPause = (isPlaying: boolean) => {
    // console.log("Video is playing:", isPlaying);
  };

  const handleLessonComplete = async (
    lessonId: number,
    navigateNext: boolean = false,
  ) => {
    try {
      await completeLessonMutation.mutateAsync({ lessonId });
      // Invalidate course data to update sidebar progress/status
      await queryClient.invalidateQueries({
        queryKey: getApiCoursesSlugQueryKey(slugIdRaw),
      });
      // Also potentially invalidate lesson detail if it carries status

      if (navigateNext) {
        navigateToNextLesson();
      }
    } catch (error) {
      console.error("Failed to complete lesson:", error);
      // Still navigate if requested? Maybe yes for UX
      if (navigateNext) {
        navigateToNextLesson();
      }
    }
  };

  const navigateToNextLesson = () => {
    if (!courseData?.data?.sections) return;

    // Find current indices
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

    // Try next lesson in same section
    if (currentLessonIndex < currentSection.lessons.length - 1) {
      const nextLesson = currentSection.lessons[currentLessonIndex + 1];
      setActiveLesson(nextLesson.id.toString());
    }
    // Try first lesson of next section
    else if (currentSectionIndex < courseData.data.sections.length - 1) {
      const nextSection = courseData.data.sections[currentSectionIndex + 1];
      setActiveSection(nextSection.id.toString());
      if (nextSection.lessons.length > 0) {
        setActiveLesson(nextSection.lessons[0].id.toString());
      }
    }
  };

  const handleNextButtonClick = () => {
    const currentLessonConfig = getCurrentLessonConfig();

    // If current lesson is NOT completed, complete it first
    if (currentLessonConfig && !currentLessonConfig.is_completed) {
      handleLessonComplete(currentLessonConfig.id, true);
    } else {
      // Just navigate
      navigateToNextLesson();
    }
  };

  const handlePreviousLesson = () => {
    if (!courseData?.data?.sections) return;

    // Find current indices
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

    // Try prev lesson in same section
    if (currentLessonIndex > 0) {
      const prevLesson = currentSection.lessons[currentLessonIndex - 1];
      setActiveLesson(prevLesson.id.toString());
    }
    // Try last lesson of prev section
    else if (currentSectionIndex > 0) {
      const prevSection = courseData.data.sections[currentSectionIndex - 1];
      setActiveSection(prevSection.id.toString());
      if (prevSection.lessons.length > 0) {
        setActiveLesson(
          prevSection.lessons[prevSection.lessons.length - 1].id.toString(),
        );
      }
    }
  };

  // Helper to get current lesson from COURSE LIST (contains status)
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
    if (isLocked) return <Lock className="h-4 w-4 text-[#525252]" />;
    if (isCompleted) return <CheckCircle className="h-5 w-5 text-[#22c55e]" />;

    switch (type) {
      case "video":
        return <PlayCircle className="h-5 w-5 text-[#d4af35]" />;
      case "document":
        return <File className="h-5 w-5 text-[#3b82f6]" />; // Blue for docs
      case "text":
        return <FileText className="h-5 w-5 text-[#a3a3a3]" />;
      case "quiz":
        return <CheckCircle className="h-5 w-5 text-[#a3a3a3]" />; // Placeholder
      default:
        return <Circle className="h-5 w-5 text-[#404040]" />;
    }
  };

  // Calculate progress override
  const calculateOverallProgress = () => {
    if (!courseData?.data?.sections) return 0;

    let totalLessons = 0;
    let completedLessons = 0;

    courseData.data.sections.forEach((section: CourseSection) => {
      section.lessons.forEach((lesson: CourseLessonItem) => {
        totalLessons++;
        if (lesson.is_completed) {
          completedLessons++;
        }
      });
    });

    return totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
  };

  if (isCourseLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[#d4af35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#d4d4d4]">Loading course...</p>
        </div>
      </div>
    );
  }

  const overallProgress = calculateOverallProgress();
  // Active lesson detail from API
  const activeLessonDetail = lessonData?.data;

  console.log("this is lesson Data: ", lessonData);
  // Active lesson status/config from Sidebar list
  const activeLessonConfig = getCurrentLessonConfig();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Video-completion feedback modal */}
      <FeedbackModal
        {...feedbackModal}
        actions={[
          {
            label: "Next Lesson →",
            variant: "primary",
            onClick: () => {
              navigateToNextLesson();
            },
          },
          {
            label: "Stay Here",
            variant: "ghost",
            onClick: () => {},
          },
        ]}
      />
      {/* Header - Simplified */}
      <header className="border-b border-[rgba(255,255,255,0.1)] bg-[#121212]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/courses"
                className="flex items-center gap-2 text-[#a3a3a3] hover:text-white transition-colors duration-300"
              >
                <ChevronLeft className="h-5 w-5" />
                Back to Courses
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {courseData?.data?.title || "Course Title"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-32 bg-[#404040] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#d4af35] to-[#fde047] rounded-full transition-all duration-500"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-[#d4d4d4]">
                    {overallProgress}%
                  </span>
                </div>
              </div>

              {/* Mark as Completed Button */}
              {activeLessonConfig && !activeLessonConfig.is_completed && (
                <button
                  onClick={() => handleLessonComplete(activeLessonConfig.id)}
                  disabled={completeLessonMutation.isPending}
                  className="btn btn-primary px-6 py-2.5 font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {completeLessonMutation.isPending
                    ? "Updating..."
                    : "Mark Complete"}
                </button>
              )}
              {activeLessonConfig && activeLessonConfig.is_completed && (
                <button className="px-6 py-2.5 font-bold flex items-center gap-2 text-[#22c55e] border border-[#22c55e]/20 bg-[#22c55e]/10 rounded-md cursor-default">
                  <CheckCircle className="h-5 w-5" />
                  Completed
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Video Player & Content */}
          <div className="lg:w-2/3">
            {isLessonLoading ? (
              <div className="h-[400px] bg-[#262626] animate-pulse rounded-lg flex items-center justify-center text-[#737373]">
                Loading content...
              </div>
            ) : activeLessonDetail ? (
              <>
                {/* Render Content Based on Type */}

                {/* Video Lesson */}
                {activeLessonDetail.type === "video" && (
                  <div className="mb-6">
                    <PrivateYouTubePlayer
                      youtubeUrl={activeLessonDetail.content?.url || ""} // Fallback needed?
                      title={activeLessonDetail.title || "Lesson Video"}
                      onPlayPause={handlePlayPause}
                      // onFullscreenChange={handleFullscreenChange}
                      // onProgressChange={handleProgressChange}
                      // onVolumeChange={handleVolumeChange}
                      maxPlaybackRate={2}
                      showControls={true}
                      onEnded={async () => {
                        if (activeLessonConfig) {
                          // 1. Mark lesson complete on the backend
                          await handleLessonComplete(activeLessonConfig.id);
                        }
                        // 2. Show the celebration modal
                        showSuccess(
                          "Video Completed! 🎉",
                          'Great job finishing this lesson. Click "Next Lesson" below to continue.',
                        );
                        // 3. Unlock the Next button
                        setIsVideoCompleted(true);
                      }}
                    />
                  </div>
                )}

                {/* Text/Article Lesson */}
                {activeLessonDetail.type === "text" && (
                  <div className="card mb-6">
                    <div className="prose prose-invert max-w-none text-[#d4d4d4] leading-relaxed">
                      {activeLessonDetail.content_text}
                    </div>
                  </div>
                )}

                {/* Document/PDF Lesson */}
                {activeLessonDetail.type === "document" && (
                  <div className="card mb-6 p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                    <FileText className="h-16 w-16 text-[#d4af35] mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      {activeLessonDetail.title}
                    </h3>
                    <p className="text-[#a3a3a3] mb-6">
                      This lesson contains a document resource.
                    </p>
                    {activeLessonDetail.content?.url ? (
                      <a
                        href={activeLessonDetail.content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary px-6 py-3 flex items-center gap-2"
                      >
                        <BookOpen className="h-5 w-5" />
                        View/Download Document
                      </a>
                    ) : (
                      <div className="text-red-400">
                        Document URL not available
                      </div>
                    )}
                  </div>
                )}

                {/* Quiz Placeholder */}
                {activeLessonDetail.type === "quiz" && (
                  <div className="card mb-6 p-8 text-center text-[#d4d4d4]">
                    <h3 className="text-xl font-bold mb-2">
                      Quiz: {activeLessonDetail.title}
                    </h3>
                    <p>Quiz functionality coming soon.</p>
                  </div>
                )}

                {/* Lesson Info */}
                <div className="card mb-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {activeLessonDetail.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-[#737373]">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span className="capitalize">
                          {activeLessonDetail.type}
                        </span>
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          activeLessonConfig?.is_completed
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {activeLessonConfig?.is_completed
                          ? "Completed"
                          : "On Progress"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 text-[#d4d4d4] leading-relaxed">
                    <p>
                      {/* Description might not be in the detail payload directly, check response */}
                      {/* {activeLessonDetail.description} */}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-[#737373]">
                Select a lesson to view content
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-4">
              <button
                onClick={handlePreviousLesson}
                // Logic to disable if first
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1f1f1f] hover:bg-[#262626] text-[#d4d4d4] hover:text-white rounded-md transition-all duration-300 border border-[rgba(255,255,255,0.1)] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>
              {/* Next button: visible for non-video lessons, OR when video is completed */}
              {(activeLessonDetail?.type !== "video" || isVideoCompleted) && (
                <button
                  onClick={handleNextButtonClick}
                  className="flex items-center justify-center gap-2 px-6 py-3 btn-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed text-black"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Course Navigation */}
          <div className="lg:w-1/3">
            <div className="card">
              {/* Course Sections */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Course Modules
                </h3>
                <div className="space-y-4">
                  {courseData?.data?.sections?.map((section: CourseSection) => (
                    <div
                      key={section.id}
                      className="border border-[rgba(255,255,255,0.1)] rounded-lg overflow-hidden bg-[#1a1a1a]"
                    >
                      <button
                        onClick={() =>
                          setActiveSection(
                            activeSection === section.id.toString()
                              ? ""
                              : section.id.toString(),
                          )
                        }
                        className={`w-full p-4 text-left transition-colors duration-300 ${
                          activeSection === section.id.toString()
                            ? "bg-[rgba(212,175,53,0.1)]"
                            : "hover:bg-[#262626]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">
                            {section.title}
                          </h4>
                          <ChevronRight
                            className={`h-5 w-5 text-[#737373] transition-transform duration-300 ${
                              activeSection === section.id.toString()
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        </div>
                        <p className="text-xs text-[#737373] text-left">
                          {section.lessons.length} lessons
                        </p>
                      </button>

                      {activeSection === section.id.toString() && (
                        <div className="p-4 pt-2 border-t border-[rgba(255,255,255,0.1)]">
                          <div className="space-y-2">
                            {section.lessons.map((lesson: CourseLessonItem) => {
                              const isLocked = lockedLessonIds.has(
                                lesson.id.toString(),
                              );
                              return (
                                <button
                                  key={lesson.id}
                                  disabled={isLocked}
                                  onClick={() =>
                                    setActiveLesson(lesson.id.toString())
                                  }
                                  className={`w-full p-3 rounded-md flex items-center justify-between transition-all duration-300 ${
                                    activeLesson === lesson.id.toString()
                                      ? "bg-gradient-to-r from-[rgba(212,175,53,0.2)] to-[rgba(253,224,71,0.1)] border border-[rgba(212,175,53,0.3)]"
                                      : isLocked
                                        ? "opacity-50 cursor-not-allowed border border-transparent"
                                        : "hover:bg-[#262626] border border-transparent"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {getLessonIcon(
                                      lesson.type,
                                      lesson.is_completed,
                                      isLocked,
                                    )}
                                    <span
                                      className={`text-sm truncate ${
                                        activeLesson === lesson.id.toString()
                                          ? "text-[#d4af35] font-semibold"
                                          : isLocked
                                            ? "text-[#525252]"
                                            : "text-[#d4d4d4]"
                                      }`}
                                    >
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {/* Duration if available */}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources - Simplified */}
              <div className="pt-6 mt-6 border-t border-[rgba(255,255,255,0.1)]">
                <h3 className="text-lg font-bold text-white mb-4">Resources</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 bg-[#1f1f1f] hover:bg-[#262626] rounded-md transition-all duration-300 border border-[rgba(255,255,255,0.1)]">
                    <FileText className="h-5 w-5 text-[#d4d4d4]" />
                    <span className="text-[#d4d4d4]">Lesson Notes</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-[#1f1f1f] hover:bg-[#262626] rounded-md transition-all duration-300 border border-[rgba(255,255,255,0.1)]">
                    <MessageSquare className="h-5 w-5 text-[#d4d4d4]" />
                    <span className="text-[#d4d4d4]">Discussion Forum</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
