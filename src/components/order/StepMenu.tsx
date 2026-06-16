"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Minus, ShoppingCart, ArrowRight,
  User, X, Trash2, ChevronRight,
} from "lucide-react";
import { menuItems, categories, formatPrice, type MenuItem } from "@/lib/menuData";
import type { CartItem } from "@/lib/orderTypes";
import { createClient, formatError } from "@/utils/supabase/client";

interface Props {
  initialCart?: CartItem[];
  personName?: string;
  personIndex?: number;
  personCount?: number;
  nextLabel?: string;
  onNext: (cart: CartItem[]) => void;
}

const getNumericPrice = (p: any): number => {
  if (typeof p === "number") return p;
  if (typeof p === "string") {
    const cleaned = p.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

const normalizeMenu = (menu: any[]): MenuItem[] => {
  return menu.map(item => ({
    ...item,
    price: getNumericPrice(item.price)
  }));
};

export default function StepMenu({
  initialCart = [],
  personName,
  personIndex,
  personCount,
  nextLabel,
  onNext,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cart, setCart]                     = useState<CartItem[]>(initialCart);
  const [cartOpen, setCartOpen]             = useState(false);
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(menuItems);
  const [localCategories, setLocalCategories] = useState<{ id: string; label: string }[]>(categories);

  useEffect(() => {
    const supabase = createClient();

    async function loadMenuData() {
      try {
        const { data: cats, error: catError } = await supabase
          .from("yolo_categories")
          .select("*")
          .order("created_at", { ascending: true });

        if (catError) throw catError;

        const { data: menu, error: menuError } = await supabase
          .from("yolo_menu_items")
          .select("*")
          .order("created_at", { ascending: true });

        if (menuError) throw menuError;

        if (cats && cats.length > 0) {
          const filtered = cats.filter((c: any) => c.id !== "system_settings");
          setLocalCategories(filtered);
        }
        if (menu && menu.length > 0) {
          const normalized = normalizeMenu(menu);
          setLocalMenuItems(normalized);
          localStorage.setItem("yolo_menu_items", JSON.stringify(normalized));
        }
      } catch (err: any) {
        const formatted = formatError(err);
        console.error(`Error reading Supabase in StepMenu, using localStorage: ${formatted.message || (typeof formatted === "string" ? formatted : JSON.stringify(formatted))}`, formatted);
        const storedMenu = localStorage.getItem("yolo_menu_items");
        if (storedMenu) {
          const parsed = JSON.parse(storedMenu);
          const hasStaleBurgers = parsed.some((item: any) => 
            item.category === "burger" && !item.image.includes("single_burger") && !item.image.includes("double_burger")
          );
          if (hasStaleBurgers) {
            localStorage.removeItem("yolo_menu_items");
            setLocalMenuItems(normalizeMenu(menuItems));
          } else {
            setLocalMenuItems(normalizeMenu(parsed));
          }
        } else {
          setLocalMenuItems(normalizeMenu(menuItems));
        }

        const storedCats = localStorage.getItem("yolo_categories");
        if (storedCats) {
          const parsed = JSON.parse(storedCats);
          const filtered = parsed.filter((c: any) => c.id !== "system_settings");
          setLocalCategories(filtered);
        } else {
          setLocalCategories(categories);
        }
      }
    }

    loadMenuData();
  }, []);

  /* ── Derived ──────────────────────────────────── */
  const filtered =
    activeCategory === "all"
      ? localMenuItems
      : localMenuItems.filter((m) => m.category === activeCategory);

  const getQty      = (id: string) => cart.find((c) => c.id === id)?.quantity ?? 0;
  const totalItems  = cart.reduce((s, c) => s + c.quantity, 0);
  const totalPrice  = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  const isLastPerson =
    personIndex !== undefined &&
    personCount !== undefined &&
    personIndex === personCount - 1;

  const ctaLabel =
    nextLabel ??
    (personName
      ? isLastPerson
        ? "Complete All Orders"
        : "Done — Next Person"
      : "Review Order");

  /* ── Cart mutations ───────────────────────────── */
  const add = (item: MenuItem) =>
    setCart((prev) => {
      const ex = prev.find((c) => c.id === item.id);
      if (ex) return prev.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });

  const decrease = (id: string) =>
    setCart((prev) => {
      const ex = prev.find((c) => c.id === id);
      if (!ex) return prev;
      if (ex.quantity === 1) return prev.filter((c) => c.id !== id);
      return prev.map((c) => c.id === id ? { ...c, quantity: c.quantity - 1 } : c);
    });

  const removeItem = (id: string) =>
    setCart((prev) => prev.filter((c) => c.id !== id));

  const clearCart = () => setCart([]);

  /* ── Proceed (closes drawer first for UX) ──── */
  const proceed = () => {
    setCartOpen(false);
    onNext(cart);
  };

  return (
    <div className="relative w-full pb-36">

      {/* ── Header ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-2 px-4"
      >
        <span className="text-xs font-semibold tracking-[0.3em] text-primary-red uppercase">
          Build Your Order
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
          What's on Your <span className="text-luxury-gold italic">Plate?</span>
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-4 rounded-full" />
      </motion.div>

      {/* ── Person Banner ────────────────────────── */}
      {personName && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2.5 mt-5 mb-2"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-gold/10 border border-luxury-gold/25 text-luxury-gold text-sm font-semibold">
            <User className="w-4 h-4" />
            <span>{personName}</span>
            {personCount && personCount > 1 && (
              <span className="text-luxury-gold/50 text-xs">
                · Person {(personIndex ?? 0) + 1} of {personCount}
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Category Tabs ────────────────────────── */}
      <div className="flex flex-wrap gap-2 justify-center mt-6 mb-8 px-4">
        {localCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              activeCategory === cat.id
                ? "bg-primary-red text-white shadow-[0_4px_15px_rgba(225,29,72,0.35)]"
                : "bg-white/5 text-warm-ivory/60 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Menu Grid ────────────────────────────── */}
      <div className="px-4 max-w-5xl mx-auto">
        <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const qty = getQty(item.id);
              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.25 }}
                  className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary-red/20 hover:shadow-[0_0_25px_rgba(225,29,72,0.1)] transition-all duration-400 group flex flex-col"
                >
                  <div className="relative h-28 sm:h-44 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 to-transparent" />
                    <span className="absolute top-2 left-2 text-[8px] sm:text-[10px] font-bold tracking-wider text-luxury-gold uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-deep-black/60 backdrop-blur-md border border-luxury-gold/20">
                      {item.category}
                    </span>
                    {/* In-card qty badge */}
                    {qty > 0 && (
                      <span className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary-red text-white text-[10px] sm:text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(225,29,72,0.5)]">
                        {qty}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 sm:p-5 flex flex-col flex-grow">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                      <h3 className="font-serif text-xs sm:text-base font-bold text-white leading-tight sm:leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">
                        {item.name}
                      </h3>
                      <span className="font-serif font-bold text-luxury-gold text-[11px] sm:text-sm shrink-0">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <p className="text-warm-ivory/60 text-[10px] sm:text-xs font-light leading-relaxed flex-grow mb-3 sm:mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    {qty === 0 ? (
                      <button
                        onClick={() => add(item)}
                        className="w-full py-2 sm:py-2.5 rounded-xl border border-luxury-gold/30 text-luxury-gold text-[10px] sm:text-xs font-bold uppercase tracking-wider hover:bg-luxury-gold/10 transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Add
                      </button>
                    ) : (
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <button
                          onClick={() => decrease(item.id)}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-primary-red hover:border-primary-red flex items-center justify-center transition-all duration-300 shrink-0"
                        >
                          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </button>
                        <span className="font-bold text-white text-sm sm:text-lg flex-1 text-center">{qty}</span>
                        <button
                          onClick={() => add(item)}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-luxury-gold/10 border border-luxury-gold/30 hover:bg-luxury-gold/20 flex items-center justify-center transition-all duration-300 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-luxury-gold" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Sticky Bottom Bar ───────────────────── */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg"
          >
            <div className="flex gap-2">
              {/* View Cart button */}
              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2.5 px-5 py-4 bg-white/10 backdrop-blur-lg border border-white/15 text-white rounded-2xl font-bold shadow-lg hover:bg-white/15 transition-all duration-300 relative"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-sm hidden sm:inline">Cart</span>
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary-red text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              </button>

              {/* Proceed button */}
              <button
                onClick={proceed}
                className="flex-1 py-4 px-5 bg-primary-red text-white rounded-2xl font-bold shadow-[0_8px_30px_rgba(225,29,72,0.5)] flex items-center justify-between hover:bg-primary-red/90 transition-all duration-300 hover:scale-[1.01]"
              >
                <span className="text-sm font-bold">{ctaLabel}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{formatPrice(totalPrice)}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cart Drawer ──────────────────────────── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 35 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#111] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Your Cart
                  </h3>
                  {personName && (
                    <p className="text-xs text-luxury-gold mt-0.5 flex items-center gap-1">
                      <User className="w-3 h-3" /> {personName}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="flex items-center gap-1 text-xs text-warm-ivory/40 hover:text-primary-red transition-colors px-2 py-1 rounded-lg hover:bg-primary-red/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear
                    </button>
                  )}
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-warm-ivory/70" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <ShoppingCart className="w-7 h-7 text-warm-ivory/20" />
                    </div>
                    <p className="text-warm-ivory/40 text-sm">Your cart is empty</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="text-xs text-luxury-gold underline underline-offset-2"
                    >
                      Browse menu
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                        <p className="text-xs text-luxury-gold font-bold mt-0.5">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {/* Qty row */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => decrease(item.id)}
                            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-primary-red hover:border-primary-red flex items-center justify-center transition-all duration-200"
                          >
                            <Minus className="w-3 h-3 text-white" />
                          </button>
                          <span className="text-white font-bold text-sm w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => add(item)}
                            className="w-7 h-7 rounded-lg bg-luxury-gold/10 hover:bg-luxury-gold/20 flex items-center justify-center transition-all duration-200"
                          >
                            <Plus className="w-3 h-3 text-luxury-gold" />
                          </button>
                        </div>
                      </div>
                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 rounded-xl bg-primary-red/10 hover:bg-primary-red/20 flex items-center justify-center transition-colors shrink-0"
                      >
                        <X className="w-4 h-4 text-primary-red" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="px-4 pb-6 pt-4 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-warm-ivory/60 text-sm">
                      {totalItems} item{totalItems > 1 ? "s" : ""}
                    </span>
                    <span className="font-serif font-bold text-luxury-gold text-lg text-neon-gold">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={proceed}
                    className="w-full py-4 bg-primary-red hover:bg-primary-red/90 text-white rounded-2xl font-bold uppercase tracking-wider text-sm shadow-[0_4px_20px_rgba(225,29,72,0.4)] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    {ctaLabel} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
