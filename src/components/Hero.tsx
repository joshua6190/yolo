"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";

const floatingFoods = [
  {
    name: "Burger",
    img: "/images/burger.jpeg",
    style: "top-[2%] right-[12%] w-24 h-24 lg:w-28 lg:h-28 animate-float-slow",
    border: "border-luxury-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]",
  },
  {
    name: "Pizza",
    img: "/images/yolo_pizza.png",
    style: "bottom-[5%] left-[10%] w-28 h-28 lg:w-32 lg:h-32 animate-float-medium",
    border: "border-primary-red shadow-[0_0_20px_rgba(225,29,72,0.4)]",
  },
  {
    name: "Shawarma",
    img: "/images/sharwama.jpeg",
    style: "bottom-[8%] right-[10%] w-24 h-24 lg:w-28 lg:h-28 animate-float-fast",
    border: "border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.35)]",
  },
  {
    name: "Mocktails",
    img: "/images/cocktails.jpeg",
    style: "top-[2%] left-[12%] w-22 h-22 lg:w-26 lg:h-26 animate-float-fast",
    border: "border-primary-red shadow-[0_0_15px_rgba(225,29,72,0.35)]",
  },
  {
    name: "Pastries",
    img: "/images/yolo_pastries.png",
    style: "top-[40%] right-[0%] w-22 h-22 lg:w-26 lg:h-26 animate-float-medium",
    border: "border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]",
  },
  {
    name: "Parfaits",
    img: "/images/yolo_parfaits.png",
    style: "top-[40%] left-[0%] w-22 h-22 lg:w-26 lg:h-26 animate-float-slow",
    border: "border-primary-red shadow-[0_0_20px_rgba(225,29,72,0.35)]",
  },
];

export default function Hero() {
  const handleScrollTo = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-deep-black"
    >
      {/* Background image container with dark overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-10000"
          style={{ backgroundImage: "url('/images/background.png')" }}
        />
        {/* Luxury red & dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/90 to-deep-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-black via-deep-black/75 to-transparent" />
        {/* Animated Light Leak effect */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary-red/10 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-8000" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-6000" />
      </div>

      {/* Main Content Container with Side-by-Side layout */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full pt-32 pb-20 flex items-center min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
            >
              You Only <span className="text-primary-red text-neon-red">Live Once</span>.
              <br />
              Make It <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-amber-200 to-luxury-gold">Delicious</span>.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-base sm:text-xl text-warm-ivory/80 leading-relaxed font-light max-w-2xl"
            >
              Discover the perfect blend of flavour, comfort, and unforgettable moments 
              at Kaduna’s newest premium food destination. Experience hospitality redefined.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center"
            >
              <Link
                href="/order"
                className="px-8 py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-full font-bold uppercase tracking-wider text-sm shadow-[0_4px_25px_rgba(225,29,72,0.4)] hover:shadow-[0_4px_30px_rgba(225,29,72,0.55)] transition-all duration-300 hover:scale-105 text-center"
              >
                Order Now
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Floating Showcase Container (Only visible on lg screens to keep design clean) */}
          <div className="lg:col-span-5 relative h-[500px] w-full hidden lg:block">
            {/* Ambient Background Glow behind centerpiece */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary-red/10 blur-[60px]" />

            {/* Centerpiece: Glowing Brand Emblem */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-4 border-luxury-gold/80 shadow-[0_0_30px_rgba(212,175,55,0.4)] overflow-hidden bg-deep-black/60 p-1 flex items-center justify-center animate-pulse z-10">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src="/images/logo.jpeg"
                  alt="YOLO BITES Center Emblem"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Orbiting Floating Foods */}
            {floatingFoods.map((food, i) => (
              <div
                key={i}
                className={`absolute rounded-full p-1 border backdrop-blur-sm bg-deep-black/30 transition-transform duration-500 hover:scale-110 pointer-events-auto cursor-pointer ${food.style} ${food.border}`}
                title={food.name}
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={food.img}
                    alt={food.name}
                    className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-125"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-300"
           onClick={() => handleScrollTo("#about")}>
        <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-medium">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="p-1 rounded-full border border-luxury-gold/30 text-luxury-gold"
        >
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </div>
    </section>
  );
}
