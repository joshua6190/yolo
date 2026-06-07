"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Table {
  id: number;
  occupied: boolean;
}

interface Props {
  onConfirm: (tableNumber: number) => void;
}

export default function StepTableSelect({ onConfirm }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [localTables, setLocalTables] = useState<Table[]>([]);

  useEffect(() => {
    let count = 6;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("yolo_tables_count");
      if (stored) {
        const parsed = parseInt(stored);
        if (!isNaN(parsed) && parsed > 0) {
          count = parsed;
        }
      }
    }
    const list = Array.from({ length: count }, (_, i) => ({ id: i + 1, occupied: false }));
    setLocalTables(list);

    // Fetch live settings from Supabase
    const fetchLiveSettings = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("yolo_categories")
          .select("*")
          .eq("id", "system_settings");
        
        if (data && data.length > 0 && !error) {
          const settings = JSON.parse(data[0].label);
          if (settings && typeof settings.tablesCount === "number" && settings.tablesCount > 0) {
            const newList = Array.from({ length: settings.tablesCount }, (_, i) => ({ id: i + 1, occupied: false }));
            setLocalTables(newList);
            localStorage.setItem("yolo_tables_count", String(settings.tablesCount));
          }
        }
      } catch (err) {
        console.error("Failed to load live table settings:", err);
      }
    };

    fetchLiveSettings();
  }, []);

  return (
    <div className="flex flex-col items-center w-full px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="text-xs font-semibold tracking-[0.3em] text-luxury-gold uppercase">
          In-Venue Dining
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
          Choose Your <span className="text-luxury-gold italic">Table</span>
        </h2>
        <p className="text-warm-ivory/50 text-sm mt-3">
          Each table seats up to 4 guests
        </p>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 justify-center mb-10 text-xs font-semibold tracking-wide text-warm-ivory/60">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border-2 border-luxury-gold bg-luxury-gold/10" />
          Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary-red/40 border-2 border-primary-red/30" />
          Occupied
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-white ring-2 ring-white ring-offset-1 ring-offset-deep-black" />
          Selected
        </span>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-3 gap-5 w-full max-w-sm">
        {localTables.map((table, i) => {
          const isSelected = selected === table.id;
          const isOccupied = table.occupied;

          return (
            <motion.button
              key={table.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              disabled={isOccupied}
              onClick={() => setSelected(table.id)}
              className={`
                relative aspect-square rounded-3xl flex flex-col items-center justify-center gap-1.5
                border-2 transition-all duration-300 font-bold text-2xl
                ${isOccupied
                  ? "border-primary-red/20 bg-primary-red/5 text-primary-red/30 cursor-not-allowed"
                  : isSelected
                  ? "border-white bg-white/15 text-white shadow-[0_0_24px_rgba(255,255,255,0.25)] scale-110"
                  : "border-luxury-gold/40 bg-luxury-gold/5 text-luxury-gold hover:border-luxury-gold hover:bg-luxury-gold/10 cursor-pointer hover:scale-105"
                }
              `}
            >
              <span className="font-serif leading-none">{table.id}</span>
              <span className="flex items-center gap-1 text-[10px] font-semibold opacity-60">
                <Users className="w-3 h-3" /> 1–4
              </span>
              {/* Occupied dot */}
              {isOccupied && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-primary-red border-2 border-deep-black" />
              )}
              {/* Selected ring pulse */}
              {isSelected && (
                <span className="absolute inset-0 rounded-3xl ring-2 ring-white/40 animate-ping" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Confirm */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selected ? 1 : 0.35 }}
        className="mt-12 w-full max-w-xs"
      >
        <button
          disabled={!selected}
          onClick={() => selected && onConfirm(selected)}
          className="w-full py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-2xl font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {selected ? `Confirm Table ${selected}` : "Select a Table"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
