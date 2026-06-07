import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyYolo from "@/components/WhyYolo";
import FeaturedMenu from "@/components/FeaturedMenu";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import StickyOrderButton from "@/components/StickyOrderButton";

export default function Home() {
  return (
    <>
      {/* Sticky Header */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-grow bg-deep-black">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Why YOLO Bites */}
        <WhyYolo />

        {/* 3. Featured Menu */}
        <FeaturedMenu />

        {/* 4. Experience Section */}
        <Experience />

        {/* 5. About Section */}
        <About />

        {/* 6. Gallery Section */}
        <Gallery />

        {/* 7. Testimonials Section */}
        <Testimonials />

        {/* 8. Location Section */}
        <Location />
      </main>

      {/* Footer Section */}
      <Footer />

      {/* Sticky Floating CTA */}
      <StickyOrderButton />
    </>
  );
}
