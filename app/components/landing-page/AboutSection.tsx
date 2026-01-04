// app/about/page.tsx
"use client";

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-32 px-4">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Left Content - Text & Mission */}
            <div className="lg:w-1/2">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/20 border border-primary-500/30 mb-8">
                <span className="text-sm font-medium text-primary-300">
                  OUR FUTURE
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-gradient-gold mb-8 leading-tight text-white">
                Reviving the{" "}
                <span className="text-gradient-gold">Golden Age</span> of Islam
              </h1>

              {/* Description */}
              <div className="space-y-6 mb-10">
                <p className="text-xl text-neutral-300 leading-relaxed">
                  Saladin Na'rifi Learning connects the Golden Age of Liberation
                  with the rich intellectual tradition of Islamic civilization,
                  aligning timeless principles with contemporary realities.
                </p>
                <p className="text-xl text-neutral-300 leading-relaxed">
                  Our mission is to develop leaders defined by wisdom,
                  integrity, and excellence.
                </p>
              </div>

              {/* CTA Button */}
              <Link
                href="/story"
                className="btn btn-primary inline-flex items-center gap-3 text-lg px-8 py-4 group"
              >
                Read our full story
                <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            {/* Right Content - Image/Graphic Section */}
            <div className="lg:w-1/2">
              <div className="relative">
                {/* Main Graphic Container */}
                <div className="relative bg-card border-2 border-border-gold rounded-3xl p-10 md:p-12 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-500 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-primary-500 to-transparent rounded-full blur-3xl"></div>
                  </div>

                  {/* Center Graphic Element */}
                  <div className="relative z-10">
                    {/* Badge/Emblem */}
                    <div className="mx-auto mb-8 w-32 h-32 rounded-full bg-gradient-gold flex items-center justify-center shadow-2xl shadow-gold/30">
                      <div className="w-28 h-28 rounded-full bg-secondary-900 flex items-center justify-center">
                        <span className="text-4xl font-serif text-gold">
                          ٨٠٠
                        </span>
                      </div>
                    </div>

                    {/* Statistic Display */}
                    <div className="text-center mb-10">
                      <div className="text-7xl md:text-8xl font-serif text-gradient-gold mb-4 leading-none">
                        800+
                      </div>
                      <div className="text-2xl font-semibold text-neutral-100 mb-2">
                        YEARS LEGACY
                      </div>
                      <div className="w-32 h-1 bg-gradient-gold mx-auto mb-6"></div>
                    </div>

                    {/* Quote Section */}
                    <div className="bg-secondary-900/80 border border-border rounded-2xl p-8 relative">
                      {/* Quote Marks */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
                          <span className="text-lg text-secondary-900 font-serif">
                            "
                          </span>
                        </div>
                      </div>

                      {/* Quote Text */}
                      <p className="text-xl text-center text-neutral-200 italic leading-relaxed mb-6">
                        "I warn you against shedding blood, indulging in it and
                        making a habit of it, for blood never sleeps."
                      </p>

                      {/* Author */}
                      <div className="text-center">
                        <div className="inline-flex flex-col items-center">
                          <div className="w-24 h-px bg-gradient-gold mb-3"></div>
                          <div className="text-2xl font-serif text-gold">
                            — SALAHUDDIN AYYUBI
                          </div>
                          <div className="text-sm text-neutral-400 mt-2">
                            Sultan of Egypt and Syria
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="flex justify-center gap-8 mt-10">
                      <div className="w-6 h-1 bg-gradient-gold rotate-45"></div>
                      <div className="w-6 h-1 bg-gradient-gold"></div>
                      <div className="w-6 h-1 bg-gradient-gold -rotate-45"></div>
                    </div>
                  </div>
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-gold rounded-tl-lg"></div>
                <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-gold rounded-tr-lg"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-gold rounded-bl-lg"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-gold rounded-br-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
