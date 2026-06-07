"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Menu", href: "#menu" },
  { name: "Gallery", href: "#gallery" },
  { name: "Location", href: "#location" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-nav py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, "#home")}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(225,29,72,0.5)]">
              <img
                src="/images/logo.jpeg"
                alt="YOLO BITES Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-widest text-white group-hover:text-primary-red transition-colors duration-300">
                YOLO BITES
              </span>
              <span className="text-[10px] tracking-[0.25em] text-luxury-gold uppercase">
                Taste it. Love it.
              </span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="relative text-sm font-medium tracking-wide text-warm-ivory/80 hover:text-white transition-colors duration-300 group py-2"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary-red transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs font-semibold uppercase tracking-wider text-warm-ivory/60 hover:text-white transition-colors duration-300 py-2.5 px-4 border border-white/10 rounded-full hover:border-white/30"
            >
              Admin
            </Link>
            <Link
              href="/order"
              className="relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium tracking-wider text-luxury-gold bg-transparent border border-luxury-gold/50 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] group transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2 text-xs font-semibold uppercase transition-colors duration-300 group-hover:text-white">
                Order Now <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-red to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-warm-ivory hover:text-primary-red p-2 transition-colors duration-300 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-deep-black/98 backdrop-blur-xl flex flex-col justify-center px-8 md:px-16 lg:hidden"
          >
            {/* Background glowing decorations */}
            <div className="absolute top-[20%] right-[10%] w-72 h-72 rounded-full bg-primary-red/10 blur-[80px] -z-10" />
            <div className="absolute bottom-[20%] left-[10%] w-72 h-72 rounded-full bg-luxury-gold/5 blur-[80px] -z-10" />

            <div className="flex flex-col gap-6 text-left max-w-md">
              <span className="text-[11px] tracking-[0.3em] text-luxury-gold uppercase font-semibold">
                Menu Navigation
              </span>
              <div className="h-[1px] w-full bg-white/10" />
              <div className="flex flex-col gap-6">
                {navLinks.map((link, index) => (
                  <motion.a
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="font-serif text-3xl font-bold text-warm-ivory hover:text-primary-red transition-all duration-300 tracking-wide"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-3xl font-bold text-warm-ivory/60 hover:text-white transition-all duration-300 tracking-wide"
                  >
                    Admin Panel
                  </Link>
                </motion.div>
              </div>
              <div className="h-[1px] w-full bg-white/10 mt-4" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4"
              >
                <Link
                  href="/order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-8 py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-full font-semibold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all duration-300"
                >
                  Order Now <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
