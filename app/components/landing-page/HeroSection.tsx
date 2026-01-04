"use client";

import { Play, ChevronRight, Users, BookOpen, Star, Award } from "lucide-react";

// Interface untuk props background image
interface HeroSectionProps {
  backgroundImage?: string;
  title?: string;
  description?: string;
  stats?: Array<{
    icon: React.ElementType;
    value: string;
    label: string;
  }>;
}

export default function HeroSection({
  backgroundImage = "/images/masjidil-aqsa-background.png",
  title = "Rediscover the Legacy of Salahuddin",
  description = "Explore Palestine through history, knowledge, and conscience. Join a learning community dedicated to Baiful Moqdis, ethics, and responsible leadership.",
  stats = [
    { icon: Users, value: "50+", label: "Expert Mentors" },
    { icon: BookOpen, value: "100+", label: "Premium Courses" },
    { icon: Award, value: "12k+", label: "Students Enrolled" },
    { icon: Star, value: "4.9", label: "Average Rating" },
  ],
}: HeroSectionProps) {
  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(18, 18, 18, 0.95) 0%,
            rgba(18, 18, 18, 0.85) 50%,
            rgba(18, 18, 18, 0.95) 100%
          ),
          url('${backgroundImage}')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : {};

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={backgroundStyle}
    >
      {/* Gradient Overlay untuk depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gold/5 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="container-custom relative z-10 py-20">
        <div className="mx-auto max-w-5xl">
          {/* Title & Description */}
          <div className="mb-16 text-center animate-fade-in">
            <h1 className="mb-6 text-4xl leading-tight md:text-6xl lg:text-7xl">
              {title.split(" ").map((word, index, array) =>
                word === "Salahuddin" ? (
                  <span key={index} className="text-gradient-gold">
                    {word}{" "}
                  </span>
                ) : (
                  <span key={index} className="text-white">
                    {word}{" "}
                  </span>
                )
              )}
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-lg md:text-xl text-neutral-300">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="btn btn-primary flex items-center gap-2 px-8 py-3 text-lg animate-glow">
                Browse Courses
                <ChevronRight className="h-5 w-5" />
              </button>
              <button className="btn btn-outline flex items-center gap-2 px-8 py-3 text-lg">
                <Play className="h-5 w-5" />
                Watch Trailer
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="animate-slide-up">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="card text-center transition-all duration-500 hover:scale-105"
                  >
                    <Icon className="mx-auto mb-3 h-8 w-8 text-gold" />
                    <div className="text-3xl font-bold text-gold">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-sm text-neutral-400">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-xs text-neutral-400 mb-2">
            Scroll to explore
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-gold to-transparent"></div>
        </div>
      </div>
    </section>
  );
}

/*
PANDUAN PENGGUNAAN DI CMS:

1. Cara menggunakan di page.tsx:
   <HeroSection 
     backgroundImage="/images/custom-background.jpg"  // Ganti path ini
     title="Custom Title Here"
     description="Custom description here"
   />

2. Untuk CMS, buat form dengan field:
   - backgroundImage (text input untuk URL gambar)
   - title (text input)
   - description (textarea)
   - stats (array of objects: value, label, icon)

3. Contoh data dari CMS:
   {
     "backgroundImage": "https://cdn.example.com/hero-image.jpg",
     "title": "Custom Hero Title",
     "description": "Custom hero description from CMS",
     "stats": [
       { "value": "100+", "label": "Expert Mentors", "icon": "Users" },
       { "value": "200+", "label": "Courses", "icon": "BookOpen" }
     ]
   }

4. Icon yang tersedia dari lucide-react:
   - Users, BookOpen, Star, Award, GraduationCap, etc.
*/
