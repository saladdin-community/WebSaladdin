// app/courses/page.tsx
"use client";

import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Users,
  PlayCircle,
  Star,
  ChevronRight,
  Bookmark,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  category: string;
  price: number;
  isFree: boolean;
  thumbnail: string;
  progress?: number;
  isBookmarked?: boolean;
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Courses" },
    { id: "history", label: "Islamic History" },
    { id: "quran", label: "Quran Studies" },
    { id: "arabic", label: "Arabic Language" },
    { id: "fiqh", label: "Fiqh" },
    { id: "leadership", label: "Leadership" },
  ];

  const courses: Course[] = [
    {
      id: "1",
      title: "The History of Al-Aqsa",
      description:
        "Comprehensive journey through the history of Al-Aqsa Mosque from Umayyad era to modern times",
      instructor: "Dr. Ahmed Al-Masri",
      rating: 4.9,
      students: 12450,
      duration: "15 hours",
      level: "Intermediate",
      category: "history",
      price: 199000,
      isFree: false,
      thumbnail: "/images/al-aqsa-course.jpg",
      progress: 13,
      isBookmarked: true,
    },
    {
      id: "2",
      title: "Arabic Level 1",
      description:
        "Beginner's guide to modern standard Arabic with focus on Quranic understanding",
      instructor: "Ustadh Muhammad Ali",
      rating: 4.8,
      students: 8560,
      duration: "30 hours",
      level: "Beginner",
      category: "arabic",
      price: 0,
      isFree: true,
      thumbnail: "/images/arabic-course.jpg",
      progress: 65,
      isBookmarked: false,
    },
    {
      id: "3",
      title: "Islamic History: The Golden Age",
      description:
        "Explore the golden age of Islamic civilization from 8th to 14th century",
      instructor: "Prof. Khalid Al-Andalusi",
      rating: 4.9,
      students: 9870,
      duration: "20 hours",
      level: "Advanced",
      category: "history",
      price: 150000,
      isFree: false,
      thumbnail: "/images/golden-age.jpg",
      progress: 0,
      isBookmarked: true,
    },
    {
      id: "4",
      title: "Tafsir of Surah Al-Fatiha",
      description:
        "In-depth analysis and interpretation of the opening chapter of the Quran",
      instructor: "Shaykh Ibrahim Al-Qurashi",
      rating: 4.7,
      students: 15430,
      duration: "8 hours",
      level: "All Levels",
      category: "quran",
      price: 0,
      isFree: true,
      thumbnail: "/images/tafsir-course.jpg",
      progress: 42,
      isBookmarked: false,
    },
    {
      id: "5",
      title: "Fiqh of Salah",
      description:
        "Comprehensive guide to prayer according to the four madhahib",
      instructor: "Dr. Yusuf Al-Hanbali",
      rating: 4.6,
      students: 7450,
      duration: "12 hours",
      level: "Intermediate",
      category: "fiqh",
      price: 120000,
      isFree: false,
      thumbnail: "/images/fiqh-course.jpg",
      progress: 0,
      isBookmarked: false,
    },
    {
      id: "6",
      title: "Leadership from Seerah",
      description:
        "Leadership lessons from the life of Prophet Muhammad (PBUH)",
      instructor: "Dr. Omar Suleiman",
      rating: 4.9,
      students: 11200,
      duration: "18 hours",
      level: "Advanced",
      category: "leadership",
      price: 180000,
      isFree: false,
      thumbnail: "/images/leadership-course.jpg",
      progress: 0,
      isBookmarked: true,
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-black text-white">
      {/* Header */}
      <header className="border-b border-[rgba(255,255,255,0.1)] bg-[#121212]/80 backdrop-blur-sm">
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
            <Link href={`/courses/${course.id}`} key={course.id}>
              <div className="card card-hover group cursor-pointer h-full">
                {/* Course Thumbnail */}
                <div className="relative h-48 bg-gradient-to-r from-[#262626] to-[#1f1f1f] overflow-hidden rounded-t-xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <button
                      className="p-2 bg-black/50 rounded-full hover:bg-[rgba(212,175,53,0.2)] transition-colors duration-300"
                      onClick={(e) => {
                        e.preventDefault();
                        // Toggle bookmark
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
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#262626] text-[#d4d4d4] mb-2 font-medium">
                        {course.level}
                      </span>
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#d4af35] transition-colors duration-300">
                        {course.title}
                      </h3>
                    </div>
                    {course.isFree ? (
                      <span className="px-3 py-1 bg-[rgba(34,197,94,0.2)] text-[#22c55e] rounded-full text-sm font-semibold border border-[rgba(34,197,94,0.3)]">
                        FREE
                      </span>
                    ) : (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gradient-gold">
                          Rp {course.price.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-[#a3a3a3] mb-4 text-sm line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-[#737373] mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {course.students.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-[#fde047] fill-[#fde047]" />
                      {course.rating}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#d4af35] to-[#fde047]"></div>
                      <span className="text-sm text-[#d4d4d4]">
                        {course.instructor}
                      </span>
                    </div>
                    <button className="flex items-center gap-2 text-[#d4af35] hover:text-[#fde047] transition-colors duration-300 font-semibold text-sm">
                      {course.progress ? "Continue" : "Start Learning"}
                      <ChevronRight className="h-4 w-4" />
                    </button>
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
              No courses found
            </h3>
            <p className="text-[#737373]">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
