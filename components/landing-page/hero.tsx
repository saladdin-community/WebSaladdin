// components/AnimatedHero.tsx
"use client";

import { motion, Variants } from "framer-motion";

const AnimatedHero = () => {
  const fadeUpVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const hero = [
    { value: "50K+", label: "Active Students" },
    { value: "500+", label: "Expert Courses" },
    { value: "95%", label: "Success Rate" },
  ];

  return (
    <section className="container mx-auto px-4 py-12 md:py-20 pt-24">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.h1
              variants={fadeUpVariants}
              custom={0}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Transform Your <br />
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Future with
              </span>{" "}
              <br />
              <motion.span
                variants={fadeUpVariants}
                custom={1}
                className="inline-block"
              >
                Expert-Led
              </motion.span>{" "}
              <br />
              <motion.span
                variants={fadeUpVariants}
                custom={2}
                className="inline-block"
              >
                Learning
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              custom={3}
              className="mt-6 text-lg text-gray-600 max-w-xl"
            >
              Access world-class courses, earn certifications, and unlock your
              potential with our comprehensive learning platform.
            </motion.p>

            <motion.div
              variants={fadeUpVariants}
              custom={4}
              className="mt-8 flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-8 py-3.5 text-white font-semibold hover:shadow-xl transition-all"
              >
                Start Learning Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg border border-gray-300 bg-white px-8 py-3.5 font-semibold text-gray-800 hover:bg-gray-50 transition-all"
              >
                Watch Demo
              </motion.button>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              custom={5}
              className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8"
            >
              {hero.map((stat) => (
                <motion.div
                  key={stat.value}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-linear-to-br from-white to-gray-50 shadow-sm"
                >
                  <div className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          whileHover={{ y: -10 }}
          className="lg:w-1/2"
        >
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 3, 0, -3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl"
            ></motion.div>
            <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
              <div className="aspect-video rounded-xl bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="h-16 w-16 mx-auto rounded-full bg-blue-600 flex items-center justify-center mb-6">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Watch a Free Lesson
                  </h3>
                  <p className="text-gray-600">
                    See how our expert instructors teach real-world skills
                  </p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="font-bold text-blue-700">
                    Beginner Friendly
                  </div>
                  <div className="text-sm text-blue-600">
                    Start from scratch
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="font-bold text-purple-700">
                    Hands-on Projects
                  </div>
                  <div className="text-sm text-purple-600">
                    Build real portfolio
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedHero;
