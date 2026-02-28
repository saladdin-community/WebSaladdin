"use client";

import { useState, useMemo } from "react";
import DashboardHeader from "@/app/components/header/DashboardHeader";
import SectionHeader from "@/app/components/header/SectionHeader";
import ContinueLearningCard from "@/app/components/card/ContinueLearningCard";
import CourseCard from "@/app/components/card/CourseCard";
import StatCard from "@/app/components/card/StatCard";
import {
  useGetApiDashboardStats,
  useGetApiDashboardContinueLearning,
  useGetApiMyCourses,
} from "@/app/lib/generated";
import { BookOpen, PlayCircle, Award } from "lucide-react";

export default function DashboardPage() {
  const [bookmarkedCourses, setBookmarkedCourses] = useState<number[]>([]);

  // Fetch Stats data
  const { data: statsData, isLoading: isStatsLoading } =
    useGetApiDashboardStats();

  // Fetch Continue Learning data
  const { data: continueLearningData, isLoading: isContinueLoading } =
    useGetApiDashboardContinueLearning();

  // Fetch MY courses data (Enrolled courses)
  const { data: myCoursesData, isLoading: isMyCoursesLoading } =
    useGetApiMyCourses();

  // Derived data
  const stats = useMemo(() => {
    return [
      {
        label: "Total Courses",
        value: statsData?.total_courses || 0,
        icon: <BookOpen className="h-6 w-6" />,
        bgColor: "bg-blue-500/10",
        iconColor: "text-blue-500",
      },
      {
        label: "In Progress",
        value: statsData?.in_progress || 0,
        icon: <PlayCircle className="h-6 w-6" />,
        bgColor: "bg-orange-500/10",
        iconColor: "text-orange-500",
      },
      {
        label: "Certificates",
        value: statsData?.certificates || 0,
        icon: <Award className="h-6 w-6" />,
        bgColor: "bg-green-500/10",
        iconColor: "text-green-500",
      },
    ];
  }, [statsData]);

  const continueLearning = continueLearningData?.[0];

  const exploreCourses = useMemo(() => {
    if (!myCoursesData?.data) return [];
    return myCoursesData.data.slice(0, 3);
  }, [myCoursesData]);

  const toggleBookmark = (id: number) => {
    setBookmarkedCourses((prev) =>
      prev.includes(id)
        ? prev.filter((courseId) => courseId !== id)
        : [...prev, id],
    );
  };

  if (isStatsLoading || isContinueLoading || isMyCoursesLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-20 bg-[#1a1a1a] rounded-2xl w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-[#1a1a1a] rounded-2xl"></div>
          <div className="h-28 bg-[#1a1a1a] rounded-2xl"></div>
          <div className="h-28 bg-[#1a1a1a] rounded-2xl"></div>
        </div>
        <div className="h-64 bg-[#1a1a1a] rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <DashboardHeader userName="Ahmed" />

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>

      {/* Continue Learning Section */}
      {continueLearning && (
        <section>
          <SectionHeader
            title="Continue Learning"
            icon={<PlayCircle className="h-5 w-5" />}
          />
          <ContinueLearningCard
            id={continueLearning.id}
            title={continueLearning.title}
            subtitle={continueLearning.category_name || "Islamic History"}
            instructor={continueLearning.mentor_name || "Dr. Yasir Qadhi"}
            progress={continueLearning.progress || 0}
            thumbnail={continueLearning.thumbnail_url || "/images/course-1.jpg"}
            timeRemaining="2h 15m"
            href={`/courses/${continueLearning.slug}`}
          />
        </section>
      )}

      {/* Explore Courses Section */}
      <section>
        <SectionHeader
          title="Explore Courses"
          viewAllHref="/courses"
          icon={<BookOpen className="h-5 w-5" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exploreCourses.map((course: any) => (
            <CourseCard
              key={course.id}
              {...course}
              isBookmarked={bookmarkedCourses.includes(course.id)}
              onBookmark={() => toggleBookmark(course.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
