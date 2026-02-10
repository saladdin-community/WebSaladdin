import Footer from "@/app/components/layout/Footer";
import HeroSection from "@/app/components/landing-page/HeroSection";
import AboutSection from "@/app/components/landing-page/AboutSection";
import CoursesSection from "@/app/components/landing-page/CoursesSection";
import MentorsSection from "@/app/components/landing-page/MentorsSections";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <AboutSection />
        <CoursesSection />
        <MentorsSection />
      </main>
      <Footer />
    </div>
  );
}
