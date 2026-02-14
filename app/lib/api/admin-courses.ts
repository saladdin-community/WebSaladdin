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
