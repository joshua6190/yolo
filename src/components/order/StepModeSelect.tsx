"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Bike, ArrowRight } from "lucide-react";

interface Props {
  onSelect: (mode: "dine-in" | "delivery") => void;
}

const modes = [
  {
    id: "dine-in" as const,
    icon: UtensilsCrossed,
    label: "Dine In",
    sub: "Select your table & we'll serve you right there",
    accent: "border-luxury-gold/40 hover:border-luxury-gold",
    glow: "hover:shadow-[0_0_40px_rgba(212,175,55,0.2)]",
    iconBg: "bg-luxury-gold/10 text-luxury-gold",
    badge: "In-Venue",
  },
  {
    id: "delivery" as const,
    icon: Bike,
    label: "Delivery",
    sub: "We'll bring it fresh & hot to your doorstep",
    accent: "border-primary-red/40 hover:border-primary-red",
    glow: "hover:shadow-[0_0_40px_rgba(225,29,72,0.2)]",
    iconBg: "bg-primary-red/10 text-primary-red",
  },
];

export default function StepModeSelect({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold tracking-[0.3em] text-primary-red uppercase">
          Start Your Experience
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
          How would you like to{" "}
          <span className="text-luxury-gold italic">order?</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-5 rounded-full" />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {modes.map((mode, i) => {
          const Icon = mode.icon;
          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}
              onClick={() => onSelect(mode.id)}
              className={`group relative glass-card rounded-3xl p-8 border ${mode.accent} ${mode.glow} flex flex-col items-center gap-5 text-center cursor-pointer transition-all duration-400 hover:-translate-y-1`}
            >
              {/* Badge */}
              {mode.badge && (
                <span className="absolute top-4 right-4 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-warm-ivory/50">
                  {mode.badge}
                </span>
              )}

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${mode.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  {mode.label}
                </h3>
                <p className="text-warm-ivory/60 text-sm font-light leading-relaxed">
                  {mode.sub}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warm-ivory/40 group-hover:text-warm-ivory/80 transition-colors">
                Select <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
