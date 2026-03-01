// app/(authenticated)/(user)/courses/page.tsx
"use client";

import {
  Search,
  BookOpen,
  GraduationCap,
  Loader2,
  ChevronRight,
  Play,
  Bell,
  User,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  useGetApiCourses,
  useGetApiMyCourses,
  usePostApiCoursesCourseidEnroll,
} from "@/app/lib/generated";
import { useQueryClient } from "@tanstack/react-query";
import FeedbackModal from "@/app/components/modal/FeedbackModal";
import { useFeedbackModal } from "@/hooks/useFeedbackModal";
import { getAuthUser } from "@/app/lib/auth";

type Tab = "explore" | "my-learning";

interface Course {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  instructor_name: string;
  progress: number;
  is_enrolled: boolean;
  status: string;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function CourseCardSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden border border-white/5 bg-[#1a1a1a] animate-pulse">
      <div className="h-48 bg-[#242424]" />
      <div className="p-6 space-y-3">
        <div className="h-4 w-3/4 bg-[#2a2a2a] rounded" />
        <div className="h-3 w-1/2 bg-[#2a2a2a] rounded" />
        <div className="h-10 bg-[#2a2a2a] rounded-xl mt-4" />
      </div>
    </div>
  );
}

// ─── Explore Card ─────────────────────────────────────────────────────────────
function ExploreCard({
  course,
  onEnroll,
  isEnrolling,
}: {
  course: Course;
  onEnroll: (id: number) => void;
  isEnrolling: boolean;
}) {
  const cardContent = (
    <div
      className={`group rounded-3xl overflow-hidden border border-white/5 bg-[#1a1a1a] hover:border-[#d4af35]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 flex flex-col h-full ${
        course.is_enrolled ? "cursor-pointer" : ""
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x400/1e1e1e/d4af37?text=Course";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Play overlay – only for enrolled */}
        {course.is_enrolled && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-[#d4af35] flex items-center justify-center shadow-xl">
              <Play className="h-5 w-5 text-black fill-black ml-0.5" />
            </div>
          </div>
        )}

        {/* Enrolled badge */}
        {course.is_enrolled && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-black/40 backdrop-blur-md border border-white/10 text-[#d4af35] uppercase tracking-[0.1em]">
              Enrolled
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-[#d4af35] leading-tight">
          {course.title}
        </h3>
        <p className="text-xs font-medium text-[#737373] mb-6">
          By <span className="text-[#a3a3a3]">{course.instructor_name}</span>
        </p>

        <div className="mt-auto">
          {course.is_enrolled ? (
            <div className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#d4af35] text-black font-black text-xs uppercase tracking-widest group-hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-[#d4af35]/10">
              Resume Learning
              <ChevronRight className="h-4 w-4" />
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                onEnroll(course.id);
              }}
              disabled={isEnrolling}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-[#d4af35] text-[#d4af35] font-black text-xs uppercase tracking-widest hover:bg-[#d4af35]/10 active:scale-95 disabled:opacity-50 transition-all duration-300"
            >
              {isEnrolling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enrolling…
                </>
              ) : (
                "Enroll Now"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (course.is_enrolled) {
    return (
      <Link href={`/courses/${course.slug}`} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return <div className="h-full">{cardContent}</div>;
}

// ─── My Learning Card ─────────────────────────────────────────────────────────
function MyLearningCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="group block h-full">
      <div className="rounded-3xl overflow-hidden border border-white/5 bg-[#1a1a1a] hover:border-[#d4af35]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x400/1e1e1e/d4af37?text=Course";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Progress bar */}
          {course.progress > 0 && (
            <div className="absolute bottom-4 left-4 right-4 group-hover:bottom-6 transition-all duration-500">
              <div className="flex justify-between text-[10px] font-black text-white/60 mb-1.5 uppercase tracking-wider">
                <span>Progress</span>
                <span className="text-[#d4af35]">{course.progress}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#d4af35] to-[#fde047] transition-all duration-1000 shadow-[0_0_8px_rgba(212,175,53,0.4)]"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-[#d4af35] flex items-center justify-center shadow-xl">
              <Play className="h-5 w-5 text-black fill-black ml-0.5" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 transition-colors duration-300 group-hover:text-[#d4af35] leading-tight">
            {course.title}
          </h3>
          <p className="text-xs font-medium text-[#737373] mb-6">
            By <span className="text-[#a3a3a3]">{course.instructor_name}</span>
          </p>

          <div className="mt-auto">
            <div className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#d4af35] text-black font-black text-xs uppercase tracking-widest group-hover:scale-[1.02] transition-all duration-300">
              Resume Learning
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ tab, onSwitch }: { tab: Tab; onSwitch?: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-32 text-center">
      <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
        {tab === "explore" ? (
          <BookOpen className="h-10 w-10 text-[#333]" />
        ) : (
          <GraduationCap className="h-10 w-10 text-[#333]" />
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {tab === "explore" ? "No courses found" : "No enrolled courses yet"}
      </h3>
      <p className="text-[#737373] text-sm max-w-xs mx-auto leading-relaxed">
        {tab === "explore"
          ? "Try adjusting your search criteria to find what you're looking for."
          : "Explore our catalog and enroll in a course to start your learning journey."}
      </p>
      {tab === "my-learning" && onSwitch && (
        <button
          onClick={onSwitch}
          className="mt-8 px-8 py-3 bg-[#d4af35] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#fde047] transition-all duration-300"
        >
          Explore Catalog
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const user = getAuthUser();
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const {
    modal: feedbackModal,
    success: showSuccess,
    error: showError,
  } = useFeedbackModal();

  const {
    data: allCoursesData,
    isLoading: loadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useGetApiCourses();

  const {
    data: myCoursesData,
    isLoading: loadingMy,
    error: errorMy,
    refetch: refetchMy,
  } = useGetApiMyCourses();

  const { mutate: enroll } = usePostApiCoursesCourseidEnroll({
    mutation: {
      onMutate: ({ courseId }) => setEnrollingId(courseId as number),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [{ url: "/api/courses" }] });
        queryClient.invalidateQueries({
          queryKey: [{ url: "/api/my-courses" }],
        });
        refetchAll();
        refetchMy();
        showSuccess(
          "Enrollment Successful!",
          "You have successfully enrolled. Head to My Learning to start.",
        );
      },
      onError: (err: any) => {
        showError(
          "Enrollment Failed",
          err?.message ?? "Something went wrong. Please try again.",
        );
      },
      onSettled: () => setEnrollingId(null),
    },
  });

  const allCourses: Course[] = allCoursesData?.data ?? [];
  const myCourses: Course[] = myCoursesData?.data ?? [];

  const filteredAllCourses = allCourses
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.instructor_name.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => Number(a.is_enrolled) - Number(b.is_enrolled));

  const isLoading = activeTab === "explore" ? loadingAll : loadingMy;
  const hasError = activeTab === "explore" ? errorAll : errorMy;

  if (isLoading) {
    return (
      <div className="space-y-10">
        <PageHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
          isLoading={true}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Failed to load courses
        </h3>
        <p className="text-[#737373] text-sm mb-8">
          {(hasError as any)?.message}
        </p>
        <button
          onClick={() => (activeTab === "explore" ? refetchAll() : refetchMy())}
          className="px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all duration-300"
        >
          Retry Load
        </button>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <FeedbackModal {...feedbackModal} />

      <PageHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
      />

      <div className="mt-10">
        {activeTab === "explore" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAllCourses.length === 0 ? (
              <EmptyState tab="explore" />
            ) : (
              filteredAllCourses.map((course) => (
                <ExploreCard
                  key={course.id}
                  course={course}
                  onEnroll={(id) => enroll({ courseId: id })}
                  isEnrolling={enrollingId === course.id}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "my-learning" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {myCourses.length === 0 ? (
              <EmptyState
                tab="my-learning"
                onSwitch={() => setActiveTab("explore")}
              />
            ) : (
              myCourses.map((course) => (
                <MyLearningCard key={course.id} course={course} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
function PageHeader({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  user,
  isLoading = false,
}: {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  user: any;
  isLoading?: boolean;
}) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white">
            {activeTab === "explore" ? "Explore Catalog" : "My Learning"}
          </h1>
          <p className="text-[#737373] font-medium mt-2 max-w-lg">
            {activeTab === "explore"
              ? "Discover premium Islamic courses tailored for your growth."
              : "Continue your journey and master the knowledge."}
          </p>
        </div>

        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          {/* User Info / Profile */}
          <div className="flex items-center gap-4 justify-end w-full">
            {/* Notifications */}
            <button className="relative p-2.5 bg-[#1a1a1a] border border-white/5 rounded-full hover:bg-[#262626] transition-all duration-300 hover:scale-105 group">
              <Bell className="h-5 w-5 text-[#a3a3a3] group-hover:text-white transition-colors" />
              <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-[#d4af35] rounded-full border-2 border-[#0a0a0a]"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-white/10 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-[#d4af35] transition-colors">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] font-medium text-[#737373]">
                  {user?.role}
                </p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-br from-[#262626] to-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10 group-hover:border-[#d4af35]/50 transition-all duration-300">
                <User size={20} className="text-[#d4af35]" />
              </div>
            </div>
          </div>

          {!isLoading && activeTab === "explore" && (
            <div className="relative w-full md:w-80 group mt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373] group-focus-within:text-[#d4af35] transition-colors" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-[#404040] focus:outline-none focus:border-[#d4af35]/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#1a1a1a] p-1.5 rounded-2xl w-fit border border-white/5">
        <TabButton
          label="Catalog"
          active={activeTab === "explore"}
          onClick={() => setActiveTab("explore")}
        />
        <TabButton
          label="Enrolled"
          active={activeTab === "my-learning"}
          onClick={() => setActiveTab("my-learning")}
        />
      </div>
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
        active
          ? "bg-[#d4af35] text-black shadow-lg shadow-[#d4af35]/10"
          : "text-[#737373] hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </button>
  );
}
