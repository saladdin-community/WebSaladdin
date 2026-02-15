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
  type: string;
  content_source?: "upload" | "external";
  content_url?: string;
  content_path?: string;
  content_text?: string;

  // UI State for uploads
  videoFile?: File;
  articleFile?: File;

  // Evaluation
  passingGrade?: number;
  evaluationDesc?: string;
  questions?: any[];
}

export interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  courseData?: CourseFormData;
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

// Redefining Course to match usage in some places if needed, but keeping careful about duplicates.
// The original file had duplicate Course interface? The view showed lines 48-64 and 120-132.
// Just consolidating or keeping as is? exact copy of original to be safe.
// Wait, the original had TWO Course interfaces.
// 48: export interface Course { ... }
// 120: export interface Course { ... }
// This is invalid TypeScript if in same file.
// The file view Step 729 showed lines 1-50.
// Step 754 showed lines 31-172.
// Yes, line 48 and line 120 both define `Course`.
// I will keep the file exactly as is but change `Lesson`.
// I'll assume the second one overwrites the first or it was a merge artifact.
// I will keep ONLY the second definition if they conflict? Or just keep as is to avoid breaking other things I don't see.

// Actually, I will write exactly what I saw, but replacing Lesson.
