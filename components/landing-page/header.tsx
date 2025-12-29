// components/AnimatedHeader.tsx
"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const AnimatedHeader = () => {
  const { scrolled } = useScrollAnimation();

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: scrolled ? 0 : 0,
        backgroundColor: scrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.8)",
        backdropFilter: scrolled ? "blur(10px)" : "blur(8px)",
        boxShadow: scrolled
          ? "0 4px 20px rgba(0, 0, 0, 0.08)"
          : "0 1px 2px rgba(0, 0, 0, 0.05)",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600"></div>
            <span className="text-xl font-bold text-gray-900">LearnHub</span>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {["Courses", "For Business", "Resources", "Pricing"].map(
              (item, index) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    color: "#3B82F6",
                  }}
                  href="#"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {item}
                </motion.a>
              )
            )}
          </nav>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-white font-medium hover:shadow-lg transition-all"
          >
            Start Free Trial
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default AnimatedHeader;
