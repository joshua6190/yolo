"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Banknote, CreditCard, Smartphone, CheckCircle2, ArrowRight, Copy, Check, MapPin, User, Phone } from "lucide-react";
import { formatPrice } from "@/lib/menuData";
import type { PersonOrder, CartItem, DeliveryInfo } from "@/lib/orderTypes";
import { createClient } from "@/utils/supabase/client";

type PaymentMethod = "cash" | "transfer" | "card";

interface Props {
  // Dine-in
  tableNumber?: number | null;
  persons?: PersonOrder[];
  // Delivery
  deliveryCart?: CartItem[];
  deliveryInfo?: DeliveryInfo | null;
  mode: "dine-in" | "delivery";
  onConfirm: (method: PaymentMethod) => void;
}

const methods = [
  {
    id: "cash" as const,
    icon: Banknote,
    label: "Cash",
    desc: "Pay our staff directly",
    color: "border-emerald-500/30 hover:border-emerald-500/70 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    activeBg: "border-emerald-500 bg-emerald-500/10",
  },
  {
    id: "transfer" as const,
    icon: Smartphone,
    label: "Bank Transfer",
    desc: "Transfer to our account — we'll confirm",
    color: "border-blue-400/30 hover:border-blue-400/70 hover:shadow-[0_0_25px_rgba(96,165,250,0.15)]",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
    activeBg: "border-blue-400 bg-blue-400/10",
  },
  {
    id: "card" as const,
    icon: CreditCard,
    label: "Card Payment",
    desc: "Swipe or tap on our POS terminal",
    color: "border-luxury-gold/30 hover:border-luxury-gold/70 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]",
    iconColor: "text-luxury-gold",
    iconBg: "bg-luxury-gold/10",
    activeBg: "border-luxury-gold bg-luxury-gold/10",
  },
];

export default function StepPayment({ tableNumber, persons = [], deliveryCart = [], deliveryInfo, mode, onConfirm }: Props) {
  const [selected, setSelected] = useState<PaymentMethod | null>(
    mode === "delivery" ? "transfer" : null
  );
  const [copied, setCopied] = useState(false);
  const [taxRate, setTaxRate] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("yolo_tax_rate");
      if (stored) {
        const parsed = parseFloat(stored);
        if (!isNaN(parsed)) setTaxRate(parsed);
      }
    }
    const fetchLiveSettings = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("yolo_categories")
          .select("*")
          .eq("id", "system_settings");
        
        if (data && data.length > 0 && !error) {
          const settings = JSON.parse(data[0].label);
          if (settings && typeof settings.taxRate === "number") {
            setTaxRate(settings.taxRate);
          }
        }
      } catch (err) {
        console.error("Failed to load tax rate in StepPayment:", err);
      }
    };
    fetchLiveSettings();
  }, []);

  // Grand total
  const allItems =
    mode === "dine-in"
      ? persons.flatMap((p) => p.cart)
      : deliveryCart;

  const subtotal = allItems.reduce((s, c) => s + c.price * c.quantity, 0);
  const activeTaxRate = mode === "delivery" ? taxRate : 0;
  const taxAmount = parseFloat((subtotal * (activeTaxRate / 100)).toFixed(2));
  const grandTotal = subtotal + taxAmount;
  const totalItemCount = allItems.reduce((s, c) => s + c.quantity, 0);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText("5274609660");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="text-xs font-semibold tracking-[0.3em] text-primary-red uppercase">
          Almost There
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
          How will you <span className="text-luxury-gold italic">pay?</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* Delivery Info Summary */}
      {mode === "delivery" && deliveryInfo && (
        <div className="glass-card rounded-3xl border border-white/5 p-6 mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-red mb-3">
            Delivery Details
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-white font-medium">
              <User className="w-4 h-4 text-luxury-gold shrink-0" />
              <span>{deliveryInfo.name}</span>
            </div>
            <div className="flex items-center gap-2 text-warm-ivory/70">
              <Phone className="w-4 h-4 text-luxury-gold shrink-0" />
              <span>{deliveryInfo.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-warm-ivory/70">
              <MapPin className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
              <span>{deliveryInfo.address}</span>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="glass-card rounded-3xl border border-white/5 p-6 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold mb-4">
          {mode === "dine-in" ? `Table ${tableNumber} · Order Summary` : "Delivery Order Summary"}
        </p>

        {mode === "dine-in" && persons.length > 0 ? (
          <div className="space-y-4">
            {persons.map((person, i) => {
              const personTotal = person.cart.reduce((s, c) => s + c.price * c.quantity, 0);
              return (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-white">{person.name}</p>
                    <p className="text-xs text-warm-ivory/40 mt-0.5">
                      {person.cart.reduce((s, c) => s + c.quantity, 0)} item
                      {person.cart.reduce((s, c) => s + c.quantity, 0) > 1 ? "s" : ""}
                      {" · "}
                      {person.cart.map((c) => c.name).join(", ").substring(0, 30)}
                      {person.cart.map((c) => c.name).join(", ").length > 30 ? "…" : ""}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-luxury-gold shrink-0 ml-4">
                    {formatPrice(personTotal)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-between py-2">
            <p className="text-sm text-warm-ivory/70">{totalItemCount} items</p>
            <span className="text-sm font-bold text-luxury-gold">{formatPrice(subtotal)}</span>
          </div>
        )}

        {activeTaxRate > 0 && (
          <>
            <div className="flex items-center justify-between py-2 border-t border-white/5 mt-3 pt-3 text-xs text-warm-ivory/60">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs text-warm-ivory/60 font-mono">
              <span>VAT / Tax ({activeTaxRate}%)</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10">
          <span className="font-bold text-base text-white">Total</span>
          <span className="font-serif font-bold text-xl text-luxury-gold text-neon-gold">
            {formatPrice(grandTotal)}
          </span>
        </div>
      </div>

      {/* Payment Methods */}
      {mode === "dine-in" && (
        <div className="space-y-3 mb-6">
          {methods.map((method, i) => {
            const Icon = method.icon;
            const isActive = selected === method.id;
            return (
              <motion.button
                key={method.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(method.id)}
                className={`w-full glass-card rounded-2xl p-5 border-2 flex items-center gap-4 transition-all duration-300 cursor-pointer text-left ${
                  isActive ? method.activeBg : `border-white/5 ${method.color}`
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl ${method.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                  <Icon className={`w-6 h-6 ${method.iconColor}`} />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-white text-sm">{method.label}</p>
                  <p className="text-xs text-warm-ivory/50 mt-0.5">{method.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isActive ? "border-white bg-white" : "border-white/20"
                }`}>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-deep-black" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Bank Details Area (Visible when transfer is selected) */}
      {selected === "transfer" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-card border border-blue-500/30 rounded-3xl p-6 mb-6 space-y-4 bg-blue-500/[0.02] overflow-hidden"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Transfer Account Details</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
              <span className="text-[10px] text-warm-ivory/40 uppercase tracking-wider block mb-1">Bank Name</span>
              <span className="text-white font-medium">Moniepoint</span>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
              <span className="text-[10px] text-warm-ivory/40 uppercase tracking-wider block mb-1">Account Name</span>
              <span className="text-white font-medium">YOLO BITES LIMITED</span>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-warm-ivory/40 uppercase tracking-wider block mb-1">Account Number</span>
              <span className="text-white font-serif text-lg font-bold tracking-wider">5274609660</span>
            </div>
            <button
              onClick={handleCopyAccount}
              className="px-3.5 py-2 rounded-lg bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 hover:text-white border border-blue-400/20 transition-all duration-300 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-warm-ivory/40 leading-relaxed text-center italic">
            Please make the transfer and click "I Have Made Transfer" below to complete your order.
          </p>
        </motion.div>
      )}

      {/* Confirm Button */}
      <motion.button
        animate={{ opacity: selected ? 1 : 0.35 }}
        disabled={!selected}
        onClick={() => selected && onConfirm(selected)}
        className="w-full py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-2xl font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {selected === "transfer" ? (
          <>I Have Made Transfer <ArrowRight className="w-4 h-4" /></>
        ) : (
          <>Confirm & Place Order <ArrowRight className="w-4 h-4" /></>
        )}
      </motion.button>
    </div>
  );
}
