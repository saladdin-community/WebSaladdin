"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  User,
  Mail,
  Calendar,
  BookOpen,
} from "lucide-react";
import AdminTable from "@/app/components/table/AdminTable";
import StatsCard from "@/app/components/card/StatCard";

interface Student {
  id: number;
  name: string;
  email: string;
  dateJoined: string;
  enrolledCourses: number;
  status: "active" | "blocked" | "inactive";
}

export default function AdminStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  const mockStudents: Student[] = [
    {
      id: 1,
      name: "Ahmed Fulan",
      email: "ahmed@example.com",
      dateJoined: "Oct 24, 2023",
      enrolledCourses: 3,
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Azhari",
      email: "sarahj@example.com",
      dateJoined: "Sep 05, 2023",
      enrolledCourses: 5,
      status: "active",
    },
    {
      id: 3,
      name: "Mohammed Ali",
      email: "maali@example.com",
      dateJoined: "Nov 01, 2023",
      enrolledCourses: 1,
      status: "inactive",
    },
    {
      id: 4,
      name: "Fatima Zahra",
      email: "fatima@example.com",
      dateJoined: "Aug 15, 2023",
      enrolledCourses: 8,
      status: "active",
    },
    {
      id: 5,
      name: "Bilal Hamzah",
      email: "b.hamzah@example.com",
      dateJoined: "Oct 20, 2023",
      enrolledCourses: 0,
      status: "blocked",
    },
    {
      id: 6,
      name: "Aisha Rahman",
      email: "a.rahman@example.com",
      dateJoined: "Dec 12, 2023",
      enrolledCourses: 4,
      status: "active",
    },
    {
      id: 7,
      name: "Omar Hussein",
      email: "o.hussein@example.com",
      dateJoined: "Jan 15, 2024",
      enrolledCourses: 2,
      status: "active",
    },
    {
      id: 8,
      name: "Zainab Karim",
      email: "z.karim@example.com",
      dateJoined: "Feb 28, 2024",
      enrolledCourses: 6,
      status: "inactive",
    },
  ];

  const stats = [
    {
      title: "Total Students",
      value: "2,847",
      change: "+12%",
      icon: User,
      color: "text-blue-400",
      bgColor: "bg-gradient-to-br from-blue-500/10 to-blue-600/10",
      trend: "up" as const,
    },
    {
      title: "Active Students",
      value: "2,154",
      change: "+8%",
      icon: User,
      color: "text-emerald-400",
      bgColor: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/10",
      trend: "up" as const,
    },
    {
      title: "New This Month",
      value: "142",
      change: "+23%",
      icon: User,
      color: "text-purple-400",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-purple-600/10",
      trend: "up" as const,
    },
    {
      title: "Completion Rate",
      value: "76%",
      change: "+5%",
      icon: BookOpen,
      color: "text-amber-400",
      bgColor: "bg-gradient-to-br from-amber-500/10 to-amber-600/10",
      trend: "up" as const,
    },
  ];

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tableColumns = [
    {
      key: "name",
      label: "Student Name",
      sortable: true,
      render: (value: string, row: Student) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-gold flex items-center justify-center">
            <span className="text-black font-bold">{value.charAt(0)}</span>
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-xs text-[#737373]">ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email Address",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-[#737373]" />
          <span className="text-[#d4d4d4]">{value}</span>
        </div>
      ),
    },
    {
      key: "dateJoined",
      label: "Date Joined",
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[#737373]" />
          <span className="text-[#d4d4d4]">{value}</span>
        </div>
      ),
    },
    {
      key: "enrolledCourses",
      label: "Enrolled Courses",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-[#737373]" />
          <span className="text-[#d4d4d4]">{value} Courses</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
  ];

  const handleEdit = (student: Student) => {
    console.log("Edit student:", student);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      console.log("Delete student:", id);
    }
  };

  const handleExport = () => {
    console.log("Export students data");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Registered Students
        </h1>
        <p className="text-[#737373]">
          Manage student profiles, enrollments, and status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737373]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input py-3 pl-10"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-3 bg-gradient-gold text-black font-semibold rounded-lg hover:opacity-90 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Student
          </button>
        </div>
      </div>

      {/* Students Table */}
      <AdminTable
        columns={tableColumns}
        data={filteredStudents}
        onEdit={handleEdit}
        // onDelete={handleDelete}
        onExport={handleExport}
        rowKey="id"
      />

      {/* Footer Info */}
      <div className="mt-6 text-sm text-[#737373]">
        <span className="text-[#d4af35]">Signed in as:</span> Admin
        Administrator
      </div>
    </div>
  );
}
