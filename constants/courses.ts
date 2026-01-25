import { CourseFormData } from "@/types/types";

export interface Course {
  id: number;
  title: string;
  slug: string;
  instructor: string;
  price: number;
  price_formatted: string;
  originalPrice?: number;
  originalPrice_formatted?: string;
  description: string;
  thumbnail: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  duration: string;
  rating: number;
  students: number;
  status: "published" | "draft" | "archived";
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

export const mockCourses: Course[] = [
  {
    id: 1,
    title: "Islamic History: The Golden Age",
    slug: "islamic-history-golden-age",
    instructor: "Dr. Yasir Qadhi",
    price: 490000,
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
    students: 324,
    status: "published",
    isFree: false,
  },
  {
    id: 2,
    title: "Arabic Level 1",
    slug: "arabic-level-1",
    instructor: "Ustadh Ali Khan",
    price: 99000,
    price_formatted: "$99.00",
    description: "Learn basic Arabic vocabulary and grammar for beginners.",
    thumbnail: "/images/arabic-course.jpg",
    category: "arabic",
    level: "beginner",
    duration: "20 hours",
    rating: 4.7,
    students: 884,
    status: "published",
    isFree: false,
  },
  {
    id: 3,
    title: "Intro to Fiqh",
    slug: "intro-to-fiqh",
    instructor: "Sheikh Omar",
    price: 0,
    price_formatted: "FREE",
    description: "Introduction to Islamic jurisprudence and legal principles.",
    thumbnail: "/images/fiqh-course.jpg",
    category: "fiqh",
    level: "beginner",
    duration: "10 hours",
    rating: 4.9,
    students: 0,
    status: "draft",
    isFree: true,
  },
  {
    id: 4,
    title: "Quranic Recitation",
    slug: "quranic-recitation",
    instructor: "Qari Abdul Basit",
    price: 29000,
    price_formatted: "$29.00",
    description: "Master proper Quran recitation with tajweed rules.",
    thumbnail: "/images/quran-course.jpg",
    category: "quran",
    level: "intermediate",
    duration: "12 hours",
    rating: 4.6,
    students: 60,
    status: "published",
    isFree: false,
  },
  {
    id: 5,
    title: "Seerah: The Prophetic Biography",
    slug: "seerah-prophetic-biography",
    instructor: "Dr. Yasir Qadhi",
    price: 59000,
    price_formatted: "$59.00",
    description: "Complete biography of Prophet Muhammad (PBUH).",
    thumbnail: "/images/seerah-course.jpg",
    category: "seerah",
    level: "all",
    duration: "25 hours",
    rating: 4.9,
    students: 0,
    status: "draft",
    isFree: false,
  },
  {
    id: 6,
    title: "Advanced Tajweed",
    slug: "advanced-tajweed",
    instructor: "Sheikh Omar",
    price: 120000,
    price_formatted: "$120.00",
    description: "Advanced tajweed rules for Quran recitation.",
    thumbnail: "/images/tajweed-course.jpg",
    category: "quran",
    level: "advanced",
    duration: "18 hours",
    rating: 4.8,
    students: 12,
    status: "draft",
    isFree: false,
  },
  {
    id: 7,
    title: "Arabic Level 2",
    slug: "arabic-level-2",
    instructor: "Ustadh Ali Khan",
    price: 99000,
    price_formatted: "$99.00",
    originalPrice: 129000,
    originalPrice_formatted: "$129.00",
    description: "Intermediate Arabic grammar and conversation.",
    thumbnail: "/images/arabic2-course.jpg",
    category: "arabic",
    level: "intermediate",
    duration: "22 hours",
    rating: 4.6,
    students: 145,
    status: "published",
    isFree: false,
  },
  {
    id: 8,
    title: "Modern Islamic Finance",
    slug: "modern-islamic-finance",
    instructor: "Dr. Amin Z.",
    price: 79000,
    price_formatted: "$79.00",
    description: "Principles of Islamic banking and finance in modern economy.",
    thumbnail: "/images/finance-course.jpg",
    category: "finance",
    level: "advanced",
    duration: "16 hours",
    rating: 4.7,
    students: 89,
    status: "published",
    isFree: false,
  },
];

export function convertToCourseFormData(course: Course): CourseFormData {
  return {
    id: course.id,
    title: course.title,
    instructor: course.instructor,
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
