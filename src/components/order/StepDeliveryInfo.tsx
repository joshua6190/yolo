"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, ArrowRight } from "lucide-react";
import type { DeliveryInfo } from "@/lib/orderTypes";

interface Props {
  onConfirm: (info: DeliveryInfo) => void;
}

export default function StepDeliveryInfo({ onConfirm }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const isFormValid = name.trim() !== "" && phone.trim() !== "" && address.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onConfirm({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-lg mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-[0.3em] text-primary-red uppercase">
            Delivery Details
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mt-3">
            Where should we send your <span className="text-luxury-gold italic">feast?</span>
          </h2>
          <p className="text-warm-ivory/50 text-sm mt-2">
            Please fill in your details for accurate and swift dispatch
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="glass-card rounded-3xl border border-white/5 p-6 space-y-5">
            {/* Customer Name */}
            <div>
              <label htmlFor="delivery-name" className="block text-[10px] font-bold uppercase tracking-[0.25em] text-luxury-gold mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name
              </label>
              <input
                id="delivery-name"
                type="text"
                value={name}
                autoFocus
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kolawole Davies"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:border-luxury-gold/60 focus:shadow-[0_0_12px_rgba(212,175,55,0.1)] transition-all duration-300 placeholder:text-warm-ivory/20"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="delivery-phone" className="block text-[10px] font-bold uppercase tracking-[0.25em] text-luxury-gold mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone Number
              </label>
              <input
                id="delivery-phone"
                type="tel"
                value={phone}
                autoComplete="tel"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +234 803 123 4567"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:border-luxury-gold/60 focus:shadow-[0_0_12px_rgba(212,175,55,0.1)] transition-all duration-300 placeholder:text-warm-ivory/20"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label htmlFor="delivery-address" className="block text-[10px] font-bold uppercase tracking-[0.25em] text-luxury-gold mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Delivery Address
              </label>
              <textarea
                id="delivery-address"
                rows={3}
                value={address}
                autoComplete="street-address"
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter complete address, landmark, floor/apartment number..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-base focus:outline-none focus:border-luxury-gold/60 focus:shadow-[0_0_12px_rgba(212,175,55,0.1)] transition-all duration-300 placeholder:text-warm-ivory/20 resize-none"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            animate={{ opacity: isFormValid ? 1 : 0.3 }}
            disabled={!isFormValid}
            className="w-full py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-2xl font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Proceed to Payment <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

