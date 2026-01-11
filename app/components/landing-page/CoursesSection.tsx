"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Users, Star, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

const courses = [
  {
    id: 1,
    title: "Islamic History 101",
    description:
      "A comprehensive introduction to the golden age of Islamic civilization and its global impact.",
    category: "History",
    instructor: "Dr. A. Malik",
    price: null,
    originalPrice: null,
    students: 125,
    rating: 4.9,
    featured: true,
    badge: "Popular",
    tags: ["History", "Featured"],
  },
  {
    id: 2,
    title: "Leadership of Saladin",
    description:
      "Study the strategic mind and ethical leadership principles of Salahuddin Ayyubi.",
    category: "Leadership",
    instructor: "Sh. Yusuf",
    price: 150000,
    originalPrice: "Rp 200.000",
    students: 89,
    rating: 4.8,
    featured: true,
    badge: "Bestseller",
    tags: ["Leadership", "Featured"],
  },
];

export default function CoursesSection() {
  const [activeCategory] = useState("All");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
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
          className="mb-12 text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="mb-4 text-3xl font-bold md:text-4xl"
          >
            Available <span className="text-gradient-gold">Courses</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-2xl text-lg text-neutral-300"
          >
            Explore our curated curriculum designed to empower the next
            generation of leaders.
          </motion.p>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              whileHover="hover"
              custom={index}
              transition={{ delay: index * 0.1 }}
              className="card card-hover"
            >
              {/* Course Header */}
              <div className="relative mb-6">
                <div className="h-40 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-400/5">
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary-500/20" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute -bottom-3 left-4 right-4 flex justify-between">
                  <div className="flex gap-2">
                    {course.badge && (
                      <span className="badge badge-primary">
                        {course.badge}
                      </span>
                    )}
                    {course.featured && (
                      <span className="badge badge-secondary">Featured</span>
                    )}
                  </div>
                  <span className="rounded-full bg-card px-3 py-1 text-xs font-medium text-gold border border-border">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">{course.title}</h3>

                <p className="text-neutral-400 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">By</span>
                  <span className="text-sm font-medium text-gold">
                    {course.instructor}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-neutral-500" />
                      <span className="text-sm text-neutral-400">
                        {course.students}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-gold text-gold" />
                      <span className="text-sm font-medium text-white">
                        {course.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Button */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex flex-col mr-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-medium">Rp</span>
                      <span className="text-2xl font-bold text-gold">
                        {course.price != null ? course.price : "Free"}
                      </span>
                    </div>
                    {course.originalPrice && (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-neutral-500">Rp</span>
                        <span className="text-sm text-neutral-500 line-through">
                          {course.originalPrice.replace("Rp ", "")}
                        </span>
                      </div>
                    )}
                  </div>
                  <button className="btn btn-primary text-sm min-w-[120px] max-w-[140px] whitespace-nowrap px-4">
                    Enroll Now
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <Link href="/courses" className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <button className="btn btn-outline px-8 py-3">
              View All Courses
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
