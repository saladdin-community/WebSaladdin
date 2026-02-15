"use client";

import { useState } from "react";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import AdminTable from "@/app/components/table/AdminTable";
import { Course } from "@/constants/courses";
import Link from "next/link";
import {
  useGetApiAdminCourses,
  getApiAdminCoursesQueryKey,
} from "@/app/lib/generated/hooks/useGetApiAdminCourses";
import { useDeleteApiAdminCoursesId } from "@/app/lib/generated/hooks/useDeleteApiAdminCoursesId";
import { AdminCoursesResponse } from "@/app/lib/api/admin-courses";
import { useQueryClient } from "@tanstack/react-query";
import { usePutApiAdminCoursesId } from "@/app/lib/generated/hooks/usePutApiAdminCoursesId";
import { COURSE_STATUS, COURSE_STATUS_OPTIONS } from "@/constants/courses";

export default function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const {
    data: rawData,
    isLoading,
    isError,
  } = useGetApiAdminCourses({
    page,
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
    per_page: 5,
  } as any);

  const data = rawData as unknown as AdminCoursesResponse;

  const deleteMutation = useDeleteApiAdminCoursesId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getApiAdminCoursesQueryKey(),
        }); // Invalidate broad key or specific? generated key factory helps.
        // Actually, invalidateQueries match by prefix.
        queryClient.invalidateQueries({
          queryKey: [{ url: "/api/admin/courses" }],
        });
      },
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate({ id });
    }
  };

  const updateCourseMutation = usePutApiAdminCoursesId();

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await updateCourseMutation.mutateAsync({
        id,
        data: { status: newStatus },
      });
      queryClient.invalidateQueries({
        queryKey: [{ url: "/api/admin/courses" }],
      });
      // Optionally show toast/alert
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const tableColumns = [
    {
      key: "title",
      label: "Course Title",
      sortable: true,
      render: (value: string, row: Course) => (
        <div className="flex items-center gap-3">
          <img
            src={row.thumbnail}
            alt={value}
            className="h-10 w-16 rounded object-cover"
          />
          <div className="min-w-0">
            <div className="font-medium text-white truncate">{value}</div>
            <div className="text-xs text-[#737373]">
              ID: {row.id} •{" "}
              {row.level &&
                row.level.charAt(0).toUpperCase() + row.level.slice(1)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "instructor_name",
      label: "Instructor",
      sortable: true,
      render: (value: string) => (
        <span className="text-[#d4d4d4]">{value}</span>
      ),
    },
    {
      key: "price_formatted",
      label: "Price",
      sortable: true,
      render: (value: string, row: Course) => (
        <div>
          <div className="font-medium text-gradient-gold">
            {row.price_formatted}
          </div>
          {row.originalPrice_formatted && (
            <div className="text-xs text-[#737373] line-through">
              {row.originalPrice_formatted}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "students_count",
      label: "Students",
      sortable: true,
      render: (value: number) => (
        <span className="font-medium text-white">{value}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string, row: Course) => {
        const currentOption = COURSE_STATUS_OPTIONS.find(
          (opt) => opt.value === value,
        ) || {
          label: value,
          color: "bg-gray-500/10 text-gray-400",
          value: value,
        };

        return (
          <div className="relative group">
            <button
              className={`px-2.5 py-1 rounded-full text-xs font-medium border border-transparent ${currentOption.color} hover:border-current transition-all`}
            >
              {currentOption.label}
            </button>

            {/* Dropdown on hover/focus within group - Simple CSS hover implementation for speed */}
            <div className="absolute left-0 mt-1 w-32 bg-[#262626] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              {COURSE_STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusUpdate(row.id, opt.value)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-[#333] transition-colors ${
                    opt.value === value
                      ? "text-white font-medium bg-[#333]"
                      : "text-[#a3a3a3]"
                  }`}
                  disabled={
                    opt.value === value || updateCourseMutation.isPending
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (_: any, row: Course) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/courses/${row.id}/edit`}
            className="px-3 py-1.5 text-sm btn-dark"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1.5 text-sm btn-dark text-red-500 hover:text-red-400"
            disabled={deleteMutation.isPending}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">All Courses</h1>
        <p className="text-[#737373]">
          Manage and organize your learning content.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              placeholder="Search by title or instructor..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Reset page on search
              }}
              className="w-full input py-3 pl-10"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/courses/create"
            className="px-4 py-3 btn-gradient flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create New Course
          </Link>
        </div>
      </div>

      {/* Courses Table */}
      {isLoading ? (
        <div className="text-center text-white py-10">Loading courses...</div>
      ) : isError ? (
        <div className="text-center text-red-500 py-10">
          Error loading courses. Please try again.
        </div>
      ) : (
        <>
          <AdminTable
            columns={tableColumns}
            data={data?.data?.data || []}
            showActions={false}
            rowKey="id"
          />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-white">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 btn-dark disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {data?.data?.current_page || 1} of{" "}
              {data?.data?.last_page || 1}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(data?.data?.last_page || 1, p + 1))
              }
              disabled={page === (data?.data?.last_page || 1)}
              className="px-4 py-2 btn-dark disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Footer Info */}
      <div className="mt-6 text-sm text-[#737373]">
        <span className="text-[#d4af35]">Signed in as:</span> Admin
        Administrator
      </div>
    </div>
  );
}
