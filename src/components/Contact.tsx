"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Instagram, MapPin, Calendar, CheckCircle2, Loader2, MessageSquare } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setStatus("submitting");

    // Simulate submission to server
    setTimeout(() => {
      setStatus("success");
    }, 1800);
  };

  const handleReset = () => {
    setFormData({ name: "", phone: "", message: "" });
    setStatus("idle");
  };

  return (
    <section id="contact" className="relative py-24 md:py-32 bg-deep-black z-10">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[30%] left-[-10%] w-[350px] h-[350px] bg-primary-red/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-luxury-gold/3 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-primary-red uppercase">
            Reservations
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
            Secure Your <span className="text-luxury-gold italic">Experience</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Contact Info Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-4">
              Get In Touch With The Crew
            </h3>
            <p className="text-warm-ivory/70 text-sm font-light leading-relaxed mb-8">
              Planning a birthday, private dinner, or casual night out with friends? 
              Fill out the form or reach out directly to secure Kaduna's finest dining experience.
            </p>

            <div className="space-y-4">
              {/* Phone info */}
              <div className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-red/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary-red/10 border border-primary-red/20 flex items-center justify-center text-primary-red">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-warm-ivory/50 block font-medium">Call Us</span>
                  <a href="tel:08123456789" className="text-white hover:text-primary-red transition-colors text-sm font-semibold">
                    0812 345 6789
                  </a>
                </div>
              </div>

              {/* Instagram info */}
              <div className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-luxury-gold/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-warm-ivory/50 block font-medium">Instagram</span>
                  <a href="https://instagram.com/yolobites.ng" target="_blank" rel="noopener noreferrer" className="text-white hover:text-luxury-gold transition-colors text-sm font-semibold">
                    @yolobites.ng
                  </a>
                </div>
              </div>

              {/* Address info */}
              <div className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-red/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary-red/10 border border-primary-red/20 flex items-center justify-center text-primary-red">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-warm-ivory/50 block font-medium">Find Us</span>
                  <span className="text-white text-xs leading-tight">
                    A.M Stores, After Disney Chicken, Barnawa, Kaduna South
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Reservation Form Container (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.6)] overflow-hidden min-h-[420px]">
              <AnimatePresence mode="wait">
                {status === "idle" && (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name input */}
                      <div className="flex flex-col gap-2" suppressHydrationWarning>
                        <label htmlFor="name" className="text-xs uppercase tracking-wider text-warm-ivory/70 font-semibold">
                          Your Name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-primary-red focus:shadow-[0_0_15px_rgba(225,29,72,0.25)] transition-all duration-300 placeholder:text-warm-ivory/30"
                        />
                      </div>

                      {/* Phone input */}
                      <div className="flex flex-col gap-2" suppressHydrationWarning>
                        <label htmlFor="phone" className="text-xs uppercase tracking-wider text-warm-ivory/70 font-semibold">
                          Phone Number *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 0812 345 6789"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-primary-red focus:shadow-[0_0_15px_rgba(225,29,72,0.25)] transition-all duration-300 placeholder:text-warm-ivory/30"
                        />
                      </div>
                    </div>

                    {/* Message input */}
                    <div className="flex flex-col gap-2" suppressHydrationWarning>
                      <label htmlFor="message" className="text-xs uppercase tracking-wider text-warm-ivory/70 font-semibold">
                        Reservation Request & Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Let us know date, time, group size, or menu preferences..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-primary-red focus:shadow-[0_0_15px_rgba(225,29,72,0.25)] transition-all duration-300 placeholder:text-warm-ivory/30 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-2xl font-bold uppercase tracking-wider text-xs shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-white" /> Reserve a Table
                    </button>
                  </motion.form>
                )}

                {status === "submitting" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                  >
                    <Loader2 className="w-12 h-12 text-primary-red animate-spin mb-4" />
                    <h4 className="font-serif text-lg font-bold text-white mb-2">
                      Sending Reservation Request
                    </h4>
                    <p className="text-xs text-warm-ivory/50 uppercase tracking-widest font-semibold">
                      Securing your table...
                    </p>
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  >
                    {/* Animated confetti-like shapes */}
                    <div className="absolute top-[10%] left-[10%] w-2 h-2 rounded-full bg-luxury-gold animate-bounce" />
                    <div className="absolute top-[20%] right-[15%] w-2 h-2 rounded-full bg-primary-red animate-bounce" />
                    <div className="absolute bottom-[15%] left-[25%] w-2 h-2 rounded-full bg-primary-red animate-bounce" />

                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                    </div>

                    <h4 className="font-serif text-2xl font-bold text-white mb-3 text-neon-gold">
                      Thank You, {formData.name}!
                    </h4>
                    <p className="text-warm-ivory/80 text-sm font-light leading-relaxed max-w-md mb-8">
                      Your table reservation request at Barnawa has been successfully received. We will contact you at <strong className="text-white font-semibold">{formData.phone}</strong> shortly to confirm your table details.
                    </p>

                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-warm-ivory border border-white/10 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                    >
                      Book Another Table
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
