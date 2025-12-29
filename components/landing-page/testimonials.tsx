"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const TestimonialSlider = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      review:
        "This platform completely transformed my career. The courses are well structured, and the instructors are top-notch. I landed my dream job within a month!",
      color: "bg-gradient-to-br from-pink-100 to-pink-50",
    },
    {
      name: "Michael Chen",
      role: "Data Analyst",
      review:
        "The flexibility to learn at my own pace was exactly what I needed. The quality of content exceeded my expectations.",
      color: "bg-gradient-to-br from-blue-100 to-blue-50",
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      review:
        "I've tried many learning platforms, but this one stands out. The interactive projects and real world applications made learning engaging and practical.",
      color: "bg-gradient-to-br from-green-100 to-green-50",
    },
    {
      name: "David Kim",
      role: "Full Stack Developer",
      review:
        "The project-based approach helped me build a strong portfolio that impressed hiring managers. Got multiple job offers within 2 months!",
      color: "bg-gradient-to-br from-purple-100 to-purple-50",
    },
    {
      name: "Jessica Wang",
      role: "Product Manager",
      review:
        "As a career switcher, I needed structured guidance. This platform provided exactly that - from fundamentals to advanced topics with real-world case studies.",
      color: "bg-gradient-to-br from-yellow-100 to-yellow-50",
    },
    {
      name: "Alex Turner",
      role: "DevOps Engineer",
      review:
        "The hands-on labs and cloud environment were game-changers. I could practice with real tools and scenarios that I encounter in my job daily.",
      color: "bg-gradient-to-br from-indigo-100 to-indigo-50",
    },
    {
      name: "Maria Garcia",
      role: "Digital Marketer",
      review:
        "The certification helped me negotiate a 40% salary increase. The practical skills I gained are directly applicable to my current role.",
      color: "bg-gradient-to-br from-red-100 to-red-50",
    },
    {
      name: "James Wilson",
      role: "Cybersecurity Analyst",
      review:
        "The lab environments for security practices were incredibly realistic. I could test vulnerabilities in a safe sandbox environment.",
      color: "bg-gradient-to-br from-teal-100 to-teal-50",
    },
    {
      name: "Sophie Martin",
      role: "AI Engineer",
      review:
        "The machine learning courses with GPU support allowed me to train complex models. The community support was exceptional.",
      color: "bg-gradient-to-br from-orange-100 to-orange-50",
    },
  ];

  // Calculate total slides - FIXED LOGIC
  const totalSlides = Math.max(
    1,
    Math.ceil(testimonials.length / itemsPerView)
  );

  // Navigation functions
  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(totalSlides - 1);
    }
  };

  // Get current testimonials to display - FIXED LOGIC
  const getCurrentTestimonials = () => {
    const start = currentIndex * itemsPerView;
    const end = Math.min(start + itemsPerView, testimonials.length);
    return testimonials.slice(start, end);
  };

  return (
    <section
      ref={ref}
      className="min-h-screen py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        {/* Header - Simple */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Student{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Success Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of learners who&apos;ve achieved their goals
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          {testimonials.length > itemsPerView && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                aria-label="Previous testimonials"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
                aria-label="Next testimonials"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getCurrentTestimonials().map((testimonial, index) => (
              <motion.div
                key={`${currentIndex}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-full flex flex-col"
              >
                {/* Top section */}
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`${testimonial.color} h-12 w-12 rounded-full flex items-center justify-center`}
                    >
                      <span className="text-lg font-bold text-gray-800">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="text-4xl text-gray-200 leading-none">"</div>
                  </div>

                  {/* Rating stars */}
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Review text */}
                <p className="text-gray-700 text-lg mb-8 flex-grow italic">
                  "{testimonial.review}"
                </p>

                {/* Author info */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Slide indicators */}
        {testimonials.length > itemsPerView && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-linear-to-r from-blue-600 to-purple-600"
                      : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSlider;
