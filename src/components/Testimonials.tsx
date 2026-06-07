"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  text: string;
  name: string;
  role: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "The ambience is incredible. The food tastes even better than it looks. Finally, a place in Kaduna that gets the vibes and culinary quality 100% right.",
    name: "Hadiza Bello",
    role: "Gourmet Critic & Lifestyle Blogger",
    rating: 5,
  },
  {
    id: 2,
    text: "Finally, a dining spot in Kaduna that feels modern and premium. The mocktails are absolutely divine, and the cozy glass environment is perfect for photos.",
    name: "Nehemiah Daniel",
    role: "Digital Creator",
    rating: 5,
  },
  {
    id: 3,
    text: "The wood-fired Truffle Pizza has this perfect crispy, airy crust that is hard to find anywhere else. The service is incredibly fast and exceptionally premium.",
    name: "Farouk Usman",
    role: "Kaduna Resident",
    rating: 5,
  },
  {
    id: 4,
    text: "YOLO BITES has captured the perfect blend of luxury, youthfulness, and flavor. A fantastic social hub to grab chops and parfaits while networking.",
    name: "Amara Okoye",
    role: "Business Executive",
    rating: 5,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Auto scroll testimonials every 6 seconds
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="relative py-24 md:py-32 bg-deep-black z-10 overflow-hidden">
      {/* Light effect background glows */}
      <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-primary-red/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[300px] h-[300px] bg-luxury-gold/3 rounded-full blur-[100px] -z-10" />

      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-primary-red uppercase">
            Guest Diaries
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
            What Our <span className="text-luxury-gold italic">Guests Say</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-4 rounded-full" />
        </div>

        {/* Testimonial Card Slider */}
        <div className="relative">
          <div className="absolute top-0 left-0 text-white/5 pointer-events-none select-none">
            <Quote className="w-24 h-24 sm:w-36 sm:h-36 -translate-x-6 -translate-y-12" />
          </div>

          <div className="min-h-[280px] sm:min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full glass-card p-8 md:p-12 rounded-3xl border border-white/5 relative z-10 shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6 justify-center sm:justify-start">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-luxury-gold text-luxury-gold shadow-sm" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-serif text-lg sm:text-2xl text-warm-ivory leading-relaxed text-center sm:text-left italic font-light mb-8">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* User Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/5">
                  <div className="text-center sm:text-left">
                    <h4 className="font-serif text-lg font-bold text-white tracking-wide">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-xs text-luxury-gold tracking-widest uppercase font-medium mt-1">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>

                  {/* Dots Indicator */}
                  <div className="flex gap-2 justify-center sm:justify-end">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          currentIndex === i ? "w-6 bg-primary-red" : "bg-white/20"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Controls */}
          <div className="flex justify-center sm:justify-end gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 rounded-full bg-white/5 hover:bg-primary-red text-warm-ivory border border-white/10 hover:border-primary-red/50 transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-3 rounded-full bg-white/5 hover:bg-primary-red text-warm-ivory border border-white/10 hover:border-primary-red/50 transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
