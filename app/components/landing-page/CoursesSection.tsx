"use client";

import { motion, Variants } from "framer-motion";
import { ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";
import CourseCard from "@/app/components/card/CourseCard";
import { useGetApiCourses } from "@/app/lib/generated";

export default function CoursesSection() {
  const { data: coursesData, isLoading, error } = useGetApiCourses();

  // Get top 4 courses from API
  const displayedCourses = coursesData?.data?.slice(0, 4) || [];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <section id="courses" className="section bg-card">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="mb-8 text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="mb-3 text-2xl font-bold md:text-3xl"
          >
            Available <span className="text-gradient-gold">Courses</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-2xl text-base text-neutral-300"
          >
            Explore our curated curriculum designed to empower the next
            generation of leaders.
          </motion.p>
        </motion.div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#1a1a1a] animate-pulse"
              >
                <div className="w-full aspect-[16/9] bg-[#242424]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 bg-[#2a2a2a] rounded" />
                  <div className="h-3 w-1/2 bg-[#2a2a2a] rounded" />
                  <div className="h-10 bg-[#2a2a2a] rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-[#1f1f1f] rounded-xl border border-[rgba(255,255,255,0.1)]">
            <BookOpen className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl text-[#d4d4d4] mb-2">
              Failed to load courses
            </h3>
            <p className="text-neutral-500 text-sm">
              {(error as any)?.message || "Please try again later."}
            </p>
          </div>
        ) : displayedCourses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedCourses.map((course: any, index: number) => (
              <motion.div
                key={course.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                whileHover="hover"
                custom={index}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <CourseCard
                  id={course.id}
                  title={course.title}
                  slug={course.slug}
                  thumbnail={course.thumbnail}
                  instructor={course.instructor_name || "Instructor"}
                  price={course.price || 0}
                  price_formatted={course.price_formatted || "Free"}
                  description={course.description}
                  level={course.level || "All Levels"}
                  isFree={course.price === 0}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#1f1f1f] rounded-xl border border-[rgba(255,255,255,0.1)]">
            <BookOpen className="h-12 w-12 text-[#333] mx-auto mb-4" />
            <h3 className="text-xl text-[#d4d4d4] mb-2">
              No courses available right now
            </h3>
            <p className="text-neutral-500 text-sm">
              Check back later for new content.
            </p>
          </div>
        )}

        {/* View All Button */}
        <Link
          href="/courses"
          className="flex items-center gap-3 justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <button className="btn btn-outline px-8 py-3 flex items-center">
              View All Courses
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
