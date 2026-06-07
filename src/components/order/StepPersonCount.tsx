"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";

interface Props {
  tableNumber: number;
  onConfirm: (count: number) => void;
}

const counts = [1, 2, 3, 4];

export default function StepPersonCount({ tableNumber, onConfirm }: Props) {
  const [customCount, setCustomCount] = useState<string>("");

  const handleCustomConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customCount);
    if (!isNaN(parsed) && parsed > 0) {
      onConfirm(parsed);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="text-xs font-semibold tracking-[0.3em] text-luxury-gold uppercase">
          Table {tableNumber}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
          How many are <span className="text-luxury-gold italic">dining?</span>
        </h2>
        <p className="text-warm-ivory/50 text-sm mt-3 max-w-xs mx-auto">
          Each person will build their own order separately
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-4 rounded-full" />
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {counts.map((count, i) => (
          <motion.button
            key={count}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => onConfirm(count)}
            className="group relative glass-card rounded-3xl p-8 border border-luxury-gold/20 hover:border-luxury-gold/60 hover:bg-luxury-gold/5 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-300 hover:-translate-y-1 flex flex-col items-center gap-3 cursor-pointer"
          >
            <div className="flex items-end gap-1">
              {Array.from({ length: count }).map((_, j) => (
                <Users
                  key={j}
                  className={`text-luxury-gold transition-all duration-300 group-hover:scale-110 ${
                    j === 0 ? "w-7 h-7" : "w-5 h-5 mb-0.5 opacity-70"
                  }`}
                />
              ))}
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl font-bold text-white">{count}</p>
              <p className="text-xs text-warm-ivory/50 uppercase tracking-wider mt-0.5">
                {count === 1 ? "Person" : "People"}
              </p>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-luxury-gold/40 group-hover:text-luxury-gold/70 uppercase tracking-wider transition-colors">
              Select <ArrowRight className="w-3 h-3" />
            </span>
          </motion.button>
        ))}
      </div>

      {/* Custom count input */}
      <div className="mt-8 w-full max-w-sm flex flex-col items-center">
        <div className="w-full h-px bg-white/5 mb-6" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-warm-ivory/40 font-bold block mb-3">
          Or Enter Custom Guest Count
        </span>
        <form onSubmit={handleCustomConfirm} className="flex gap-3 w-full">
          <input
            type="number"
            min="1"
            max="50"
            value={customCount}
            onChange={(e) => setCustomCount(e.target.value)}
            placeholder="e.g. 5, 6, 8..."
            className="flex-1 px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-warm-ivory/20 text-sm focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition duration-300"
          />
          <button
            type="submit"
            disabled={!customCount || parseInt(customCount) <= 0}
            className="px-6 py-3 rounded-2xl bg-luxury-gold hover:bg-luxury-gold/90 text-deep-black font-bold uppercase tracking-wider text-xs transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            Confirm
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
