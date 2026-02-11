"use client";

import { useState } from "react";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import SidebarNav from "@/app/components/sidebar/SidebarNav";
import SectionHeader from "@/app/components/header/SectionHeader";
import ContinueLearningCard from "@/app/components/card/ContinueLearningCard";
import CourseCard from "@/app/components/card/CourseCard";
import { useGetApiCourses } from "@/app/lib/generated";

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

  // Fetch courses data
  const {
    data: coursesData,
    isLoading,
    error,
  } = useGetApiCourses({
    query: {
      enabled: true,
      staleTime: 5 * 60 * 1000,
    },
  });

  // Transform data
  const courses: DashboardCourse[] =
    coursesData?.data?.map((course: any) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      thumbnail: course.thumbnail || "/images/default-course.jpg",
      instructor: course.instructor || "Instructor",
      price: course.price || 0,
      price_formatted: course.price_formatted || "Rp 0",
      description: course.description || "No description available",
      progress: course.progress || 0,
      isBookmarked: bookmarkedCourses.includes(course.id),
      isFree: course.price === 0,
      level: course.level || "All Levels",
    })) || [];

  // Sample continue learning data
  const continueLearning = {
    id: 1,
    title: "Islamic History",
    subtitle: "The Golden Age of Islam",
    instructor: "Dr. Yasir Qadhi",
    thumbnail: "/images/islamic-history.jpg",
    progress: 65,
    timeRemaining: "2h 15m",
    href: "/courses/islamic-history-golden-age",
  };

  // Featured/recommended courses
  const featuredCourses = courses.slice(0, 3);
  const recommendedCourses = courses.slice(3, 6);

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
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-48 bg-[#1f1f1f] rounded-xl"></div>
                  ))}
                </div>
              </div>
              <div className="h-96 bg-[#1f1f1f] rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black text-white">
        <div className="container-custom py-8">
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">
                Failed to load dashboard
              </h3>
              <p className="text-[#737373] mb-4">
                {error.message || "An error occurred"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black text-white">
      <DashboardHeader userName="Ahmed" />

      <main className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <SidebarNav activeItem={activeNav} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Continue Learning Section */}
            <section>
              <SectionHeader
                title="Continue Learning"
                subtitle="Pick up where you left off"
              />
              <ContinueLearningCard {...continueLearning} />
            </section>

            {/* Featured Courses Section */}
            <section>
              <SectionHeader
                title="Featured Courses"
                subtitle="Handpicked courses just for you"
                actionLabel="View All"
                onActionClick={() => (window.location.href = "/courses")}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>
            </section>

            {/* Recommended Courses Section */}
            <section>
              <SectionHeader
                title="Recommended For You"
                subtitle="Based on your learning history"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    onBookmarkToggle={handleBookmarkToggle}
                  />
                ))}
              </div>
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#1f1f1f] to-[#171717] rounded-xl p-6 border border-[rgba(255,255,255,0.1)]">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Learning Hours
                </h4>
                <p className="text-3xl font-bold text-gradient-gold mb-1">
                  42.5
                </p>
                <p className="text-sm text-[#737373]">This month</p>
              </div>

              <div className="bg-gradient-to-br from-[#1f1f1f] to-[#171717] rounded-xl p-6 border border-[rgba(255,255,255,0.1)]">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Courses Completed
                </h4>
                <p className="text-3xl font-bold text-gradient-gold mb-1">8</p>
                <p className="text-sm text-[#737373]">Total completed</p>
              </div>

              <div className="bg-gradient-to-br from-[#1f1f1f] to-[#171717] rounded-xl p-6 border border-[rgba(255,255,255,0.1)]">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Current Streak
                </h4>
                <p className="text-3xl font-bold text-gradient-gold mb-1">
                  14 days
                </p>
                <p className="text-sm text-[#737373]">Keep it up!</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
