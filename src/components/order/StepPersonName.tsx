"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, ArrowRight } from "lucide-react";

interface Props {
  personIndex: number;
  personCount: number;
  tableNumber: number;
  onConfirm: (name: string) => void;
}

export default function StepPersonName({ personIndex, personCount, tableNumber, onConfirm }: Props) {
  const [name, setName] = useState("");

  const ordinal = ["1st", "2nd", "3rd", "4th"][personIndex] ?? `${personIndex + 1}th`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] w-full max-w-md mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {/* Avatar circle */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-luxury-gold/10 border-2 border-luxury-gold/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              <User className="w-9 h-9 text-luxury-gold" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-red text-white text-xs font-bold flex items-center justify-center border-2 border-deep-black">
              {personIndex + 1}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-[0.3em] text-luxury-gold uppercase">
            Table {tableNumber} · Person {personIndex + 1} of {personCount}
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mt-3">
            Who's the{" "}
            <span className="text-luxury-gold italic">{ordinal} person?</span>
          </h2>
          <p className="text-warm-ivory/50 text-sm mt-2">
            Enter your name so our staff knows your order
          </p>
        </div>

        {/* Name Input */}
        <div className="glass-card rounded-3xl border border-white/5 p-6 mb-6" suppressHydrationWarning>
          <label htmlFor="person-name" className="block text-[10px] font-bold uppercase tracking-[0.25em] text-luxury-gold mb-3">
            Your Name
          </label>
          <input
            id="person-name"
            type="text"
            value={name}
            autoFocus
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && onConfirm(name.trim())}
            placeholder="e.g. Amara, Usman, Fatima…"
            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-lg focus:outline-none focus:border-luxury-gold/60 focus:shadow-[0_0_16px_rgba(212,175,55,0.15)] transition-all duration-300 placeholder:text-warm-ivory/20"
          />
        </div>

        <motion.button
          animate={{ opacity: name.trim() ? 1 : 0.3 }}
          disabled={!name.trim()}
          onClick={() => name.trim() && onConfirm(name.trim())}
          className="w-full py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-2xl font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Start Ordering <ArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
}
