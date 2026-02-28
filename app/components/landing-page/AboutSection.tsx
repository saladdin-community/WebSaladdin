"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function AboutPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const badgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "backOut" },
    },
  };

  const statVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <section id="about" className="relative overflow-hidden py-12 px-4">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">
            {/* Left Content - Text & Mission */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="lg:w-1/2"
            >
              {/* Badge */}
              <motion.div
                variants={badgeVariants}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/20 border border-primary-500/30 mb-8"
              >
                <span className="text-sm font-medium text-primary-300">
                  OUR FUTURE
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                variants={itemVariants}
                className="text-3xl md:text-4xl lg:text-5xl text-gradient-gold mb-4 leading-tight text-white"
              >
                Reviving the{" "}
                <span className="text-gradient-gold">Golden Age</span> of Islam
              </motion.h1>

              {/* Description */}
              <div className="space-y-6 mb-10">
                <motion.p
                  variants={itemVariants}
                  className="text-base text-neutral-300 leading-relaxed"
                >
                  Saladdin LMS connects the Golden Age of Liberation with the
                  rich intellectual tradition of Islamic civilization, aligning
                  timeless principles with contemporary realities.
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  className="text-base text-neutral-300 leading-relaxed"
                >
                  Our mission is to develop leaders defined by wisdom,
                  integrity, and excellence.
                </motion.p>
              </div>

              {/* CTA Button */}
              <motion.div variants={itemVariants}>
                <Link
                  href="/"
                  className="btn btn-primary inline-flex items-center gap-3 text-base px-6 py-2.5 group"
                >
                  Read our full story
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Image/Graphic Section */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={cardVariants}
              className="lg:w-1/2"
            >
              <div className="relative">
                {/* Main Graphic Container */}
                <div className="relative bg-card border-2 border-border-gold rounded-3xl p-8 md:p-10 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-500 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-500 to-transparent rounded-full blur-3xl"></div>
                  </div>

                  {/* Center Graphic Element */}
                  <div className="relative z-10">
                    {/* Badge/Emblem */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2,
                        ease: "backOut",
                      }}
                      className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-2xl shadow-gold/30"
                    >
                      <div className="w-16 h-16 rounded-full bg-secondary-900 flex items-center justify-center">
                        <span className="text-2xl font-serif text-gold">
                          ٨٠٠
                        </span>
                      </div>
                    </motion.div>

                    {/* Statistic Display */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-center mb-6"
                    >
                      <div className="text-3xl md:text-4xl font-serif text-gradient-gold mb-2 leading-none">
                        800+
                      </div>
                      <div className="text-lg font-semibold text-neutral-100 mb-1">
                        YEARS LEGACY
                      </div>
                      <div className="w-16 h-1 bg-gradient-gold mx-auto mb-4"></div>
                    </motion.div>

                    {/* Quote Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="bg-secondary-900/80 border border-border rounded-2xl p-6 relative"
                    >
                      {/* Quote Text */}
                      <p className="text-lg text-center text-neutral-200 italic leading-relaxed mb-4">
                        "I warn you against shedding blood, indulging in it and
                        making a habit of it, for blood never sleeps."
                      </p>

                      {/* Author */}
                      <div className="text-center">
                        <div className="inline-flex flex-col items-center">
                          <div className="w-20 h-px bg-gradient-gold mb-2"></div>
                          <div className="text-xl font-serif text-gold">
                            — SALAHUDDIN AYYUBI
                          </div>
                          <div className="text-sm text-neutral-400 mt-1">
                            Sultan of Egypt and Syria
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
