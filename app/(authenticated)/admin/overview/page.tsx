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
import { useGetApiAdminCourses } from "@/app/lib/generated";

export default function AdminDashboardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: coursesData, isLoading } = useGetApiAdminCourses({
    per_page: 5,
  });

  const recentCourses = (coursesData?.data?.data || []).map((course: any) => ({
    id: course.id,
    name: course.title,
    instructor: course.instructor_name || "N/A",
    price: parseInt(course.price) === 0 ? "Free" : `Rp. ${course.price}`,
    enrolled: course.students_count || 0,
    status: course.status,
  }));

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
                isLoading={isLoading}
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
