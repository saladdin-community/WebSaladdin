// app/courses/page.tsx
"use client";

import { Search, Filter, BookOpen, Bookmark } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useGetAuthCourses } from "../lib/generated";

interface Course {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  instructor: string;
  price: number;
  price_formatted: string;
  description?: string;
  rating?: number;
  students?: number;
  duration?: string;
  level?: string;
  category?: string;
  isFree?: boolean;
  progress?: number;
  isBookmarked?: boolean;
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Integration Data
  const {
    data: coursesData,
    isLoading,
    error,
    refetch,
  } = useGetAuthCourses({
    query: {
      enabled: true,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    client: {
      headers: {
        "Custom-Header": "value",
      },
    },
  });

  console.log("This is courses data: ", coursesData);

  const categories = [
    { id: "all", label: "All Courses" },
    { id: "history", label: "Islamic History" },
    { id: "quran", label: "Quran Studies" },
    { id: "arabic", label: "Arabic Language" },
    { id: "fiqh", label: "Fiqh" },
    { id: "leadership", label: "Leadership" },
  ];

  // Transform data dari backend ke format yang dibutuhkan
  const courses: Course[] =
    coursesData?.data?.map((course: any) => ({
      id: course.id,
      title: course.title,
      slug: course.slug,
      thumbnail: course.thumbnail || "/images/default-course.jpg",
      instructor: course.instructor || "Instructor",
      price: course.price || 0,
      price_formatted: course.price_formatted || "Rp 0",
      description: course.description || "No description available",
      rating: course.rating || 4.5,
      students: course.students || 0,
      duration: course.duration || "10 hours",
      level: course.level || "All Levels",
      category: course.category || "history",
      isFree: course.price === 0,
      progress: course.progress || 0,
      isBookmarked: course.isBookmarked || false,
    })) || [];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black text-white">
        <div className="container-custom py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="px-4 py-2 rounded-md bg-[#1f1f1f] animate-pulse"
              >
                <div className="h-4 w-20 bg-[#2a2a2a] rounded"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card h-full animate-pulse">
                <div className="h-48 bg-[#1f1f1f] rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-4 w-20 bg-[#2a2a2a] rounded mb-3"></div>
                  <div className="h-6 bg-[#2a2a2a] rounded mb-2"></div>
                  <div className="h-4 bg-[#2a2a2a] rounded mb-1"></div>
                  <div className="h-4 bg-[#2a2a2a] rounded w-3/4"></div>
                  <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    <div className="h-8 bg-[#2a2a2a] rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black text-white">
        <div className="container-custom py-8">
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <BookOpen className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Failed to load courses
            </h3>
            <p className="text-[#737373] mb-4">
              {error.message || "An error occurred while fetching courses"}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-gradient-gold text-black font-semibold rounded-md hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black text-white">
      {/* Header */}
      <header className="bg-[#121212]/80 backdrop-blur-sm">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Course Library</h1>
              <p className="text-[#737373]">
                Explore all available courses and manage your learning
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button className="btn btn-primary px-6 py-2.5 font-bold">
                My Learning
              </button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737373]" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="input pl-10 pr-4 py-2.5 w-full sm:w-64 bg-[#1f1f1f] border border-[rgba(255,255,255,0.1)] rounded-md focus:border-[#d4af35] focus:ring-1 focus:ring-[rgba(212,175,53,0.3)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-md transition-all duration-300 text-sm font-semibold ${
                selectedCategory === category.id
                  ? "bg-gradient-gold text-black"
                  : "bg-[#1f1f1f] text-[#d4d4d4] hover:bg-[#262626] border border-[rgba(255,255,255,0.1)]"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
          <button className="px-4 py-2 rounded-md bg-[#1f1f1f] text-[#d4d4d4] hover:bg-[#262626] border border-[rgba(255,255,255,0.1)] transition-all duration-300 flex items-center gap-2 text-sm font-semibold">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link href={`/courses/${course.slug || course.id}`} key={course.id}>
              <div className="card card-hover group cursor-pointer h-full">
                {/* Course Thumbnail */}
                <div className="relative h-48 overflow-hidden rounded-t-xl">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/images/default-course.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <button
                      className="p-2 bg-black/50 rounded-full hover:bg-[rgba(212,175,53,0.2)] transition-colors duration-300"
                      onClick={(e) => {
                        e.preventDefault();
                        // Toggle bookmark logic here
                      }}
                    >
                      <Bookmark
                        className={`h-5 w-5 ${
                          course.isBookmarked
                            ? "fill-[#d4af35] text-[#d4af35]"
                            : "text-white"
                        }`}
                      />
                    </button>
                  </div>
                  {course.progress && course.progress > 0 && (
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="h-1.5 bg-[#404040] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#d4af35] to-[#fde047] rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1.5 text-[#d4d4d4]">
                        {course.progress}% Complete
                      </p>
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3 min-h-28 max-h-28">
                    <div>
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#262626] text-[#d4d4d4] mb-2 font-medium">
                        {course.level}
                      </span>
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#d4af35] transition-colors duration-300 line-clamp-2">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[#a3a3a3] mb-4 text-sm line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    <div className="text-sm text-[#737373]">
                      By {course.instructor}
                    </div>
                    {course.isFree ? (
                      <span className="px-3 py-1 bg-[rgba(34,197,94,0.2)] text-[#22c55e] rounded-full text-sm font-semibold border border-[rgba(34,197,94,0.3)]">
                        FREE
                      </span>
                    ) : (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gradient-gold">
                          {course.price_formatted}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-[#404040] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {courses.length === 0
                ? "No courses available"
                : "No courses found"}
            </h3>
            <p className="text-[#737373]">
              {courses.length === 0
                ? "Check back later for new courses"
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
