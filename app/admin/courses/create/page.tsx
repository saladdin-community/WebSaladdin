"use client";

import { useState } from "react";
import {
  Save,
  Upload,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit2,
} from "lucide-react";
import Link from "next/link";
import LessonModal from "@/app/components/courses/LessonModal";
import { Section } from "@/constants/courses";

export default function CreateCoursePage() {
  // State untuk Course Form
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  // State untuk Curriculum
  const [sections, setSections] = useState<Section[]>([
    {
      id: 1,
      title: "Introduction",
      lessons: [
        { id: 1, title: "Welcome Video" },
        { id: 2, title: "Course Syllabus" },
      ],
    },
    {
      id: 2,
      title: "Chapter 1: The Basics",
      lessons: [{ id: 3, title: "Basic Concepts" }],
    },
  ]);

  const [expandedSections, setExpandedSections] = useState<number[]>([1, 2]);

  // State untuk modal lesson
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null,
  );
  const [selectedLesson, setSelectedLesson] = useState<{
    sectionId: number;
    lessonId: number;
  } | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  // Handler functions
  const handleAddSection = () => {
    const newId =
      sections.length > 0 ? Math.max(...sections.map((s) => s.id)) + 1 : 1;
    setSections([
      ...sections,
      {
        id: newId,
        title: `Section ${sections.length + 1}`,
        lessons: [],
      },
    ]);
    setExpandedSections([...expandedSections, newId]);
  };

  const handleAddLesson = (sectionId: number) => {
    setSelectedSectionId(sectionId);
    setSelectedLesson(null);
    setModalMode("add");
    setShowLessonModal(true);
  };

  const handleEditLesson = (sectionId: number, lessonId: number) => {
    setSelectedSectionId(sectionId);
    setSelectedLesson({ sectionId, lessonId });
    setModalMode("edit");
    setShowLessonModal(true);
  };

  const handleSaveLesson = (lessonData: any) => {
    if (modalMode === "add" && selectedSectionId) {
      // Add new lesson
      const newLessonId =
        sections.find((s) => s.id === selectedSectionId)?.lessons.length || 0;

      const updatedSections = sections.map((section) => {
        if (section.id === selectedSectionId) {
          return {
            ...section,
            lessons: [
              ...section.lessons,
              {
                id: newLessonId + 1,
                title: `Lesson ${section.lessons.length + 1}`,
                ...lessonData,
              },
            ],
          };
        }
        return section;
      });
      setSections(updatedSections);
    } else if (modalMode === "edit" && selectedLesson) {
      // Update existing lesson
      const updatedSections = sections.map((section) => {
        if (section.id === selectedLesson.sectionId) {
          return {
            ...section,
            lessons: section.lessons.map((lesson) => {
              if (lesson.id === selectedLesson.lessonId) {
                return {
                  ...lesson,
                  ...lessonData,
                };
              }
              return lesson;
            }),
          };
        }
        return section;
      });
      setSections(updatedSections);
    }

    setShowLessonModal(false);
    setSelectedSectionId(null);
    setSelectedLesson(null);
  };

  const handleDeleteLesson = (sectionId: number, lessonId: number) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const handleDeleteSection = (sectionId: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((s) => s.id !== sectionId));
    setExpandedSections(expandedSections.filter((id) => id !== sectionId));
  };

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const handleSaveCourse = () => {
    const courseData = {
      title,
      instructor,
      description,
      price,
      thumbnail,
      sections,
    };
    console.log("Saving course:", courseData);
    // API call would go here
  };

  const currentLesson = selectedLesson
    ? sections
        .find((s) => s.id === selectedLesson.sectionId)
        ?.lessons.find((l) => l.id === selectedLesson.lessonId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
      {/* Header */}
      <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Create New Course</h1>
            <p className="text-[#737373] mt-1">
              Design your course structure and content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/courses" className="px-5 py-2.5 btn-dark">
              Cancel
            </Link>
            <button
              onClick={handleSaveCourse}
              className="px-5 py-2.5 btn-gradient flex items-center gap-2"
            >
              <Save className="h-5 w-5" />
              Save Course
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Course Form */}
        <div className="w-1/2 border-r border-[rgba(255,255,255,0.1)] overflow-y-auto">
          <div className="p-6">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">
                Basic Information
              </h2>

              <div className="space-y-4">
                {/* Course Title */}
                <div>
                  <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Advanced Tajweed"
                    className="w-full input py-3"
                  />
                </div>

                {/* Instructor and Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      placeholder="Ustadz/Ustadzah Name"
                      className="w-full input py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                      Price (IDR)
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 199,000"
                      className="w-full input py-3"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a brief description of the course..."
                    rows={4}
                    className="w-full input py-3 resize-none"
                  />
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                    Course Thumbnail
                  </label>
                  <div
                    className="border-2 border-dashed border-[rgba(212,175,53,0.3)] rounded-lg p-8 text-center cursor-pointer hover:border-[#d4af35] transition-colors bg-[#1a1a1a]"
                    onClick={() =>
                      document.getElementById("thumbnail-upload")?.click()
                    }
                  >
                    <Upload className="h-8 w-8 text-[#d4af35] mx-auto mb-3" />
                    <p className="text-white mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-[#737373]">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </p>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setThumbnail(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </div>
                  {thumbnail && (
                    <p className="text-sm text-[#d4af35] mt-2">
                      Selected: {thumbnail.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Lessons Overview */}
        <div className="w-1/2 overflow-y-auto">
          <div className="p-6">
            {/* Curriculum & Content Section */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">
                Curriculum & Content
              </h2>

              <div className="space-y-4">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="border border-[rgba(255,255,255,0.1)] rounded-lg overflow-hidden"
                  >
                    {/* Section Header */}
                    <div className="bg-[#1f1f1f] px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="p-1 hover:bg-[#262626] rounded transition-colors"
                        >
                          {expandedSections.includes(section.id) ? (
                            <ChevronUp className="h-4 w-4 text-[#737373]" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-[#737373]" />
                          )}
                        </button>
                        <h3 className="font-medium text-white">
                          {section.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-1 hover:bg-[#262626] rounded transition-colors text-[#ef4444]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Content */}
                    {expandedSections.includes(section.id) && (
                      <div className="p-4 space-y-3 bg-[#1a1a1a]">
                        {section.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between bg-[#171717] px-4 py-3 rounded-lg border border-[rgba(255,255,255,0.05)]"
                          >
                            <span className="text-[#d4d4d4] font-medium">
                              {lesson.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleEditLesson(section.id, lesson.id)
                                }
                                className="px-3 py-1.5 text-sm btn-dark"
                              >
                                Edit Lesson
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteLesson(section.id, lesson.id)
                                }
                                className="p-1.5 hover:bg-[#262626] rounded transition-colors text-[#ef4444]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Add Lesson Button */}
                        <button
                          onClick={() => handleAddLesson(section.id)}
                          className="w-full py-2.5 flex items-center justify-center gap-2 text-[#d4af35] hover:bg-[#1f1f1f] rounded-lg border border-dashed border-[rgba(212,175,53,0.3)] transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add Lesson
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add New Section Button */}
                <button
                  onClick={handleAddSection}
                  className="w-full py-3.5 flex items-center justify-center gap-2 text-white btn-dark"
                >
                  <Plus className="h-5 w-5" />
                  Add New Section
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.1)] bg-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#737373]">
            <span className="text-[#d4af35]">Signed in as:</span> Salaolin
            Admiré Administratrice
          </div>
          <div className="text-sm text-[#737373]">Page 1 of 1</div>
        </div>
      </div>

      {/* Lesson Modal */}
      <LessonModal
        isOpen={showLessonModal}
        onClose={() => {
          setShowLessonModal(false);
          setSelectedSectionId(null);
          setSelectedLesson(null);
        }}
        mode={modalMode}
        lessonData={currentLesson || undefined}
        onSave={handleSaveLesson}
      />
    </div>
  );
}
