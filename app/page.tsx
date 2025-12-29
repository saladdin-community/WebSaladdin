// app/page.tsx
import Header from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";
import Features from "@/components/landing-page/urgency";
import Testimonials from "@/components/landing-page/testimonials";
import CTA from "@/components/landing-page/contact-us";
import Footer from "@/components/landing-page/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
