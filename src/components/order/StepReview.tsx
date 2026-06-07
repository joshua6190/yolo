"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Bike, MapPin, Phone, User, ChevronRight } from "lucide-react";
import { formatPrice, type MenuItem } from "@/lib/menuData";

export interface CartItem extends MenuItem {
  quantity: number;
}

interface Props {
  mode: "dine-in" | "delivery";
  tableNumber: number | null;
  cart: CartItem[];
  onConfirm: (deliveryInfo?: { name: string; phone: string; address: string }) => void;
}

export default function StepReview({ mode, tableNumber, cart, onConfirm }: Props) {
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote]       = useState("");

  const subtotal = cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const deliveryFee = mode === "delivery" ? 1000 : 0;
  const total = subtotal + deliveryFee;

  const canConfirm =
    mode === "dine-in" ||
    (name.trim() && phone.trim() && address.trim());

  const handleConfirm = () => {
    if (mode === "delivery") {
      onConfirm({ name, phone, address });
    } else {
      onConfirm();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <span className="text-xs font-semibold tracking-[0.3em] text-primary-red uppercase">
          Almost Done
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
          Review Your <span className="text-luxury-gold italic">Order</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* Order Type Banner */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 border ${
        mode === "dine-in"
          ? "border-luxury-gold/20 bg-luxury-gold/5 text-luxury-gold"
          : "border-primary-red/20 bg-primary-red/5 text-primary-red"
      }`}>
        {mode === "dine-in"
          ? <UtensilsCrossed className="w-5 h-5" />
          : <Bike className="w-5 h-5" />}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">
            {mode === "dine-in" ? `Dine In — Table ${tableNumber}` : "Delivery Order"}
          </p>
          <p className="text-xs opacity-60 mt-0.5">
            {mode === "dine-in"
              ? "Your food will be served at your table"
              : "Estimated delivery: 30–45 minutes"}
          </p>
        </div>
      </div>

      {/* Cart Items */}
      <div className="glass-card rounded-3xl border border-white/5 overflow-hidden mb-6">
        <p className="px-6 pt-5 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold border-b border-white/5">
          Your Items
        </p>
        <div className="divide-y divide-white/5">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/10"
              />
              <div className="flex-grow">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-warm-ivory/50 capitalize">{item.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-warm-ivory/50">×{item.quantity}</p>
                <p className="text-sm font-bold text-luxury-gold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-white/5 space-y-2">
          <div className="flex justify-between text-sm text-warm-ivory/60">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {mode === "delivery" && (
            <div className="flex justify-between text-sm text-warm-ivory/60">
              <span>Delivery fee</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base text-white pt-2 border-t border-white/5">
            <span>Total</span>
            <span className="text-luxury-gold text-neon-gold">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info (only for delivery) */}
      {mode === "delivery" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl border border-white/5 p-6 mb-6 space-y-4"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-red mb-2">
            Delivery Details
          </p>
          {[
            { id: "name",    label: "Your Name",    icon: User,    value: name,    set: setName,    type: "text",  placeholder: "e.g. Amara Okoye" },
            { id: "dphone",  label: "Phone Number", icon: Phone,   value: phone,   set: setPhone,   type: "tel",   placeholder: "e.g. 0812 345 6789" },
            { id: "address", label: "Address",      icon: MapPin,  value: address, set: setAddress, type: "text",  placeholder: "e.g. 12 Barnawa Close, Kaduna" },
          ].map(({ id, label, icon: Icon, value, set, type, placeholder }) => (
            <div key={id} className="flex flex-col gap-1.5" suppressHydrationWarning>
              <label htmlFor={id} className="text-[10px] uppercase tracking-wider text-warm-ivory/50 font-semibold flex items-center gap-1.5">
                <Icon className="w-3 h-3" /> {label}
              </label>
              <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-red focus:shadow-[0_0_12px_rgba(225,29,72,0.2)] transition-all duration-300 placeholder:text-warm-ivory/20"
              />
            </div>
          ))}
        </motion.div>
      )}

      {/* Special Note */}
      <div className="glass-card rounded-3xl border border-white/5 p-6 mb-8" suppressHydrationWarning>
        <label htmlFor="note" className="text-[10px] font-bold uppercase tracking-[0.2em] text-warm-ivory/50 block mb-3">
          Special Instructions (optional)
        </label>
        <textarea
          id="note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Allergies, preferences, extra sauces..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-luxury-gold/50 transition-all duration-300 placeholder:text-warm-ivory/20 resize-none"
        />
      </div>

      {/* Confirm Button */}
      <button
        disabled={!canConfirm}
        onClick={handleConfirm}
        className="w-full py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-2xl font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Confirm Order <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
