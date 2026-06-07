"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart, Wine } from "lucide-react";

export default function Experience() {
  const handleScrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="experience"
      className="relative py-24 md:py-36 overflow-hidden bg-deep-black z-10"
    >
      {/* Background Image Parallax Overlay */}
      <div className="absolute inset-0 z-0 opacity-25">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center"
          style={{ backgroundImage: "url('/images/background 2.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/80 to-deep-black" />
      </div>

      {/* Decorative glows */}
      <div className="absolute bottom-[-10%] right-[10%] w-[300px] h-[300px] bg-primary-red/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Side: Cinematic Images Collage */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[3/4] w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
              <img
                src="/images/background 2.png"
                alt="YOLO BITES Dining Vibe"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 via-deep-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
                <span className="text-luxury-gold text-xs font-semibold tracking-[0.25em] uppercase mb-2">
                  Kaduna's New Standard
                </span>
                <p className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                  "It’s not just dinner. It's a memory in the making."
                </p>
              </div>
            </div>

            {/* Floating micro accent */}
            <div className="absolute -top-6 -right-6 bg-primary-red text-white p-6 rounded-2xl shadow-[0_10px_25px_rgba(225,29,72,0.4)] hidden sm:block border border-white/10">
              <Wine className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          {/* Right Side: Experience Storytelling */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">
            <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-primary-red uppercase">
              The Art of Living
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3 leading-tight">
              An Experience You <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold to-amber-200 italic font-serif">
                Won’t Forget
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mt-6 mb-8 rounded-full" />

            <div className="space-y-6">
              {/* Highlight 1: Food Quality */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-red/10 border border-primary-red/20 flex items-center justify-center text-primary-red">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">
                    Gourmet Masterpieces
                  </h4>
                  <p className="text-warm-ivory/70 text-sm font-light leading-relaxed">
                    We redefine taste by combining locally sourced organic ingredients with premium global flavours. Every single plate is designed to wow your senses.
                  </p>
                </div>
              </div>

              {/* Highlight 2: Ambience */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                  <Wine className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">
                    Cinematic Ambience
                  </h4>
                  <p className="text-warm-ivory/70 text-sm font-light leading-relaxed">
                    Step into luxury. Cozy, moody glass design features combined with modern crimson neon overlays create a vibrant and warm visual layout perfect for dinner dates or casual hangouts.
                  </p>
                </div>
              </div>

              {/* Highlight 3: Social Experience */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-red/10 border border-primary-red/20 flex items-center justify-center text-primary-red">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">
                    Kaduna's Hotspot for Connection
                  </h4>
                  <p className="text-warm-ivory/70 text-sm font-light leading-relaxed">
                    More than a restaurant—YOLO BITES is a social hub. Celebrate milestones, enjoy great laughs, and snap pictures against our premium interior displays.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={() => handleScrollTo("#location")}
                className="px-8 py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-full font-bold uppercase tracking-wider text-sm shadow-[0_4px_25px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Visit Us Today <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
