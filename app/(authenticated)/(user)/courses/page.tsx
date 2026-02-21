// app/(authenticated)/(user)/courses/page.tsx
"use client";

import {
  Search,
  BookOpen,
  GraduationCap,
  Loader2,
  ChevronRight,
  Play,
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
    <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#1a1a1a] animate-pulse">
      <div className="h-48 bg-[#242424]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 bg-[#2a2a2a] rounded" />
        <div className="h-3 w-1/2 bg-[#2a2a2a] rounded" />
        <div className="h-10 bg-[#2a2a2a] rounded-lg mt-4" />
      </div>
    </div>
  );
}

// ─── Explore Card ─────────────────────────────────────────────────────────────
// Shows ALL courses. If not enrolled → Enroll Now. If already enrolled → Resume Course.
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
      className={`group rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#1a1a1a] hover:border-[rgba(212,175,53,0.4)] hover:shadow-[0_0_24px_rgba(212,175,53,0.12)] transition-all duration-300 flex flex-col h-full ${
        course.is_enrolled ? "cursor-pointer" : ""
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x400/1e1e1e/d4af37?text=Course";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Play overlay – only for enrolled */}
        {course.is_enrolled && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-[rgba(212,175,53,0.9)] flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 text-black fill-black ml-0.5" />
            </div>
          </div>
        )}

        {/* Enrolled badge */}
        {course.is_enrolled && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[rgba(212,175,53,0.2)] border border-[rgba(212,175,53,0.5)] text-[#d4af35] uppercase tracking-wide">
              Enrolled
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-white mb-1 line-clamp-2 group-hover:text-[#d4af35] transition-colors duration-300 leading-snug">
          {course.title}
        </h3>
        <p className="text-xs text-[#737373] mb-4">
          By {course.instructor_name}
        </p>

        <div className="mt-auto">
          {course.is_enrolled ? (
            /* Resume Course – acts as visual button; navigation handled by Link wrapper */
            <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#d4af35] to-[#fde047] text-black font-semibold text-sm group-hover:opacity-90 transition-opacity">
              Resume Course
              <ChevronRight className="h-4 w-4" />
            </div>
          ) : (
            /* Enroll Now – stops propagation so the outer div isn't navigated */
            <button
              onClick={(e) => {
                e.preventDefault();
                onEnroll(course.id);
              }}
              disabled={isEnrolling}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-[#d4af35] text-[#d4af35] font-semibold text-sm hover:bg-[rgba(212,175,53,0.15)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isEnrolling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enrolling…
                </>
              ) : (
                "ENROLL NOW"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // If enrolled, wrap in Link so the whole card navigates to detail
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
      <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#1a1a1a] hover:border-[rgba(212,175,53,0.4)] hover:shadow-[0_0_24px_rgba(212,175,53,0.12)] transition-all duration-300 flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden flex-shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x400/1e1e1e/d4af37?text=Course";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Progress bar */}
          {course.progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
              <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#d4af35] to-[#fde047] transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className="text-[10px] text-[#d4d4d4] mt-1">
                {course.progress}% completed
              </p>
            </div>
          )}

          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-[rgba(212,175,53,0.9)] flex items-center justify-center shadow-lg">
              <Play className="h-5 w-5 text-black fill-black ml-0.5" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-base font-bold text-white mb-1 line-clamp-2 group-hover:text-[#d4af35] transition-colors duration-300 leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-[#737373] mb-4">
            By {course.instructor_name}
          </p>

          <div className="mt-auto">
            <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#d4af35] to-[#fde047] text-black font-semibold text-sm group-hover:opacity-90 transition-opacity">
              Resume Course
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
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      {tab === "explore" ? (
        <>
          <BookOpen className="h-16 w-16 text-[#333] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1">
            No courses found
          </h3>
          <p className="text-[#737373] text-sm">Try adjusting your search.</p>
        </>
      ) : (
        <>
          <GraduationCap className="h-16 w-16 text-[#333] mb-4" />
          <h3 className="text-lg font-semibold text-white mb-1">
            No enrolled courses yet
          </h3>
          <p className="text-[#737373] text-sm">
            Go to{" "}
            <button
              onClick={onSwitch}
              className="text-[#d4af35] underline underline-offset-2"
            >
              Explore All
            </button>{" "}
            and enroll in a course to get started.
          </p>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const {
    modal: feedbackModal,
    success: showSuccess,
    error: showError,
  } = useFeedbackModal();

  // ── Data: all courses (Explore All tab) ──
  const {
    data: allCoursesData,
    isLoading: loadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useGetApiCourses();

  // ── Data: enrolled courses (My Learning tab) ──
  const {
    data: myCoursesData,
    isLoading: loadingMy,
    error: errorMy,
    refetch: refetchMy,
  } = useGetApiMyCourses();

  // ── Enroll mutation ──
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
          { autoClose: 3500 },
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

  // ── Derived data ──
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
    // unenrolled first, enrolled last
    .sort((a, b) => Number(a.is_enrolled) - Number(b.is_enrolled));

  const isLoading = activeTab === "explore" ? loadingAll : loadingMy;
  const hasError = activeTab === "explore" ? errorAll : errorMy;

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <PageHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="container-custom py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ── Error ──
  if (hasError) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-14 w-14 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load courses</h3>
          <p className="text-[#737373] text-sm mb-4">
            {(hasError as any)?.message}
          </p>
          <button
            onClick={() =>
              activeTab === "explore" ? refetchAll() : refetchMy()
            }
            className="btn btn-primary px-6 py-2.5"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <FeedbackModal {...feedbackModal} />

      <PageHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="container-custom py-8">
        {/* ── Explore All Tab ── */}
        {activeTab === "explore" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* ── My Learning Tab ── */}
        {activeTab === "my-learning" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </main>
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────
function PageHeader({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}: {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) {
  return (
    <header className="bg-[#121212]/80 backdrop-blur-sm border-b border-[rgba(255,255,255,0.06)] sticky top-0 z-10">
      <div className="container-custom py-5">
        {/* Title + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-white">Explore Courses</h1>
            <p className="text-[#737373] text-sm mt-0.5">
              Discover new knowledge and expand your horizons.
            </p>
          </div>

          {activeTab === "explore" && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
              <input
                type="text"
                placeholder="Search for courses..."
                className="input pl-9 pr-4 py-2 text-sm w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          <TabButton
            label="Explore All"
            active={activeTab === "explore"}
            onClick={() => setActiveTab("explore")}
          />
          <TabButton
            label="My Learning"
            active={activeTab === "my-learning"}
            onClick={() => setActiveTab("my-learning")}
          />
        </div>
      </div>
    </header>
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
      className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-gradient-to-r from-[#d4af35] to-[#fde047] text-black shadow-[0_2px_12px_rgba(212,175,53,0.35)]"
          : "bg-[#1f1f1f] text-[#a3a3a3] hover:bg-[#262626] border border-[rgba(255,255,255,0.08)]"
      }`}
    >
      {label}
    </button>
  );
}
