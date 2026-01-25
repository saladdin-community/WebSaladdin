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
