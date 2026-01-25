"use client";

import { Plus } from "lucide-react";
import UploadArea from "../form/UploadArea";
import CourseSectionList from "./CourseSectionList";
import { CourseData, Section } from "@/types/types";

interface CourseFormSectionProps {
  courseData: Omit<CourseData, "sections">;
  sections: Section[];
  expandedSections: number[];
  onUpdateCourseData: (data: Partial<CourseData>) => void;
  onToggleSection: (sectionId: number) => void;
  onAddSection: () => void;
  onAddLesson: (sectionId: number) => void;
  onDeleteSection: (sectionId: number) => void;
  onDeleteLesson: (sectionId: number, lessonId: number) => void;
  onEditLesson: (sectionId: number, lessonId: number) => void;
  onCancel: () => void;
  onSave: () => void;
  mode: "create" | "edit";
}

export default function CourseFormSection({
  courseData,
  sections,
  expandedSections,
  onUpdateCourseData,
  onToggleSection,
  onAddSection,
  onAddLesson,
  onDeleteSection,
  onDeleteLesson,
  onEditLesson,
  onCancel,
  onSave,
  mode,
}: CourseFormSectionProps) {
  return (
    <div className="h-full overflow-y-auto p-6 border-r border-[rgba(255,255,255,0.1)]">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Basic Information
        </h3>

        <div className="space-y-4">
          <FormInput
            label="Course Title"
            value={courseData.title}
            onChange={(value) => onUpdateCourseData({ title: value })}
            placeholder="e.g., Advanced Tajweed"
          />

          <FormInput
            label="Instructor Name"
            value={courseData.instructor}
            onChange={(value) => onUpdateCourseData({ instructor: value })}
            placeholder="Ustadz/Ustadzah Name"
          />

          <FormTextarea
            label="Description"
            value={courseData.description}
            onChange={(value) => onUpdateCourseData({ description: value })}
            placeholder="Write a brief description of the course..."
            rows={4}
          />

          <div>
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Course Thumbnail
            </label>
            <UploadArea
              type="image"
              label="Click to upload or drag and drop"
              hint="SVG, PNG, JPG or GIF (max. 800x400px)"
              onFileSelect={(file) => onUpdateCourseData({ thumbnail: file })}
              accept="image/*"
            />
            {courseData.thumbnail && (
              <p className="text-sm text-[#d4af35] mt-2">
                Selected:{" "}
                {typeof courseData.thumbnail === "string"
                  ? "Image uploaded"
                  : courseData.thumbnail.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Curriculum & Content
        </h3>

        <CourseSectionList
          sections={sections}
          expandedSections={expandedSections}
          onToggleSection={onToggleSection}
          onAddLesson={onAddLesson}
          onDeleteSection={onDeleteSection}
          onDeleteLesson={onDeleteLesson}
          onEditLesson={onEditLesson}
        />

        <button
          onClick={onAddSection}
          className="w-full py-3.5 mt-4 flex items-center justify-center gap-2 text-white btn-dark"
        >
          <Plus className="h-5 w-5" />
          Add New Section
        </button>
      </div>

      <div className="flex gap-3 mt-8 pt-6 border-t border-[rgba(255,255,255,0.1)]">
        <button onClick={onCancel} className="px-6 py-3 btn-dark flex-1">
          Cancel
        </button>
        <button onClick={onSave} className="px-6 py-3 btn-gradient flex-1">
          {mode === "create" ? "Create Course" : "Update Course"}
        </button>
      </div>
    </div>
  );
}

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full input py-3"
      />
    </div>
  );
}

interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: FormTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full input py-3 resize-none"
      />
    </div>
  );
}
