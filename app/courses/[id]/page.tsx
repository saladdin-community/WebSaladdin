"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";
import PrivateYouTubePlayer from "@/app/components/video/PrivateYoutubePlayer";
import { useGetApiCoursesSlug } from "@/app/lib/generated/hooks";

interface VideoLesson {
  id: number;
  title: string;
  slug: string;
  type: string;
  status: "Completed" | "On Progress" | "Locked";
  video_url?: string;
  duration?: number;
  description?: string;
}

interface CourseSection {
  id: number;
  title: string;
  lessons: VideoLesson[];
}

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeSection, setActiveSection] = useState<string>("1");
  const [activeLesson, setActiveLesson] = useState<string>("1");
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");

  // Fetch course data
  const { data: courseData, isLoading } = useGetApiCoursesSlug(params.id);

  // Set current video URL when lesson changes
  useEffect(() => {
    const currentLesson = getCurrentLesson();
    if (currentLesson?.video_url) {
      setCurrentVideoUrl(currentLesson.video_url);
    }
  }, [activeLesson, activeSection, courseData]);

  // Handler functions
  const handlePlayPause = (isPlaying: boolean) => {
    console.log("Video is playing:", isPlaying);
  };

  const handleFullscreenChange = (isFullscreen: boolean) => {
    console.log("Fullscreen:", isFullscreen);
  };

  const handleProgressChange = (progress: number) => {
    console.log("Progress:", progress);
  };

  const handleVolumeChange = (volume: number) => {
    console.log("Volume:", volume);
  };

  const handleNextLesson = () => {
    const currentLesson = getCurrentLesson();
    const currentSection = getCurrentSection();

    if (!currentLesson || !currentSection) return;

    const currentIndex = currentSection.lessons.findIndex(
      (l) => l.id === currentLesson.id,
    );

    if (currentIndex < currentSection.lessons.length - 1) {
      const nextLesson = currentSection.lessons[currentIndex + 1];
      setActiveLesson(nextLesson.id.toString());
    } else {
      const sections = courseData?.data?.sections || [];
      const currentSectionIndex = sections.findIndex(
        (s) => s.id === currentSection.id,
      );

      if (currentSectionIndex < sections.length - 1) {
        const nextSection = sections[currentSectionIndex + 1];
        setActiveSection(nextSection.id.toString());
        setActiveLesson(nextSection.lessons[0].id.toString());
      }
    }
  };

  const handlePreviousLesson = () => {
    const currentLesson = getCurrentLesson();
    const currentSection = getCurrentSection();

    if (!currentLesson || !currentSection) return;

    const currentIndex = currentSection.lessons.findIndex(
      (l) => l.id === currentLesson.id,
    );

    if (currentIndex > 0) {
      const prevLesson = currentSection.lessons[currentIndex - 1];
      setActiveLesson(prevLesson.id.toString());
    } else {
      const sections = courseData?.data?.sections || [];
      const currentSectionIndex = sections.findIndex(
        (s) => s.id === currentSection.id,
      );

      if (currentSectionIndex > 0) {
        const prevSection = sections[currentSectionIndex - 1];
        setActiveSection(prevSection.id.toString());
        setActiveLesson(
          prevSection.lessons[prevSection.lessons.length - 1].id.toString(),
        );
      }
    }
  };

  // Helper functions
  const getCurrentSection = () => {
    if (!courseData?.data?.sections) return null;
    return courseData.data.sections.find(
      (s) => s.id === parseInt(activeSection),
    );
  };

  const getCurrentLesson = () => {
    const currentSection = getCurrentSection();
    if (!currentSection) return null;

    return currentSection.lessons.find((l) => l.id === parseInt(activeLesson));
  };

  const getLessonIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-5 w-5 text-[#22c55e]" />;
      case "On Progress":
        return (
          <div className="h-5 w-5 rounded-full border-2 border-[#d4af35] border-t-transparent animate-spin" />
        );
      case "Locked":
        return <Lock className="h-5 w-5 text-[#737373]" />;
      default:
        return <Circle className="h-5 w-5 text-[#404040]" />;
    }
  };

  const calculateOverallProgress = () => {
    if (!courseData?.data?.sections) return 0;

    let totalLessons = 0;
    let completedLessons = 0;

    courseData.data.sections.forEach((section: CourseSection) => {
      section.lessons.forEach((lesson: VideoLesson) => {
        totalLessons++;
        if (lesson.status === "Completed") {
          completedLessons++;
        }
      });
    });

    return totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-[#d4af35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#d4d4d4]">Loading course...</p>
        </div>
      </div>
    );
  }

  const currentLesson = getCurrentLesson();
  const overallProgress = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
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

              {currentLesson?.status === "On Progress" && (
                <button className="btn btn-primary px-6 py-2.5 font-bold">
                  Mark Complete
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
            {/* Private YouTube Video Player */}
            <div className="mb-6">
              <PrivateYouTubePlayer
                youtubeUrl={"https://www.youtube.com/watch?v=mlVgtBajMTE"}
                title={currentLesson?.title || "Course Video"}
                onPlayPause={handlePlayPause}
                onFullscreenChange={handleFullscreenChange}
                onProgressChange={handleProgressChange}
                onVolumeChange={handleVolumeChange}
                maxPlaybackRate={2}
                showControls={true}
              />
            </div>

            {/* Lesson Info - Simplified */}
            {currentLesson && (
              <div className="card mb-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {currentLesson.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-[#737373]">
                    {currentLesson.duration && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {formatDuration(currentLesson.duration)}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {currentLesson.type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        currentLesson.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : currentLesson.status === "On Progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {currentLesson.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-[#d4d4d4] leading-relaxed">
                  <p>
                    {currentLesson.description ||
                      `This lesson covers important concepts related to ${currentLesson.title.toLowerCase()}.`}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Only */}
            <div className="flex justify-between gap-4">
              <button
                onClick={handlePreviousLesson}
                disabled={!getCurrentLesson()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1f1f1f] hover:bg-[#262626] text-[#d4d4d4] hover:text-white rounded-md transition-all duration-300 border border-[rgba(255,255,255,0.1)] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>
              <button
                onClick={handleNextLesson}
                disabled={
                  !getCurrentLesson() || currentLesson?.status === "Locked"
                }
                className="flex items-center justify-center gap-2 px-6 py-3 btn-primary font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </button>
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
                            {section.lessons.map((lesson: VideoLesson) => (
                              <button
                                key={lesson.id}
                                onClick={() =>
                                  lesson.status !== "Locked" &&
                                  setActiveLesson(lesson.id.toString())
                                }
                                className={`w-full p-3 rounded-md flex items-center justify-between transition-all duration-300 ${
                                  activeLesson === lesson.id.toString()
                                    ? "bg-gradient-to-r from-[rgba(212,175,53,0.2)] to-[rgba(253,224,71,0.1)] border border-[rgba(212,175,53,0.3)]"
                                    : lesson.status === "Locked"
                                      ? "opacity-50 cursor-not-allowed"
                                      : "hover:bg-[#262626] border border-transparent"
                                }`}
                                disabled={lesson.status === "Locked"}
                              >
                                <div className="flex items-center gap-3">
                                  {getLessonIcon(lesson.status)}
                                  <span
                                    className={`text-sm truncate ${
                                      activeLesson === lesson.id.toString()
                                        ? "text-[#d4af35] font-semibold"
                                        : lesson.status === "Locked"
                                          ? "text-[#737373]"
                                          : "text-[#d4d4d4]"
                                    }`}
                                  >
                                    {lesson.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {lesson.duration && (
                                    <span className="text-xs text-[#737373] whitespace-nowrap">
                                      {formatDuration(lesson.duration)}
                                    </span>
                                  )}
                                  {lesson.status === "Locked" && (
                                    <Lock className="h-3 w-3 text-[#737373]" />
                                  )}
                                </div>
                              </button>
                            ))}
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
