"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Home, UtensilsCrossed, Bike, Banknote, CreditCard, Smartphone, Copy, Check, MapPin, User, Phone, Printer, Download, Loader2, X } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/menuData";
import type { PersonOrder, CartItem, DeliveryInfo } from "@/lib/orderTypes";
import { createClient } from "@/utils/supabase/client";
import html2canvas from "html2canvas-pro";

type PaymentMethod = "cash" | "transfer" | "card";

interface Props {
  mode: "dine-in" | "delivery";
  tableNumber?: number | null;
  persons?: PersonOrder[];
  deliveryCart?: CartItem[];
  deliveryInfo?: DeliveryInfo | null;
  paymentMethod: PaymentMethod;
  orderRef: string;
  pin?: string;
}

const paymentIcon = { cash: Banknote, transfer: Smartphone, card: CreditCard };
const paymentLabel = { cash: "Cash", transfer: "Bank Transfer", card: "Card Payment" };

export default function StepSuccess({ mode, tableNumber, persons = [], deliveryCart = [], deliveryInfo, paymentMethod, orderRef, pin: propPin }: Props) {
  const allItems = mode === "dine-in" ? persons.flatMap((p) => p.cart) : deliveryCart;
  const PayIcon = paymentIcon[paymentMethod];

  const [pin, setPin] = useState("");
  const [pinCopied, setPinCopied] = useState(false);
  const [orderTime, setOrderTime] = useState("");
  const [taxRate, setTaxRate] = useState<number>(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState<boolean>(false);

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    const element = document.getElementById("receipt-print-area");
    if (!element) {
      setGeneratingImage(false);
      return;
    }

    element.classList.add("capturing-receipt");

    try {
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#070707",
        scale: 2.5,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      });

      const imgData = canvas.toDataURL("image/png");
      setPreviewImage(imgData);
    } catch (err) {
      console.error("Failed to generate receipt image:", err);
      alert("Failed to create receipt preview. Please try again.");
    } finally {
      element.classList.remove("capturing-receipt");
      setGeneratingImage(false);
    }
  };

  // Generate a 4-digit confirmation PIN on mount and grab current date/time
  useEffect(() => {
    if (propPin) {
      setPin(propPin);
    } else {
      const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
      setPin(randomPin);
    }

    setOrderTime(
      new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    );

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
        console.error("Failed to load tax rate in StepSuccess:", err);
      }
    };
    fetchLiveSettings();
  }, [propPin]);

  const subtotal = allItems.reduce((s, c) => s + c.price * c.quantity, 0);
  const activeTaxRate = mode === "delivery" ? taxRate : 0;
  const taxAmount = parseFloat((subtotal * (activeTaxRate / 100)).toFixed(2));
  const grandTotal = subtotal + taxAmount;

  const handleCopyPin = () => {
    if (pin) {
      navigator.clipboard.writeText(pin);
      setPinCopied(true);
      setTimeout(() => setPinCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 pb-16 pt-4 text-center">
      {/* Print-only global styles wrapper */}
      <style>{`
        @media print {
          /* Hide all page content by default */
          body * {
            visibility: hidden;
            background: none !important;
          }
          /* Only make the receipt area and its child contents visible */
          #receipt-print-area, #receipt-print-area * {
            visibility: visible;
          }
          #receipt-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #0f172a !important;
            padding: 30px !important;
            border: 2px solid #cbd5e1 !important;
            border-radius: 16px !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
          #receipt-print-area * {
            color: #0f172a !important;
          }
          /* Custom overrides for print text colors to remain high-contrast on white bg */
          #receipt-print-area .text-luxury-gold, 
          #receipt-print-area .text-neon-gold {
            color: #b45309 !important; /* amber-700 */
          }
          #receipt-print-area .text-primary-red {
            color: #be123c !important; /* rose-700 */
          }
          #receipt-print-area .text-warm-ivory\\/70,
          #receipt-print-area .text-warm-ivory\\/50,
          #receipt-print-area .text-warm-ivory\\/40 {
            color: #475569 !important; /* slate-600 */
          }
          #receipt-print-area .glass-card {
            background-color: #f8fafc !important; /* slate-50 */
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
          }
          #receipt-print-area .border-white\\/10,
          #receipt-print-area .border-white\\/5 {
            border-color: #e2e8f0 !important;
          }
          /* Hide print action items, interactive elements & icon SVGs inside the receipt */
          #receipt-print-area button,
          #receipt-print-area .no-print {
            display: none !important;
          }
        }

        /* html2canvas capturing specific styles */
        .capturing-receipt, .capturing-receipt * {
          text-shadow: none !important;
          box-shadow: none !important;
        }
        .capturing-receipt .glass-card {
          background-color: #121214 !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }
        .capturing-receipt .text-luxury-gold, 
        .capturing-receipt .text-neon-gold {
          color: #d4af37 !important;
        }
        .capturing-receipt .text-primary-red {
          color: #e11d48 !important;
        }
        .capturing-receipt .text-warm-ivory\\/70 {
          color: #b3b1ad !important;
        }
        .capturing-receipt .text-warm-ivory\\/55,
        .capturing-receipt .text-warm-ivory\\/50,
        .capturing-receipt .text-warm-ivory\\/40 {
          color: #8c8a87 !important;
        }
        .capturing-receipt .hidden.print\\:flex {
          display: flex !important;
        }
        .capturing-receipt .hidden.print\\:block {
          display: block !important;
        }
        .capturing-receipt .no-print {
          display: none !important;
        }
        .capturing-receipt {
          background: #070707 !important;
          padding: 24px !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 24px !important;
          width: 450px !important;
          max-width: 450px !important;
        }
      `}</style>

      {/* Animated ring + check */}
      <div className="relative mb-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="w-28 h-28 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.25)]"
        >
          <CheckCircle2 className="w-14 h-14 text-emerald-400" />
        </motion.div>
        {/* Confetti */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.cos((i * 45 * Math.PI) / 180) * 65,
              y: Math.sin((i * 45 * Math.PI) / 180) * 65,
            }}
            transition={{ delay: 0.25 + i * 0.06, duration: 0.8 }}
            className={`absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full ${
              i % 3 === 0 ? "bg-luxury-gold" : i % 3 === 1 ? "bg-primary-red" : "bg-emerald-400"
            }`}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-lg"
      >
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3">
          Order Confirmed! 🎉
        </h2>
        <p className="text-warm-ivory/70 text-base font-light leading-relaxed mb-8 max-w-sm mx-auto">
          {mode === "dine-in"
            ? `Your orders for Table ${tableNumber} are sent to the kitchen. Sit back and enjoy!`
            : "Your delivery order is confirmed and being prepared now!"}
        </p>

        {/* Unified Print Area */}
        <div id="receipt-print-area" className="w-full text-left space-y-6">
          
          {/* Print-Only Receipt Header */}
          <div className="hidden print:flex items-center justify-between border-b-2 border-amber-600 pb-4 mb-4">
            <div>
              <h1 className="font-serif text-2xl font-extrabold tracking-wider text-slate-800">YOLO BITES</h1>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Barnawa, Kaduna South, Nigeria</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">Official Receipt</span>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">{orderTime}</p>
            </div>
          </div>

          {/* Dispatch Confirmation PIN (Only for Delivery) */}
          {mode === "delivery" && pin && (
            <div className="glass-card border border-luxury-gold/30 bg-luxury-gold/[0.02] rounded-3xl p-6 text-center">
              <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-bold block mb-2">
                Dispatch Confirmation PIN
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-3xl font-extrabold tracking-widest text-white bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]">
                  {pin}
                </span>
                <button
                  onClick={handleCopyPin}
                  className="px-4 py-3 rounded-2xl bg-luxury-gold/10 hover:bg-luxury-gold/20 text-luxury-gold hover:text-white border border-luxury-gold/20 transition-all duration-300 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                >
                  {pinCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy PIN
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-warm-ivory/40 leading-relaxed mt-3 max-w-xs mx-auto no-print">
                Please copy this PIN. You will need to present it to the dispatch rider to confirm delivery.
              </p>
            </div>
          )}

          {/* Order Details Card */}
          <div className="glass-card border border-white/10 rounded-3xl p-6 text-left">
            {/* Header row */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-warm-ivory/40 font-semibold mb-1">Order Ref</p>
                <p className="font-serif font-bold text-luxury-gold tracking-widest text-neon-gold text-lg">
                  #{orderRef}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 no-print">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Confirmed</span>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm-ivory/50">Type</span>
                <span className="flex items-center gap-1.5 font-semibold text-white text-xs uppercase tracking-wider">
                  {mode === "dine-in"
                    ? <><UtensilsCrossed className="w-3.5 h-3.5 text-luxury-gold" /> Dine In · Table {tableNumber}</>
                    : <><Bike className="w-3.5 h-3.5 text-primary-red" /> Delivery</>}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
                <span className="text-warm-ivory/50">Payment Status</span>
                <span className="flex items-center gap-1.5 font-semibold text-white text-xs uppercase tracking-wider">
                  <PayIcon className="w-3.5 h-3.5 text-luxury-gold" />
                  {paymentLabel[paymentMethod]} {paymentMethod === "transfer" ? "(Pending Review)" : "(Processing)"}
                </span>
              </div>
              {orderTime && (
                <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
                  <span className="text-warm-ivory/50">Order Date</span>
                  <span className="font-semibold text-white text-xs">
                    {orderTime}
                  </span>
                </div>
              )}
              {activeTaxRate > 0 && (
                <>
                  <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
                    <span className="text-warm-ivory/50">Subtotal</span>
                    <span className="font-semibold text-white text-xs">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3 font-mono">
                    <span className="text-warm-ivory/50">Tax / VAT ({activeTaxRate}%)</span>
                    <span className="font-semibold text-white text-xs">
                      {formatPrice(taxAmount)}
                    </span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between text-sm border-t border-white/5 pt-3">
                <span className="text-warm-ivory/50">Grand Total</span>
                <span className="font-serif font-bold text-luxury-gold text-base text-neon-gold">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Destination Summary (Only for Delivery) */}
          {mode === "delivery" && deliveryInfo && (
            <div className="glass-card border border-white/5 rounded-3xl p-6 text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary-red font-bold mb-3">
                Delivery Destination
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white">
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

          {/* Itemized Order Summary */}
          <div className="glass-card border border-white/5 rounded-3xl p-6 text-left">
            <p className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold mb-3">
              Itemized Items ({allItems.reduce((s, c) => s + c.quantity, 0)})
            </p>
            <div className="space-y-2.5">
              {allItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0 last:pb-0">
                  <span className="text-warm-ivory/70 font-medium">
                    {item.name} <span className="text-warm-ivory/40 text-[10px] font-bold">×{item.quantity}</span>
                  </span>
                  <span className="font-mono font-semibold text-white">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-person breakdown (dine-in only) */}
          {mode === "dine-in" && persons.length > 1 && (
            <div className="glass-card border border-white/5 rounded-3xl p-6 text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold mb-4">
                Per-Person Breakdown
              </p>
              {persons.map((person, i) => (
                <div key={i} className="flex items-start justify-between py-3 border-b border-white/5 last:border-0 gap-4">
                  <div>
                    <p className="text-sm font-bold text-white">{person.name}</p>
                    <p className="text-xs text-warm-ivory/40 mt-0.5 leading-relaxed">
                      {person.cart.map((c) => `${c.name} ×${c.quantity}`).join(" · ")}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-luxury-gold shrink-0">
                    {formatPrice(person.cart.reduce((s, c) => s + c.price * c.quantity, 0))}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Print-Only Footer Note */}
          <div className="hidden print:block text-center pt-6 border-t border-slate-200">
            <p className="text-xs font-serif font-bold text-slate-800">Thank you for dining with YOLO BITES!</p>
            <p className="text-[9px] text-slate-500 mt-1">Please keep this receipt and present your PIN upon delivery/request.</p>
          </div>
        </div>

        {/* Screen-Only Button Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          {mode === "delivery" ? (
            <button
              onClick={handleGenerateImage}
              disabled={generatingImage}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-luxury-gold hover:bg-luxury-gold/90 text-deep-black rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 hover:scale-105 shadow-[0_4px_25px_rgba(212,175,55,0.25)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Save Receipt Image
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-luxury-gold hover:bg-luxury-gold/90 text-deep-black rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 hover:scale-105 shadow-[0_4px_25px_rgba(212,175,55,0.25)] cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Download PDF Receipt
            </button>
          )}

          {mode === "delivery" && (
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-warm-ivory border border-white/10 rounded-full font-semibold uppercase tracking-wider text-xs transition-all duration-300 hover:scale-105"
            >
              <Printer className="w-4 h-4" /> PDF Print
            </button>
          )}

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 text-warm-ivory border border-white/10 rounded-full font-semibold uppercase tracking-wider text-xs transition-all duration-300 hover:scale-105"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </motion.div>

      {/* Receipt Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col items-center">
            
            {/* Close button */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-warm-ivory/70 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-white mt-2 mb-1">
              Receipt Preview
            </h3>
            
            <p className="text-[10px] text-warm-ivory/55 text-center max-w-xs mb-4">
              On mobile devices, <strong className="text-luxury-gold">tap and hold (long-press)</strong> the image to save directly to your photos.
            </p>

            {/* Rendered Image */}
            <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 flex justify-center items-center my-3 p-1">
              <img
                src={previewImage}
                alt="YOLO Bites Order Receipt"
                className="w-full max-h-[50vh] object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Action buttons inside modal */}
            <div className="w-full space-y-2 mt-4">
              <a
                href={previewImage}
                download={`yolo-receipt-${orderRef}.png`}
                className="w-full py-3.5 bg-luxury-gold hover:bg-luxury-gold/90 text-deep-black rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-[0_4px_15px_rgba(212,175,55,0.2)] text-center"
              >
                <Download className="w-4 h-4" /> Download to Device
              </a>
              <button
                onClick={() => setPreviewImage(null)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-warm-ivory rounded-xl font-semibold uppercase tracking-wider text-xs transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
