export interface CourseData {
  id?: number;
  title: string;
  instructor: string;
  description: string;
  thumbnail?: string | File;
  sections: Section[];
}

export interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  videoUrl?: string;
  articleUrl?: string;
  overview?: string;
  additionalText?: string;
  passingGrade?: number;
  evaluationDesc?: string;
}

export interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  courseData?: CourseData;
}

export interface LessonEditorProps {
  selectedLesson: { sectionId: number; lessonId: number } | null;
  sections: Section[];
  onSaveLesson: (lessonData: Partial<Lesson>) => void;
  onCancel: () => void;
  onUpdateLessonData: (
    sectionId: number,
    lessonId: number,
    data: Partial<Lesson>,
  ) => void;
}

export interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  thumbnail: string;
  category: string;
  level: string;
  price: number;
  price_formatted: string;
  originalPrice?: number;
  originalPrice_formatted?: string;
  students: number;
  status: string;
  createdAt: string;
  // ... other existing properties ...
}

// Tambahkan interface baru untuk Course Form:
export interface CourseFormData {
  id?: number;
  title: string;
  instructor: string;
  description: string;
  thumbnail?: string | File;
  sections: Section[];
}

export interface Lesson {
  id: number;
  title: string;
  videoUrl?: string;
  articleUrl?: string;
  overview?: string;
  additionalText?: string;
  passingGrade?: number;
  evaluationDesc?: string;
}

export interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  courseData?: CourseFormData;
}

export interface CourseLesson {
  id: number;
  title: string;
  slug: string;
  type: string;
  status: "Completed" | "On Progress" | "Locked";
  duration?: string;
  video_url?: string;
  description?: string;
}

export interface CourseSection {
  id: number;
  title: string;
  description?: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  instructor: string;
  price: number;
  price_formatted: string;
  description: string;
  sections: CourseSection[];
  is_enrolled: boolean;
  progress: number | null;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  message?: string;
}

export interface VideoLesson {
  id: number;
  title: string;
  slug: string;
  type: "video" | "document" | "text" | "quiz";
  status: "Completed" | "On Progress" | "Locked";
  video_url?: string; // YouTube URL
  video_id?: string; // YouTube video ID
  duration?: number; // Duration in seconds
  start_time?: number; // Start time in seconds
  end_time?: number; // End time in seconds
  description?: string;
}

export interface CourseSection {
  id: number;
  title: string;
  description?: string;
  lessons: VideoLesson[];
}

export interface CourseDetailResponse {
  status: "success" | "error";
  data: {
    id: number;
    title: string;
    slug: string;
    description: string;
    sections: CourseSection[];
    progress: number | null;
  };
}
