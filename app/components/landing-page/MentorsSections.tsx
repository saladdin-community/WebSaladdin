"use client";

import { useState } from "react";
import {
  GraduationCap,
  Briefcase,
  Heart,
  Award,
  Users,
  Book,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";

const mentors = [
  {
    id: 1,
    name: "Prof. Dr. Abd al-Fattah El-Awaisi",
    title: "Professor of Islamic History",
    description:
      'PhD from Oxford with over 20 years of research in the Ayyubid and Mamluk periods. Author of "The Sword and the Pen".',
    expertise: ["Islamic History", "Medieval Studies", "Research"],
    courses: 15,
    students: 3200,
    rating: 4.9,
    icon: GraduationCap,
    social: {
      email: "malik@example.com",
      linkedin: "#",
      twitter: "#",
    },
  },
];

export default function MentorsSection() {
  const [selectedMentor, setSelectedMentor] = useState<number | null>(null);

  return (
    <section
      id="mentors"
      className="section bg-gradient-to-b from-black via-secondary-950 to-black"
    >
      <div className="container-custom">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Meet Our <span className="text-gradient-gold">Teacher</span>
          </h2>
          <p className="text-lg text-neutral-300">
            Learn directly from scholars and industry experts who have dedicated
            their lives to mastering their craft.
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {mentors.map((mentor) => {
            const Icon = mentor.icon;
            return (
              <div
                key={mentor.id}
                className={`card card-hover transition-all duration-300 ${
                  selectedMentor === mentor.id
                    ? "ring-2 ring-gold scale-105"
                    : ""
                }`}
                onClick={() => setSelectedMentor(mentor.id)}
              >
                {/* Mentor Header */}
                <div className="relative">
                  {/* Avatar */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 p-1">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-secondary-900">
                          <Icon className="h-12 w-12 text-gold" />
                        </div>
                      </div>
                      {/* Online Status */}
                      <div className="absolute bottom-2 right-2 h-3 w-3 rounded-full bg-green-500 ring-2 ring-secondary-900"></div>
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {mentor.name}
                    </h3>
                    <p className="text-gold">{mentor.title}</p>
                  </div>

                  {/* Description */}
                  <p className="mb-6 text-center text-neutral-400 line-clamp-3">
                    {mentor.description}
                  </p>

                  {/* Expertise */}
                  <div className="mb-6">
                    <div className="flex flex-wrap justify-center gap-2">
                      {mentor.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-secondary-800 px-3 py-1 text-xs text-gold border border-gold/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-6 border-t border-border pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gold">
                        {mentor.courses}
                      </div>
                      <div className="text-xs text-neutral-500">Courses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gold">
                        {mentor.students.toLocaleString()}
                      </div>
                      <div className="text-xs text-neutral-500">Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gold">
                        {mentor.rating}
                      </div>
                      <div className="text-xs text-neutral-500">Rating</div>
                    </div>
                  </div>
                </div>

                {/* Actions & Social */}
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">
                    <button className="btn btn-primary flex-1 text-sm">
                      View Courses
                    </button>
                    <button className="btn btn-outline text-sm">
                      View Bio
                    </button>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3">
                    <a
                      href={`mailto:${mentor.social.email}`}
                      className="rounded-lg p-2 text-neutral-400 hover:bg-gold/10 hover:text-gold"
                      aria-label="Email"
                    >
                      <Mail size={16} />
                    </a>
                    <a
                      href={mentor.social.linkedin}
                      className="rounded-lg p-2 text-neutral-400 hover:bg-gold/10 hover:text-gold"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={16} />
                    </a>
                    <a
                      href={mentor.social.twitter}
                      className="rounded-lg p-2 text-neutral-400 hover:bg-gold/10 hover:text-gold"
                      aria-label="Twitter"
                    >
                      <Twitter size={16} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform Features */}
        <div className="mb-16">
          <div className="card border-gold/20 p-8 md:p-12">
            <div className="grid gap-8 md:grid-cols-4">
              {[
                {
                  icon: Award,
                  title: "Verified Experts",
                  desc: "All mentors are verified professionals",
                },
                {
                  icon: Book,
                  title: "Structured Curriculum",
                  desc: "Comprehensive learning paths",
                },
                {
                  icon: Users,
                  title: "Live Sessions",
                  desc: "Interactive Q&A sessions",
                },
                {
                  icon: GraduationCap,
                  title: "Certification",
                  desc: "Recognized certificates",
                },
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-gold/20 to-gold/10">
                      <feature.icon className="h-6 w-6 text-gold" />
                    </div>
                  </div>
                  <h4 className="mb-2 font-bold text-white">{feature.title}</h4>
                  <p className="text-sm text-neutral-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
