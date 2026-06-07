"use client";

import { MapPin, Clock, Navigation, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Location() {
  const directionsUrl = "https://www.google.com/maps/search/?api=1&query=A.M+Stores+Barnawa+Kaduna+Nigeria";

  return (
    <section id="location" className="relative py-24 md:py-32 bg-deep-black z-10">
      {/* Background glow backdrops */}
      <div className="absolute top-[10%] right-[-10%] w-[350px] h-[350px] bg-primary-red/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-primary-red uppercase">
            Find Us
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
            Our Location & <span className="text-luxury-gold italic">Hours</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left: Info Cards & Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Address Card */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 flex gap-5 hover:border-primary-red/30 transition-all duration-300">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary-red/10 border border-primary-red/20 flex items-center justify-center text-primary-red">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white mb-2">Address</h3>
                <p className="text-warm-ivory/70 text-sm font-light leading-relaxed">
                  A.M Stores, After Disney Chicken,
                  <br />
                  Barnawa, Kaduna South,
                  <br />
                  Kaduna, Nigeria.
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 flex gap-5 hover:border-luxury-gold/30 transition-all duration-300 flex-grow">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                <Clock className="w-6 h-6" />
              </div>
              <div className="w-full">
                <h3 className="font-serif text-lg font-bold text-white mb-4">Opening Hours</h3>
                <div className="space-y-3 text-sm font-light">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-warm-ivory/70">Mon - Thu:</span>
                    <span className="text-white font-medium">10:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-warm-ivory/70">Fri - Sat:</span>
                    <span className="text-primary-red font-semibold">10:00 AM - 11:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-warm-ivory/70">Sunday:</span>
                    <span className="text-white font-medium">12:00 PM - 10:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Directions Button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-2xl font-bold uppercase tracking-wider text-xs shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 fill-white" /> Get Directions
            </a>
          </div>

          {/* Right: Map Placeholder / Visual (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[350px] sm:min-h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.6)] group">
              {/* Cinematic styled custom background map overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center filter grayscale contrast-125 brightness-[0.4] group-hover:scale-105 transition-transform duration-10000"
                style={{ backgroundImage: "url('/images/background 3.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-deep-black/60" />
              <div className="absolute inset-0 bg-primary-red/5 mix-blend-color" />

              {/* Map UI Element Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                {/* Glowing Geolocation Ring Marker */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-red/25 border border-primary-red/50 animate-ping absolute -inset-0" />
                  <div className="w-16 h-16 rounded-full bg-primary-red/20 flex items-center justify-center relative border border-primary-red/40 shadow-[0_0_20px_rgba(225,29,72,0.6)]">
                    <MapPin className="w-8 h-8 text-white fill-primary-red animate-bounce" />
                  </div>
                </div>

                <h4 className="font-serif text-xl sm:text-2xl font-bold text-white mb-2 text-neon-red">
                  YOLO BITES KADUNA
                </h4>
                <p className="text-xs text-luxury-gold tracking-widest uppercase font-semibold mb-6">
                  Barnawa's Premier Culinary Spot
                </p>

                {/* Simulated interactive HUD detail */}
                <div className="glass-card px-5 py-3 rounded-full border border-white/10 text-xs text-warm-ivory/80 flex items-center gap-2 max-w-sm mx-auto shadow-md">
                  <Phone className="w-3.5 h-3.5 text-primary-red" />
                  <span>Call to Navigate: 0812 345 6789</span>
                </div>
              </div>

              {/* Minimalist Grid overlay to make it look like a techy/digital map hud */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
