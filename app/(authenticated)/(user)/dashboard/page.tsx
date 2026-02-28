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

            {/* My Courses Grid (Replaces Featured/Recommended for "My Learning" context) */}
            <section>
              <SectionHeader
                title="My Courses"
                subtitle="Courses you are enrolled in"
                // actionLabel="View All"
                // onActionClick={() => {}}
              />

              {myCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      {...course}
                      href={`/courses/${course.slug || course.id}`} // Ensure link goes to detail
                      onBookmarkToggle={handleBookmarkToggle}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-[#1f1f1f] rounded-xl border border-[rgba(255,255,255,0.1)]">
                  <h3 className="text-xl text-[#d4d4d4] mb-2">
                    You haven't enrolled in any courses yet.
                  </h3>
                  <button
                    onClick={() => (window.location.href = "/courses")}
                    className="mt-4 px-6 py-2 bg-gradient-gold text-black font-bold rounded-md"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </section>

            {/* Recommended courses could still be fetched here if we want to show recommendations, 
                 but for now identifying "My Courses" is the priority */}

            {/* Quick Stats - Keep static or fetch if API available */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#1f1f1f] to-[#171717] rounded-xl p-6 border border-[rgba(255,255,255,0.1)]">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Learning Hours
                </h4>
                <p className="text-3xl font-bold text-gradient-gold mb-1">--</p>
                <p className="text-sm text-[#737373]">Total Hours</p>
              </div>

              <div className="bg-gradient-to-br from-[#1f1f1f] to-[#171717] rounded-xl p-6 border border-[rgba(255,255,255,0.1)]">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Courses Enrolled
                </h4>
                <p className="text-3xl font-bold text-gradient-gold mb-1">
                  {myCourses.length}
                </p>
                <p className="text-sm text-[#737373]">Active Courses</p>
              </div>

              <div className="bg-gradient-to-br from-[#1f1f1f] to-[#171717] rounded-xl p-6 border border-[rgba(255,255,255,0.1)]">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Certificates
                </h4>
                <p className="text-3xl font-bold text-gradient-gold mb-1">0</p>
                <p className="text-sm text-[#737373]">Earned</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
