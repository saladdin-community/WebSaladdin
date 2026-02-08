"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import AdminTable from "@/app/components/table/AdminTable";
import { mockCourses, Course } from "@/constants/courses";
import Link from "next/link";

export default function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

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
              {row.level.charAt(0).toUpperCase() + row.level.slice(1)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "instructor",
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
          <div className="font-medium text-gradient-gold">{value}</div>
          {row.originalPrice_formatted && (
            <div className="text-xs text-[#737373] line-through">
              {row.originalPrice_formatted}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "students",
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
          <button className="px-3 py-1.5 text-sm btn-gradient">View</button>
        </div>
      ),
    },
  ];

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this course?")) {
      console.log("Deleting course:", id);
      // API call would go here
    }
  };

  const handleExport = () => {
    console.log("Exporting courses data");
  };

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
      <AdminTable columns={tableColumns} data={filteredCourses} rowKey="id" />

      {/* Footer Info */}
      <div className="mt-6 text-sm text-[#737373]">
        <span className="text-[#d4af35]">Signed in as:</span> Admin
        Administrator
      </div>
    </div>
  );
}
