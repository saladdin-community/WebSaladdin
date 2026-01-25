"use client";

import { useState } from "react";
import {
  Users,
  BookOpen,
  Award,
  DollarSign,
  AlertCircle,
  ChevronRight,
  Clock,
} from "lucide-react";
import AdminTable from "@/app/components/table/AdminTable";
import StatsCard from "@/app/components/card/StatCard";
import CourseFormModal from "@/app/components/modal/CourseFormModal";

interface Course {
  id: number;
  name: string;
  instructor: string;
  price: string;
  enrolled: number;
  status: "published" | "draft";
}

export default function AdminDashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for stats
  const stats = [
    {
      title: "Total Revenue",
      value: "$24,580",
      change: "+23%",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/10",
      trend: "up" as const,
    },
    {
      title: "Active Students",
      value: "2,154",
      change: "+12%",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-gradient-to-br from-blue-500/10 to-blue-600/10",
      trend: "up" as const,
    },
    {
      title: "Total Courses",
      value: "48",
      change: "+5%",
      icon: BookOpen,
      color: "text-purple-400",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-purple-600/10",
      trend: "up" as const,
    },
    {
      title: "Completion Rate",
      value: "76%",
      change: "+3%",
      icon: Award,
      color: "text-amber-400",
      bgColor: "bg-gradient-to-br from-amber-500/10 to-amber-600/10",
      trend: "up" as const,
    },
  ];

  // Mock data for recent courses
  const recentCourses: Course[] = [
    {
      id: 1,
      name: "Islamic History: The Golden Age",
      instructor: "Dr. Yasir Qadhi",
      price: "$49.00",
      enrolled: 324,
      status: "published",
    },
    {
      id: 2,
      name: "Arabic Level 1",
      instructor: "Ustadh Ali Khan",
      price: "$99.00",
      enrolled: 856,
      status: "published",
    },
    {
      id: 3,
      name: "Intro to Fiqh",
      instructor: "Sheikh Omar",
      price: "$149.00",
      enrolled: 0,
      status: "draft",
    },
    {
      id: 4,
      name: "Quranic Recitation",
      instructor: "Qari Abdul Basit",
      price: "$29.00",
      enrolled: 60,
      status: "published",
    },
    {
      id: 5,
      name: "Seerah: The Prophetic Biography",
      instructor: "Dr. Yasir Qadhi",
      price: "$59.00",
      enrolled: 0,
      status: "draft",
    },
  ];

  const tableColumns = [
    {
      key: "name",
      label: "Course Name",
      sortable: true,
      render: (value: string) => (
        <div className="font-medium text-white line-clamp-1">{value}</div>
      ),
    },
    {
      key: "instructor",
      label: "Instructor",
      sortable: true,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
    },
    {
      key: "enrolled",
      label: "Enrolled",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
    },
  ];

  return (
    <>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Overview</h1>
          <p className="text-[#737373]">
            Welcome back, here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  Recent Courses
                </h3>
                <button className="text-sm text-[#d4af35] hover:text-[#fde047] flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <AdminTable
                columns={tableColumns}
                data={recentCourses}
                showActions={false}
                rowKey="id"
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Pending Enrollments */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-rose-500/10">
                  <AlertCircle className="h-6 w-6 text-rose-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">
                    Pending Enrollments
                  </h4>
                  <p className="text-sm text-[#737373]">Requires attention</p>
                </div>
              </div>

              <div className="text-center py-4">
                <div className="text-4xl font-bold text-rose-400 mb-2">18</div>
                <button className="w-full py-3 bg-gradient-gold text-black font-semibold rounded-lg hover:opacity-90">
                  Review Now
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
              <h4 className="font-semibold text-white mb-4">
                Today's Activity
              </h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-sm text-[#d4d4d4]">New Students</span>
                  </div>
                  <span className="font-semibold text-white">24</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span className="text-sm text-[#d4d4d4]">
                      Course Completions
                    </span>
                  </div>
                  <span className="font-semibold text-white">18</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-sm text-[#d4d4d4]">
                      Today's Revenue
                    </span>
                  </div>
                  <span className="font-semibold text-gradient-gold">
                    $1,245
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-sm text-[#737373]">
          <span className="text-[#d4af35]">Signed in as:</span> Admin
          Administrator
        </div>
      </div>

      {/* Create Course Modal */}
      <CourseFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        mode="create"
      />
    </>
  );
}
