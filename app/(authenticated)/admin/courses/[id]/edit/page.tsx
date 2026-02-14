"use client";

import { useState, useEffect, use } from "react";
import { Save, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminCourseDetailResponse } from "@/app/lib/api/admin-courses";
import {
  usePutApiAdminCoursesId,
  putApiAdminCoursesId,
} from "@/app/lib/generated/hooks/usePutApiAdminCoursesId";
import { useGetApiAdminCoursesId } from "@/app/lib/generated/hooks/useGetApiAdminCoursesId";
import { courseCategories, courseLevels } from "@/constants/courses";

export default function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const courseId = parseInt(id);
  const router = useRouter();
  const queryClient = useQueryClient();

  // State
  const [title, setTitle] = useState("");
  const [instructor_name, setInstructorName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  // Fetch Course Data
  const {
    data: rawData,
    isLoading,
    isError,
  } = useGetApiAdminCoursesId(courseId);

  const courseData = rawData as unknown as AdminCourseDetailResponse;

  // Populate Form
  useEffect(() => {
    if (courseData?.data) {
      const course = courseData.data;
      setTitle(course.title || "");
      setInstructorName(course.instructor_name || "");
      setDescription(course.description || "");
      setPrice(course.price ? course.price.toString() : "");
      setPreviewThumbnail(course.thumbnail || null);
    }
  }, [courseData]);

  // Update Mutation
  const { mutate: updateCourse, isPending: isUpdating } =
    usePutApiAdminCoursesId({
      mutation: {
        mutationFn: async ({ id, data }: { id: number; data: any }) => {
          return putApiAdminCoursesId(id, {
            data,
            method: "PUT",
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["admin-course", courseId],
          });
          queryClient.invalidateQueries({
            queryKey: [{ url: "/api/admin/courses" }],
          });
          alert("Course updated successfully!");
          router.push("/admin/courses");
        },
        onError: (error) => {
          console.error("Failed to update course", error);
          alert("Failed to update course. Please check your inputs.");
        },
      },
    }) as any;

  const handleSaveCourse = () => {
    if (!title || !instructor_name || !price || !description) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title", title);
    formData.append("instructor_name", instructor_name);
    formData.append("price", price.replace(/[^0-9]/g, ""));
    formData.append("description", description);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    // Call mutation with config overriding the default request
    // We override method to POST to handle FormData with _method: PUT (Laravel style)
    updateCourse({ id: courseId, data: formData });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] flex items-center justify-center text-white">
        Loading course data...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] flex items-center justify-center text-red-500">
        Error loading course. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
      {/* Header */}
      <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Course</h1>
            <p className="text-[#737373] mt-1">
              Update course details and content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/courses" className="px-5 py-2.5 btn-dark">
              Cancel
            </Link>
            <button
              onClick={handleSaveCourse}
              disabled={isUpdating}
              className="px-5 py-2.5 btn-gradient flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Course Form */}
        <div className="w-full md:w-2/3 border-r border-[rgba(255,255,255,0.1)] overflow-y-auto mx-auto">
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
                    Course Title <span className="text-red-500">*</span>
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
                      Instructor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={instructor_name}
                      onChange={(e) => setInstructorName(e.target.value)}
                      placeholder="Ustadz/Ustadzah Name"
                      className="w-full input py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                      Price (IDR) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 199000"
                      className="w-full input py-3"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#d4d4d4] mb-2">
                    Description <span className="text-red-500">*</span>
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
                    {previewThumbnail && !thumbnail ? (
                      <img
                        src={previewThumbnail}
                        alt="Thumbnail"
                        className="h-32 w-auto mx-auto mb-3 object-cover rounded"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-[#d4af35] mx-auto mb-3" />
                    )}
                    <p className="text-white mb-1">
                      {thumbnail
                        ? `Selected: ${thumbnail.name}`
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-[#737373]">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </p>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setThumbnail(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.1)] bg-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <div className="text-sm text-[#737373]">
            <span className="text-[#d4af35]">Signed in as:</span> Admin
          </div>
        </div>
      </div>
    </div>
  );
}
