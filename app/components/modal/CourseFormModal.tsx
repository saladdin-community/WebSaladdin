"use client";

import { useState } from "react";
import { Upload, Video, FileText, HelpCircle, X, Plus } from "lucide-react";
import Modal from "@/app/components/modal/Modal";
import Tabs from "@/app/components/tab/Tabs";
import { courseCategories, courseLevels, Course } from "@/constants/courses";

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  courseData?: Course;
}

interface CourseFormData {
  title: string;
  slug: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  level: string;
  duration: string;
  status: "published" | "draft" | "archived";
  isFree: boolean;
  thumbnail: string;
}

interface LessonFormData {
  title: string;
  type: "video" | "article" | "quiz" | "text";
  duration: number;
  instructions: string;
  content: string;
}

export default function CourseFormModal({
  isOpen,
  onClose,
  mode = "create",
  courseData,
}: CourseFormModalProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [courseForm, setCourseForm] = useState<CourseFormData>({
    title: courseData?.title || "",
    slug: courseData?.slug || "",
    instructor: courseData?.instructor || "",
    price: courseData?.price || 0,
    originalPrice: courseData?.originalPrice,
    description: courseData?.description || "",
    category: courseData?.category || "history",
    level: courseData?.level || "beginner",
    duration: courseData?.duration || "",
    status: courseData?.status || "draft",
    isFree: courseData?.isFree || false,
    thumbnail: courseData?.thumbnail || "",
  });

  const [formData, setFormData] = useState<Omit<CourseFormData, "sections">>({
    title: "",
    instructor: "",
    description: "",
    thumbnail: undefined,
  });

  const [lessonForm, setLessonForm] = useState<LessonFormData>({
    title: "",
    type: "video",
    duration: 30,
    instructions: "",
    content: "",
  });

  const [sections, setSections] = useState([
    { id: 1, title: "Section 1: Introduction", lessons: [] },
  ]);

  const [uploadedThumbnail, setUploadedThumbnail] = useState<string | null>(
    null,
  );

  const tabs = [
    { id: "basic", label: "Basic Information" },
    { id: "curriculum", label: "Curriculum & Content" },
    { id: "settings", label: "Settings & Publish" },
  ];

  const lessonTypes = [
    {
      id: "video",
      label: "Video / Article",
      icon: <Video className="h-4 w-4" />,
    },
    { id: "text", label: "Text", icon: <FileText className="h-4 w-4" /> },
    { id: "quiz", label: "Quiz", icon: <HelpCircle className="h-4 w-4" /> },
  ];

  const handleCourseSubmit = () => {
    console.log("Course data:", courseForm);
    // API call would go here
    onClose();
  };

  const handleAddLesson = () => {
    if (!lessonForm.title.trim()) return;

    const newLesson = {
      id: Date.now(),
      ...lessonForm,
    };

    // Add lesson to first section (for demo)
    const updatedSections = [...sections];
    updatedSections[0].lessons.push(newLesson);
    setSections(updatedSections);

    // Reset form
    setLessonForm({
      title: "",
      type: "video",
      duration: 30,
      instructions: "",
      content: "",
    });
  };

  const handleRemoveLesson = (sectionIndex: number, lessonIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].lessons.splice(lessonIndex, 1);
    setSections(updatedSections);
  };

  const handleAddSection = () => {
    const newSection = {
      id: sections.length + 1,
      title: `Section ${sections.length + 1}: New Section`,
      lessons: [],
    };
    setSections([...sections, newSection]);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedThumbnail(reader.result as string);
        setCourseForm({ ...courseForm, thumbnail: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={courseForm.title}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, title: e.target.value })
                }
                placeholder="e.g., Advanced Tajweed"
                className="w-full input py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Course Slug *
              </label>
              <input
                type="text"
                value={courseForm.slug}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, slug: e.target.value })
                }
                placeholder="e.g., advanced-tajweed"
                className="w-full input py-3"
              />
              <p className="text-xs text-[#737373] mt-1">
                URL-friendly version of the title
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                Instructor Name *
              </label>
              <input
                type="text"
                value={courseForm.instructor}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, instructor: e.target.value })
                }
                placeholder="Ustadh Name"
                className="w-full input py-3"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                  Price (IDR) *
                </label>
                <input
                  type="number"
                  value={courseForm.price}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      price: Number(e.target.value),
                    })
                  }
                  placeholder="0"
                  className="w-full input py-3"
                  disabled={courseForm.isFree}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  value={courseForm.originalPrice || ""}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      originalPrice: Number(e.target.value) || undefined,
                    })
                  }
                  placeholder="Optional"
                  className="w-full input py-3"
                  disabled={courseForm.isFree}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFree"
                checked={courseForm.isFree}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, isFree: e.target.checked })
                }
                className="h-4 w-4 rounded border-[rgba(255,255,255,0.1)] bg-[#1f1f1f]"
              />
              <label htmlFor="isFree" className="text-sm text-[#d4d4d4]">
                This is a free course
              </label>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                  Description *
                </label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Write a brief description of the course..."
                  rows={8}
                  className="w-full input py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={courseForm.duration}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, duration: e.target.value })
                  }
                  placeholder="e.g., 15 hours"
                  className="w-full input py-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-[#d4d4d4] mb-3">
          Course Thumbnail
        </h4>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Thumbnail URL
            </label>
            <input
              type="text"
              value={courseForm.thumbnail}
              onChange={(e) =>
                setCourseForm({ ...courseForm, thumbnail: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              className="w-full input py-3"
            />
          </div>
          <div className="md:w-64">
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Or Upload Image
            </label>
            <div className="border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-xl p-8 text-center hover:border-[#d4af35] transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
                id="thumbnail-upload"
              />
              <label htmlFor="thumbnail-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-[#737373] mx-auto mb-4" />
                <p className="text-sm text-[#d4d4d4] mb-1">
                  <span className="text-[#d4af35]">Click to upload</span>
                </p>
                <p className="text-xs text-[#737373]">
                  PNG, JPG or GIF (max: 800x400px)
                </p>
              </label>
            </div>
          </div>
        </div>

        {uploadedThumbnail && (
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <img
                src={uploadedThumbnail}
                alt="Preview"
                className="h-20 w-32 rounded-lg object-cover"
              />
              <button
                onClick={() => {
                  setUploadedThumbnail(null);
                  setCourseForm({ ...courseForm, thumbnail: "" });
                }}
                className="p-2 hover:bg-[#262626] rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-[#737373]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCurriculum = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Curriculum & Content
      </h3>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.id}
            className="bg-[#1a1a1a] rounded-xl p-4 border border-[rgba(255,255,255,0.1)]"
          >
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={section.title}
                onChange={(e) => {
                  const updatedSections = [...sections];
                  updatedSections[sectionIndex].title = e.target.value;
                  setSections(updatedSections);
                }}
                className="bg-transparent border-b border-transparent hover:border-[#d4af35] focus:border-[#d4af35] text-white font-medium text-lg outline-none transition-colors px-1 py-1"
              />
              <button
                onClick={() => {
                  const updatedSections = sections.filter(
                    (_, i) => i !== sectionIndex,
                  );
                  setSections(updatedSections);
                }}
                className="text-sm text-rose-400 hover:text-rose-300"
              >
                Remove Section
              </button>
            </div>

            {/* Existing Lessons */}
            {section.lessons.length > 0 && (
              <div className="space-y-2 mb-4">
                {section.lessons.map((lesson: any, lessonIndex: number) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between bg-[#121212] rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          lesson.type === "video"
                            ? "bg-blue-500/10 text-blue-400"
                            : lesson.type === "quiz"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {lesson.type === "video" ? (
                          <Video className="h-4 w-4" />
                        ) : lesson.type === "quiz" ? (
                          <HelpCircle className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {lesson.title}
                        </div>
                        <div className="text-xs text-[#737373] capitalize">
                          {lesson.type} • {lesson.duration} min
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveLesson(sectionIndex, lessonIndex)
                      }
                      className="p-1 hover:bg-[#262626] rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-[#737373]" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Lesson Form */}
            <div className="bg-[#121212] rounded-lg p-4 mb-4">
              <h5 className="font-medium text-white mb-4">Add New Lesson</h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, title: e.target.value })
                    }
                    placeholder="e.g., Introduction Video"
                    className="w-full input py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                    Lesson Type
                  </label>
                  <div className="flex gap-2">
                    {lessonTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() =>
                          setLessonForm({ ...lessonForm, type: type.id as any })
                        }
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          lessonForm.type === type.id
                            ? "bg-gradient-gold text-black"
                            : "bg-[#1f1f1f] text-[#737373] hover:text-white"
                        }`}
                      >
                        {type.icon}
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {lessonForm.type === "quiz" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={lessonForm.duration}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          duration: Number(e.target.value),
                        })
                      }
                      placeholder="e.g., 30"
                      className="w-full input py-2"
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                  {lessonForm.type === "quiz"
                    ? "Quiz Instructions"
                    : "Lesson Content"}
                </label>
                <textarea
                  value={lessonForm.content}
                  onChange={(e) =>
                    setLessonForm({ ...lessonForm, content: e.target.value })
                  }
                  placeholder={
                    lessonForm.type === "quiz"
                      ? "e.g., Please read the questions carefully! This quiz covers Module 1..."
                      : "Write your lesson content here..."
                  }
                  rows={4}
                  className="w-full input py-2"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setLessonForm({
                      title: "",
                      type: "video",
                      duration: 30,
                      instructions: "",
                      content: "",
                    })
                  }
                  className="px-6 py-2 bg-[#262626] text-white rounded-lg hover:bg-[#2d2d2d]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLesson}
                  disabled={!lessonForm.title.trim()}
                  className={`px-6 py-2 font-semibold rounded-lg flex items-center gap-2 ${
                    lessonForm.title.trim()
                      ? "bg-gradient-gold text-black hover:opacity-90"
                      : "bg-[#262626] text-[#737373] cursor-not-allowed"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  {lessonForm.type === "quiz" ? "Add Quiz" : "Add Lesson"}
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleAddSection}
          className="w-full py-3 border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-xl hover:border-[#d4af35] transition-colors text-[#d4d4d4] hover:text-white flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Section
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Settings & Publishing
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Course Status *
            </label>
            <select
              value={courseForm.status}
              onChange={(e) =>
                setCourseForm({ ...courseForm, status: e.target.value as any })
              }
              className="w-full input py-3"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Category *
            </label>
            <select
              value={courseForm.category}
              onChange={(e) =>
                setCourseForm({ ...courseForm, category: e.target.value })
              }
              className="w-full input py-3"
            >
              {courseCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Difficulty Level *
            </label>
            <select
              value={courseForm.level}
              onChange={(e) =>
                setCourseForm({ ...courseForm, level: e.target.value })
              }
              className="w-full input py-3"
            >
              {courseLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Course Tags
            </label>
            <input
              type="text"
              className="w-full input py-3"
              placeholder="e.g., islamic, history, arabic (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
              Prerequisites
            </label>
            <textarea
              className="w-full input py-3"
              placeholder="What should students know before taking this course?"
              rows={3}
            />
          </div>

          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                className="h-4 w-4 rounded border-[rgba(255,255,255,0.1)] bg-[#1f1f1f]"
              />
              <label htmlFor="featured" className="text-sm text-[#d4d4d4]">
                Feature this course on homepage
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="certificate"
                className="h-4 w-4 rounded border-[rgba(255,255,255,0.1)] bg-[#1f1f1f]"
              />
              <label htmlFor="certificate" className="text-sm text-[#d4d4d4]">
                Issue certificate upon completion
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowReviews"
                className="h-4 w-4 rounded border-[rgba(255,255,255,0.1)] bg-[#1f1f1f]"
              />
              <label htmlFor="allowReviews" className="text-sm text-[#d4d4d4]">
                Allow student reviews
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "basic":
        return renderBasicInfo();
      case "curriculum":
        return renderCurriculum();
      case "settings":
        return renderSettings();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${mode === "create" ? "Create New Course" : "Edit Course"}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
        />

        {/* Tab Content */}
        {renderContent()}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-[rgba(255,255,255,0.1)]">
          <div className="text-sm text-[#737373]">
            <span className="text-[#d4af35]">Signed in as:</span> Admin
            Administrator
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#262626] text-white font-semibold rounded-lg hover:bg-[#2d2d2d] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCourseSubmit}
              className="px-6 py-3 bg-gradient-gold text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              {mode === "create" ? "Create Course" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
