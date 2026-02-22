// import apiClient from "@/app/lib/api-client";
import { Course } from "@/constants/courses";

// Types
export interface AdminCoursesResponse {
  status: string;
  data: {
    current_page: number;
    data: Course[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface AdminCourseDetailResponse {
  status: string;
  data: Course;
}

export interface CreateCoursePayload {
  title: string;
  price: number;
  instructor_name: string;
  description: string;
  thumbnail?: File | null;
  // Optional based on payload example; assuming these might be needed or defaults used
  status?: string;
  category?: string;
  level?: string;
}

export interface UpdateCoursePayload {
  title?: string;
  price?: number;
  instructor_name?: string;
  description?: string;
  status?: string;
  thumbnail?: File | null;
  _method?: "PUT";
}

// Section & Lesson API
export interface CreateSectionPayload {
  title: string;
}

export interface CreateLessonPayload {
  title: string;
  overview?: string;
  additional_text?: string;
  passing_grade?: string;
  evaluation_description?: string;
  type: string;
  content_source?: string;
  content_path?: File | string;
  videoUrl?: string; // For preview/optimistic updates
  articleUrl?: string; // For preview/optimistic updates
}

import apiClient from "@/app/lib/api-client";
import {
  postApiAdminCourses1Sections,
  postApiAdminSectionsSectionidLessons, // Corrected casing
  putApiAdminCoursesId,
  putApiAdminLessonsLessonid,
  deleteApiAdminSectionsSectionid,
  deleteApiAdminLessonsLessonid,
} from "@/app/lib/generated/hooks";

// Re-export generated hooks for direct use
export {
  putApiAdminCoursesId,
  putApiAdminLessonsLessonid,
  deleteApiAdminSectionsSectionid,
  deleteApiAdminLessonsLessonid,
};

// Wrappers (if needed for backward compatibility or specific logic)

export const postApiAdminCoursesCourseIdSections = async (
  courseId: number,
  data: CreateSectionPayload,
) => {
  return postApiAdminCourses1Sections(courseId, data);
};

// Renamed wrapper to avoid conflict if I were to export the original
// But here I am exporting this wrapper as 'postApiAdminSectionsSectionIdLessons' (CamelCase Id)
export const postApiAdminSectionsSectionIdLessons = async (
  sectionId: number,
  data: FormData | CreateLessonPayload,
) => {
  const isFormData = data instanceof FormData;
  return postApiAdminSectionsSectionidLessons(sectionId, data as any, {
    headers: isFormData
      ? { "Content-Type": undefined } // Let browser set multipart boundary
      : { "Content-Type": "application/json" },
  });
};
