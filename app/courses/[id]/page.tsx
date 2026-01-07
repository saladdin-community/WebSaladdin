// app/courses/[id]/page.tsx
"use client";

import { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  MessageSquare,
  FileText,
  Download,
  Share2,
  CheckCircle,
  Circle,
  Lock,
} from "lucide-react";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export default function CourseDetailPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(25);
  const [currentTime, setCurrentTime] = useState("5:42");
  const [duration, setDuration] = useState("22:45");
  const [activeModule, setActiveModule] = useState<string>("module1");
  const [activeLesson, setActiveLesson] = useState<string>("lesson2");
  const videoRef = useRef<HTMLVideoElement>(null);

  const modules: Module[] = [
    {
      id: "module1",
      title: "The Umayyad Era",
      description:
        "Foundational period of Al-Aqsa's construction and early Islamic architecture",
      lessons: [
        {
          id: "lesson1",
          title: "Historical Context",
          duration: "15:30",
          isCompleted: true,
          isLocked: false,
        },
        {
          id: "lesson2",
          title: "Construction of the Dome",
          duration: "22:45",
          isCompleted: false,
          isLocked: false,
        },
        {
          id: "lesson3",
          title: "Interior Mosaics",
          duration: "18:20",
          isCompleted: false,
          isLocked: false,
        },
        {
          id: "lesson4",
          title: "Interior Architecture",
          duration: "20:15",
          isCompleted: false,
          isLocked: false,
        },
      ],
    },
    {
      id: "module2",
      title: "The Abbasid Era",
      description: "Renovations and developments during the Abbasid Caliphate",
      lessons: [
        {
          id: "lesson5",
          title: "Abbasid Contributions",
          duration: "25:10",
          isCompleted: false,
          isLocked: true,
        },
        {
          id: "lesson6",
          title: "Architectural Changes",
          duration: "19:45",
          isCompleted: false,
          isLocked: true,
        },
      ],
    },
    {
      id: "module3",
      title: "The Crusader Period",
      description: "Al-Aqsa during the Crusades and its subsequent liberation",
      lessons: [
        {
          id: "lesson7",
          title: "Crusader Occupation",
          duration: "30:20",
          isCompleted: false,
          isLocked: true,
        },
        {
          id: "lesson8",
          title: "Salahuddin's Liberation",
          duration: "28:15",
          isCompleted: false,
          isLocked: true,
        },
      ],
    },
  ];

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);
    if (videoRef.current) {
      videoRef.current.currentTime =
        (newProgress / 100) * videoRef.current.duration;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="border-b border-[rgba(255,255,255,0.1)] bg-[#121212]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/courses"
                className="flex items-center gap-2 text-[#a3a3a3] hover:text-white transition-colors duration-300"
              >
                <ChevronLeft className="h-5 w-5" />
                Back to Courses
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">
                  The History of Al-Aqsa
                </h1>
                <p className="text-sm text-[#737373]">
                  Module 1: The Umayyad Era • Lesson 2 of 4
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm text-[#737373]">Course Progress</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-32 bg-[#404040] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#d4af35] to-[#fde047] rounded-full transition-all duration-500"
                      style={{ width: "13%" }}
                    ></div>
                  </div>
                  <span className="text-sm text-[#d4d4d4]">13%</span>
                </div>
              </div>
              <button className="btn btn-primary px-6 py-2.5 font-bold">
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Video Player */}
          <div className="lg:w-2/3">
            {/* Video Player */}
            <div className="bg-[#0a0a0a] rounded-xl overflow-hidden mb-6 border border-[rgba(255,255,255,0.1)]">
              <div className="relative aspect-video">
                {/* Video Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#121212] flex items-center justify-center">
                  <div className="text-center">
                    <button
                      onClick={handlePlayPause}
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-gold flex items-center justify-center hover:shadow-glow transition-all duration-300"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-black" />
                      ) : (
                        <Play className="h-8 w-8 text-black ml-1" />
                      )}
                    </button>
                    <p className="text-[#737373]">
                      Click play to start the video
                    </p>
                  </div>
                </div>

                {/* Custom Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleProgressChange}
                      className="w-full h-1.5 bg-[#404040] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-gold"
                    />
                    <div className="flex justify-between text-sm text-[#a3a3a3] mt-1.5">
                      <span>{currentTime}</span>
                      <span>{duration}</span>
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handlePlayPause}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6 text-white" />
                        ) : (
                          <Play className="h-6 w-6 text-white" />
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-[#d4d4d4]" />
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-24 h-1.5 bg-[#404040] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-gold"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300 text-[#d4d4d4]">
                        <Download className="h-5 w-5" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300 text-[#d4d4d4]">
                        <Share2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300 text-[#d4d4d4]"
                      >
                        {isFullscreen ? (
                          <Minimize className="h-5 w-5" />
                        ) : (
                          <Maximize className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="card mb-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Construction of the Dome
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-[#737373] mb-4">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      22:45 min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      Module 1 • Lesson 2
                    </span>
                  </div>
                </div>
                <button className="btn btn-primary px-6 py-2.5 font-bold self-start">
                  Mark Complete
                </button>
              </div>

              <div className="space-y-4 text-[#d4d4d4] leading-relaxed">
                <p>
                  The Dome of the Rock (Qubbat al-Sakhra) was constructed
                  between 685 and 691 CE by the Umayyad Caliph Abd al-Malik ibn
                  Marwan. It is one of the oldest extant works of Islamic
                  architecture.
                </p>
                <p>
                  Its architecture and mosaics were patterned after nearby
                  Byzantine churches and palaces, although its outside
                  appearance has been significantly changed in the Ottoman
                  period and again in the modern period.
                </p>
                <p>
                  In this lesson, we will explore the political and religious
                  motivations behind its construction. We will look at the
                  architectural innovations introduced during this period,
                  including the octagonal plan and the double-shelled timber
                  dome.
                </p>
                <p>
                  We will also discuss the significance of the location on the
                  Temple Mount (Haram al-Sharif) and its relation to the
                  Prophet's Night Journey (Isra and Mi'raj).
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1f1f1f] hover:bg-[#262626] text-[#d4d4d4] hover:text-white rounded-md transition-all duration-300 border border-[rgba(255,255,255,0.1)] font-semibold">
                <ChevronLeft className="h-5 w-5" />
                Previous Lesson
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 btn-primary font-bold">
                Next Lesson
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right Column - Course Navigation */}
          <div className="lg:w-1/3">
            <div className="card space-y-6">
              {/* Course Modules */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Course Modules
                </h3>
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div
                      key={module.id}
                      className="border border-[rgba(255,255,255,0.1)] rounded-lg overflow-hidden bg-[#1a1a1a]"
                    >
                      <button
                        onClick={() =>
                          setActiveModule(
                            activeModule === module.id ? "" : module.id
                          )
                        }
                        className={`w-full p-4 text-left transition-colors duration-300 ${
                          activeModule === module.id
                            ? "bg-[rgba(212,175,53,0.1)]"
                            : "hover:bg-[#262626]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">
                            {module.title}
                          </h4>
                          <ChevronRight
                            className={`h-5 w-5 text-[#737373] transition-transform duration-300 ${
                              activeModule === module.id ? "rotate-90" : ""
                            }`}
                          />
                        </div>
                        <p className="text-sm text-[#737373] text-left">
                          {module.description}
                        </p>
                      </button>

                      {activeModule === module.id && (
                        <div className="p-4 pt-2 border-t border-[rgba(255,255,255,0.1)]">
                          <div className="space-y-2">
                            {module.lessons.map((lesson) => (
                              <button
                                key={lesson.id}
                                onClick={() =>
                                  !lesson.isLocked && setActiveLesson(lesson.id)
                                }
                                className={`w-full p-3 rounded-md flex items-center justify-between transition-all duration-300 ${
                                  activeLesson === lesson.id
                                    ? "bg-gradient-to-r from-[rgba(212,175,53,0.2)] to-[rgba(253,224,71,0.1)] border border-[rgba(212,175,53,0.3)]"
                                    : lesson.isLocked
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-[#262626] border border-transparent"
                                }`}
                                disabled={lesson.isLocked}
                              >
                                <div className="flex items-center gap-3">
                                  {lesson.isCompleted ? (
                                    <CheckCircle className="h-5 w-5 text-[#22c55e]" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-[#404040]" />
                                  )}
                                  <span
                                    className={`text-sm ${
                                      activeLesson === lesson.id
                                        ? "text-[#d4af35] font-semibold"
                                        : lesson.isLocked
                                        ? "text-[#737373]"
                                        : "text-[#d4d4d4]"
                                    }`}
                                  >
                                    {lesson.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-[#737373]">
                                    {lesson.duration}
                                  </span>
                                  {lesson.isLocked && (
                                    <Lock className="h-3 w-3 text-[#737373]" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              <div className="pt-6 border-t border-[rgba(255,255,255,0.1)]">
                <h3 className="text-xl font-bold text-white mb-4">Resources</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-[#1f1f1f] hover:bg-[#262626] rounded-md transition-all duration-300 border border-[rgba(255,255,255,0.1)] group">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#d4d4d4]" />
                      <span className="text-[#d4d4d4] group-hover:text-white transition-colors">
                        Lesson Notes (PDF)
                      </span>
                    </div>
                    <Download className="h-5 w-5 text-[#737373] group-hover:text-[#d4af35] transition-colors" />
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-[#1f1f1f] hover:bg-[#262626] rounded-md transition-all duration-300 border border-[rgba(255,255,255,0.1)] group">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-[#d4d4d4]" />
                      <span className="text-[#d4d4d4] group-hover:text-white transition-colors">
                        Discussion Forum
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#737373] group-hover:text-[#d4af35] transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
