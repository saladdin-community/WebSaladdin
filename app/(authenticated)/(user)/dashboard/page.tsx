"use client";

import { useState, useMemo } from "react";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import SidebarNav from "@/app/components/sidebar/SidebarNav";
import SectionHeader from "@/app/components/header/SectionHeader";
import ContinueLearningCard from "@/app/components/card/ContinueLearningCard";
import CourseCard from "@/app/components/card/CourseCard";
import { useGetApiMyCourses } from "@/app/lib/generated/hooks"; // Use MyCourses hook
// import { useGetApiCourses } from "@/app/lib/generated"; // Remove All Courses hook

interface DashboardCourse {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  instructor: string;
  price: number;
  price_formatted: string;
  description: string;
  progress?: number;
  isBookmarked?: boolean;
  isFree?: boolean;
  level: string;
}

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [bookmarkedCourses, setBookmarkedCourses] = useState<number[]>([]);

  // Fetch MY courses data (Enrolled courses)
  const {
    data: myCoursesData,
    isLoading,
    error,
  } = useGetApiMyCourses({
    query: {
      enabled: true,
      staleTime: 5 * 60 * 1000,
    },
  });

  // Transform data
  const myCourses: DashboardCourse[] = useMemo(
    () =>
      myCoursesData?.data?.map((course: any) => ({
        id: course.id,
        title: course.title,
        slug: course.slug,
        thumbnail: course.thumbnail || "/images/default-course.jpg",
        instructor: course.instructor || "Instructor",
        price: course.price || 0,
        price_formatted: course.price_formatted || "Rp 0",
        progress: course.progress || 0,
        isBookmarked: bookmarkedCourses.includes(course.id),
        isFree: course.price === 0,
        level: course.level || "All Levels",
      })) || [],
    [myCoursesData, bookmarkedCourses],
  );

  // Derive "Continue Learning" from the first active course (or most recent)
  // Logic: Find course with progress > 0 and < 100, or just the first one if none
  const continueLearningCourse = useMemo(() => {
    if (myCourses.length === 0) return null;
    return (
      myCourses.find((c) => (c.progress || 0) > 0 && (c.progress || 0) < 100) ||
      myCourses[0]
    );
  }, [myCourses]);

  const continueLearning = continueLearningCourse
    ? {
        id: continueLearningCourse.id,
        title: continueLearningCourse.title,
        instructor: continueLearningCourse.instructor,
        thumbnail: continueLearningCourse.thumbnail,
        progress: continueLearningCourse.progress || 0,
        timeRemaining: "Unknown", // API doesn't seem to provide this yet
        href: `/courses/${continueLearningCourse.slug || continueLearningCourse.id}`, // Link to detail page
      }
    : null;

  // For "Featured" or "Recommended", usually we'd fetch from a different endpoint (e.g. general courses),
  // but for "Dashboard" (My Learning), maybe we just show "My Courses" grid?
  // The user asked to "see courses they have claimed". So listing them ALL is better.

  const handleBookmarkToggle = (courseId: number) => {
    setBookmarkedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black text-white">
        <div className="container-custom py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-[#1f1f1f] rounded-lg w-64 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-[#1f1f1f] rounded-xl mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-48 bg-[#1f1f1f] rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black text-white">
      <DashboardHeader userName="Student" />

      <main className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <SidebarNav activeItem={activeNav} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Continue Learning Section */}
            {continueLearning && (
              <section>
                <SectionHeader
                  title="Continue Learning"
                  subtitle="Pick up where you left off"
                />
                <ContinueLearningCard {...continueLearning} />
              </section>
            )}

            {/* My Courses Grid */}
            <section className="mt-4">
              <SectionHeader
                title="My Courses"
                subtitle="Courses you are enrolled in"
              />

              {myCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {myCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      {...course}
                      href={`/courses/${course.slug || course.id}`}
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  ))}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#141414] border border-[rgba(255,255,255,0.05)] p-10 text-center">
                  <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
                  <div className="relative z-10 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-gradient-gold/10 flex items-center justify-center mx-auto mb-6">
                      <svg
                        className="w-8 h-8 text-[#d4af35]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      Start Your Learning Journey
                    </h3>
                    <p className="text-[#a3a3a3] mb-8 leading-relaxed">
                      You haven't enrolled in any courses yet. Explore our
                      catalog of Islamic history and leadership courses.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/#courses")}
                      className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-gold text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,53,0.3)] transition-all duration-300"
                    >
                      Browse Courses
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Recommended courses could still be fetched here if we want to show recommendations, 
                 but for now identifying "My Courses" is the priority */}

            {/* Quick Stats */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pb-8">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[rgba(20,20,20,0.8)] rounded-2xl p-6 border border-[rgba(255,255,255,0.06)] backdrop-blur-sm flex flex-col items-center text-center hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-[#a3a3a3]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-[13px] font-medium text-[#a3a3a3] uppercase tracking-wider mb-2">
                  Learning Hours
                </h4>
                <p className="text-3xl font-bold text-white mb-1">--</p>
              </div>

              <div className="bg-gradient-to-br from-[#1a1a1a] to-[rgba(20,20,20,0.8)] rounded-2xl p-6 border border-[rgba(255,255,255,0.06)] backdrop-blur-sm flex flex-col items-center text-center hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gradient-gold/10 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-[#d4af35]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h4 className="text-[13px] font-medium text-[#a3a3a3] uppercase tracking-wider mb-2">
                  Courses Enrolled
                </h4>
                <p className="text-3xl font-bold text-gradient-gold mb-1">
                  {myCourses.length}
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#1a1a1a] to-[rgba(20,20,20,0.8)] rounded-2xl p-6 border border-[rgba(255,255,255,0.06)] backdrop-blur-sm flex flex-col items-center text-center hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-[#a3a3a3]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h4 className="text-[13px] font-medium text-[#a3a3a3] uppercase tracking-wider mb-2">
                  Certificates
                </h4>
                <p className="text-3xl font-bold text-white mb-1">0</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
