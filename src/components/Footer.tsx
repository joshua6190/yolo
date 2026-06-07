"use client";

import { Instagram, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#080808] border-t border-white/5 pt-20 pb-10 overflow-hidden z-10">
      {/* Footer subtle glow backdrop */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary-red/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/5">
          {/* Col 1: Brand & Socials (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-luxury-gold shadow-sm">
                <img
                  src="/images/logo.jpeg"
                  alt="YOLO BITES Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-lg font-bold tracking-widest text-white">
                YOLO BITES
              </span>
            </div>
            <p className="text-warm-ivory/60 text-sm font-light leading-relaxed">
              Kaduna's newest premium food destination. Experience the perfect blend of luxury, 
              vibrant energy, and curated flavors. You Only Live Once. Make It Delicious.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com/yolobites.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-warm-ivory hover:text-primary-red hover:border-primary-red/50 hover:bg-primary-red/5 transition-all duration-300"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-warm-ivory hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300"
                aria-label="WhatsApp Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-serif text-sm font-bold tracking-wider text-white uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-3 text-sm font-light text-warm-ivory/70">
              <li>
                <a href="#home" onClick={(e) => handleScrollTo(e, "#home")} className="hover:text-primary-red transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleScrollTo(e, "#about")} className="hover:text-primary-red transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#menu" onClick={(e) => handleScrollTo(e, "#menu")} className="hover:text-primary-red transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="#gallery" onClick={(e) => handleScrollTo(e, "#gallery")} className="hover:text-primary-red transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#location" onClick={(e) => handleScrollTo(e, "#location")} className="hover:text-primary-red transition-colors">
                  Location & Hours
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleScrollTo(e, "#contact")} className="hover:text-primary-red transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Address / Directs (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="font-serif text-sm font-bold tracking-wider text-white uppercase">
              Location details
            </h4>
            <div className="space-y-4 text-sm font-light text-warm-ivory/70">
              <div className="flex gap-3 items-start">
                <MapPin className="w-4 h-4 text-primary-red shrink-0 mt-0.5" />
                <span>
                  A.M Stores, After Disney Chicken,
                  <br />
                  Barnawa, Kaduna South, Kaduna
                </span>
              </div>
              <div className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-luxury-gold shrink-0" />
                <a href="tel:08123456789" className="hover:text-primary-red transition-colors">
                  0812 345 6789
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <Send className="w-4 h-4 text-primary-red shrink-0" />
                <span>yolobites.ng@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-10 text-xs text-warm-ivory/40 font-light">
          <span suppressHydrationWarning>
            © {currentYear} YOLO BITES. All Rights Reserved.
          </span>
          <span className="tracking-[0.2em] uppercase text-[10px] text-luxury-gold font-medium">
            Taste It. Love It. Live It.
          </span>
        </div>
      </div>
    </footer>
  );
}
