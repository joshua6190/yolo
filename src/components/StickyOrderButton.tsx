"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function StickyOrderButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Check initial scroll position
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 40, x: "-50%" }}
          transition={{ type: "spring", stiffness: 280, damping: 25 }}
          className="fixed bottom-6 left-1/2 z-40 w-auto"
        >
          <Link
            href="/order"
            className="flex items-center justify-center gap-2.5 px-8 py-4 bg-primary-red hover:bg-primary-red/95 text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-[0_10px_35px_rgba(225,29,72,0.5)] border border-white/10 hover:border-luxury-gold/50 transition-all duration-300 hover:scale-105 group whitespace-nowrap"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-luxury-gold"></span>
            </span>
            <ShoppingBag className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span>Order Online Now</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
