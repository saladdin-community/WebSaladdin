import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/landing-page/HeroSection";
import AboutSection from "./components/landing-page/AboutSection";
import CoursesSection from "./components/landing-page/CoursesSection";
import MentorsSection from "./components/landing-page/MentorsSections";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
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
