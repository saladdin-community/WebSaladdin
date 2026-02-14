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
