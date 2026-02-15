import { CourseFormData } from "@/types/types";

export interface Course {
  id: number;
  title: string;
  slug: string;
  instructor_name: string; // Changed from instructor
  price: string; // Changed from number, API returns string "0.00"
  price_formatted?: string; // Optional, might compute on frontend
  originalPrice?: number;
  originalPrice_formatted?: string;
  description: string;
  thumbnail: string;
  // category: string; // Not in the example response, checking if I should keep it? Response doesn't show category/level directly in the root object example, but create payload has it.
  // Wait, the example response for "Get Courses" DOES NOT have category or level.
  // Let's keep them as optional or check if they are missing from response.
  // The user sample response: id, title, slug, thumbnail, price, status, description, instructor_name, deleted_at, created_at, updated_at, students_count, sections.
  // I will add the missing fields and make others optional if they might not be there.
  status: "published" | "draft" | "archived";
  students_count: number; // Changed from students
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  sections?: any[]; // details

  // Frontend specific or potentially missing from list view but present in detail?
  // The create payload sends category/level. The list response in the prompt doesn't show them.
  // I will keep them but maybe populate them differently or mark optional.
  category?: string;
  level?: string;
  duration?: string;
  rating?: number;
  isFree?: boolean;
  progress?: number;
  isBookmarked?: boolean;
}

export const courseCategories = [
  { id: "all", label: "All Courses" },
  { id: "history", label: "Islamic History" },
  { id: "quran", label: "Quran Studies" },
  { id: "arabic", label: "Arabic Language" },
  { id: "fiqh", label: "Fiqh" },
  { id: "leadership", label: "Leadership" },
  { id: "finance", label: "Islamic Finance" },
  { id: "seerah", label: "Seerah" },
];

export const courseLevels = [
  { id: "all", label: "All Levels", color: "bg-blue-500/10 text-blue-400" },
  {
    id: "beginner",
    label: "Beginner",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    color: "bg-amber-500/10 text-amber-400",
  },
  { id: "advanced", label: "Advanced", color: "bg-rose-500/10 text-rose-400" },
];

export const COURSE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const COURSE_STATUS_OPTIONS = [
  {
    value: COURSE_STATUS.DRAFT,
    label: "Draft",
    color: "bg-gray-500/10 text-gray-400",
  },
  {
    value: COURSE_STATUS.PUBLISHED,
    label: "Published",
    color: "bg-emerald-500/10 text-emerald-400",
  },
  {
    value: COURSE_STATUS.ARCHIVED,
    label: "Takedown",
    color: "bg-red-500/10 text-red-400",
  },
];

export const mockCourses: Course[] = [
  {
    id: 1,
    title: "Islamic History: The Golden Age",
    slug: "islamic-history-golden-age",
    instructor_name: "Dr. Yasir Qadhi",
    price: "490000.00",
    price_formatted: "$49.00",
    originalPrice: 599000,
    originalPrice_formatted: "$59.90",
    description:
      "Explore the rich history of Islamic civilization during its golden age.",
    thumbnail: "/images/islamic-history.jpg",
    category: "history",
    level: "intermediate",
    duration: "15 hours",
    rating: 4.8,
    students_count: 324,
    status: "published",
    isFree: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "Arabic Level 1",
    slug: "arabic-level-1",
    instructor_name: "Ustadh Ali Khan",
    price: "99000.00",
    price_formatted: "$99.00",
    description: "Learn basic Arabic vocabulary and grammar for beginners.",
    thumbnail: "/images/arabic-course.jpg",
    category: "arabic",
    level: "beginner",
    duration: "20 hours",
    rating: 4.7,
    students_count: 884,
    status: "published",
    isFree: false,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: 3,
    title: "Intro to Fiqh",
    slug: "intro-to-fiqh",
    instructor_name: "Sheikh Omar",
    price: "0.00",
    price_formatted: "FREE",
    description: "Introduction to Islamic jurisprudence and legal principles.",
    thumbnail: "/images/fiqh-course.jpg",
    category: "fiqh",
    level: "beginner",
    duration: "10 hours",
    rating: 4.9,
    students_count: 0,
    status: "draft",
    isFree: true,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
  {
    id: 4,
    title: "Quranic Recitation",
    slug: "quranic-recitation",
    instructor_name: "Qari Abdul Basit",
    price: "29000.00",
    price_formatted: "$29.00",
    description: "Master proper Quran recitation with tajweed rules.",
    thumbnail: "/images/quran-course.jpg",
    category: "quran",
    level: "intermediate",
    duration: "12 hours",
    rating: 4.6,
    students_count: 60,
    status: "published",
    isFree: false,
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
  },
  {
    id: 5,
    title: "Seerah: The Prophetic Biography",
    slug: "seerah-prophetic-biography",
    instructor_name: "Dr. Yasir Qadhi",
    price: "59000.00",
    price_formatted: "$59.00",
    description: "Complete biography of Prophet Muhammad (PBUH).",
    thumbnail: "/images/seerah-course.jpg",
    category: "seerah",
    level: "all",
    duration: "25 hours",
    rating: 4.9,
    students_count: 0,
    status: "draft",
    isFree: false,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
  {
    id: 6,
    title: "Advanced Tajweed",
    slug: "advanced-tajweed",
    instructor_name: "Sheikh Omar",
    price: "120000.00",
    price_formatted: "$120.00",
    description: "Advanced tajweed rules for Quran recitation.",
    thumbnail: "/images/tajweed-course.jpg",
    category: "quran",
    level: "advanced",
    duration: "18 hours",
    rating: 4.8,
    students_count: 12,
    status: "draft",
    isFree: false,
    created_at: "2024-01-06T00:00:00Z",
    updated_at: "2024-01-06T00:00:00Z",
  },
  {
    id: 7,
    title: "Arabic Level 2",
    slug: "arabic-level-2",
    instructor_name: "Ustadh Ali Khan",
    price: "99000.00",
    price_formatted: "$99.00",
    originalPrice: 129000,
    originalPrice_formatted: "$129.00",
    description: "Intermediate Arabic grammar and conversation.",
    thumbnail: "/images/arabic2-course.jpg",
    category: "arabic",
    level: "intermediate",
    duration: "22 hours",
    rating: 4.6,
    students_count: 145,
    status: "published",
    isFree: false,
    created_at: "2024-01-07T00:00:00Z",
    updated_at: "2024-01-07T00:00:00Z",
  },
  {
    id: 8,
    title: "Modern Islamic Finance",
    slug: "modern-islamic-finance",
    instructor_name: "Dr. Amin Z.",
    price: "79000.00",
    price_formatted: "$79.00",
    description: "Principles of Islamic banking and finance in modern economy.",
    thumbnail: "/images/finance-course.jpg",
    category: "finance",
    level: "advanced",
    duration: "16 hours",
    rating: 4.7,
    students_count: 89,
    status: "published",
    isFree: false,
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-08T00:00:00Z",
  },
];

export function convertToCourseFormData(course: Course): CourseFormData {
  return {
    id: course.id,
    title: course.title,
    instructor: course.instructor_name,
    description: course.description,
    thumbnail: course.thumbnail,
    sections: [
      {
        id: 1,
        title: "Introduction",
        lessons: [
          { id: 1, title: "Welcome Video" },
          { id: 2, title: "Course Syllabus" },
        ],
      },
    ],
  };
}
