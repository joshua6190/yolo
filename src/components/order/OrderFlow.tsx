"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChefHat } from "lucide-react";
import Link from "next/link";
import StepModeSelect from "./StepModeSelect";
import StepTableSelect from "./StepTableSelect";
import StepPersonCount from "./StepPersonCount";
import StepPersonName from "./StepPersonName";
import StepMenu from "./StepMenu";
import StepDeliveryInfo from "./StepDeliveryInfo";
import StepPayment from "./StepPayment";
import StepSuccess from "./StepSuccess";
import type { PersonOrder, CartItem, DeliveryInfo } from "@/lib/orderTypes";
import { createClient, formatError } from "@/utils/supabase/client";

type OrderMode = "dine-in" | "delivery";
type PaymentMethod = "cash" | "transfer" | "card";

type Step =
  | "mode"
  | "table"
  | "person-count"
  | "person-name"
  | "person-menu"
  | "delivery-menu"
  | "delivery-info"
  | "payment"
  | "success";

const stepProgressDineIn: Step[] = ["mode", "table", "person-count", "person-name", "person-menu", "payment"];
const stepProgressDelivery: Step[] = ["mode", "delivery-menu", "delivery-info", "payment"];
const stepLabels: Partial<Record<Step, string>> = {
  table: "Table",
  "person-count": "Guests",
  "person-name": "Your Name",
  "person-menu": "Order",
  "delivery-menu": "Menu",
  "delivery-info": "Delivery Details",
  payment: "Payment",
};

function genRef() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function OrderFlow() {
  const [step, setStep]                   = useState<Step>("mode");
  const [mode, setMode]                   = useState<OrderMode | null>(null);
  const [tableNumber, setTableNumber]     = useState<number | null>(null);
  const [personCount, setPersonCount]     = useState<number>(1);
  const [currentPersonIdx, setCurrentPersonIdx] = useState<number>(0);
  const [persons, setPersons]             = useState<PersonOrder[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [deliveryCart, setDeliveryCart]   = useState<CartItem[]>([]);
  const [deliveryInfo, setDeliveryInfo]   = useState<DeliveryInfo | null>(null);
  const [orderRef]                        = useState(genRef);
  const [pin]                             = useState(() => Math.floor(1000 + Math.random() * 9000).toString());

  /* ── Navigation helpers ───────────────────────── */
  const currentPerson = persons[currentPersonIdx] as PersonOrder | undefined;

  const handleMode = (m: OrderMode) => {
    setMode(m);
    setStep(m === "dine-in" ? "table" : "delivery-menu");
  };

  const handleTable = (t: number) => {
    setTableNumber(t);
    setStep("person-count");
  };

  const handlePersonCount = (count: number) => {
    setPersonCount(count);
    setPersons([]);
    setCurrentPersonIdx(0);
    setStep("person-name");
  };

  const handlePersonName = (name: string) => {
    // Save or update the person's name slot (cart will be added when they finish menu)
    setPersons((prev) => {
      const updated = [...prev];
      updated[currentPersonIdx] = { name, cart: prev[currentPersonIdx]?.cart ?? [] };
      return updated;
    });
    setStep("person-menu");
  };

  const handlePersonMenu = (cart: CartItem[]) => {
    // Save this person's cart
    setPersons((prev) => {
      const updated = [...prev];
      updated[currentPersonIdx] = { ...updated[currentPersonIdx], cart };
      return updated;
    });

    const nextIdx = currentPersonIdx + 1;
    if (nextIdx < personCount) {
      // Move to next person
      setCurrentPersonIdx(nextIdx);
      setStep("person-name");
    } else {
      // All persons done → payment
      setStep("payment");
    }
  };

  const handleDeliveryMenu = (cart: CartItem[]) => {
    setDeliveryCart(cart);
    setStep("delivery-info");
  };

  const handleDeliveryInfo = (info: DeliveryInfo) => {
    setDeliveryInfo(info);
    setStep("payment");
  };

  const handlePayment = async (method: PaymentMethod) => {
    setPaymentMethod(method);

    const allItems = mode === "dine-in" ? persons.flatMap((p) => p.cart) : deliveryCart;
    const totalAmount = allItems.reduce((s, c) => s + c.price * c.quantity, 0);

    const newOrder = {
      id: orderRef,
      pin: mode === "delivery" ? pin : null,
      mode,
      tableNumber: mode === "dine-in" ? tableNumber : null,
      personCount: mode === "dine-in" ? personCount : 1,
      persons: mode === "dine-in" ? persons : [],
      deliveryCart: mode === "delivery" ? deliveryCart : [],
      deliveryInfo: mode === "delivery" ? deliveryInfo : null,
      paymentMethod: method,
      status: "pending",
      totalAmount,
      timestamp: new Date().toISOString(),
    };

    // Save to Supabase
    const supabase = createClient();
    try {
      const { error } = await supabase.from("yolo_orders").insert({
        id: newOrder.id,
        pin: newOrder.pin,
        mode: newOrder.mode,
        table_number: newOrder.tableNumber,
        person_count: newOrder.personCount,
        persons: newOrder.persons,
        delivery_cart: newOrder.deliveryCart,
        delivery_info: newOrder.deliveryInfo,
        payment_method: newOrder.paymentMethod,
        status: newOrder.status,
        total_amount: newOrder.totalAmount,
        created_at: newOrder.timestamp
      });
      if (error) throw error;
    } catch (err: any) {
      const formatted = formatError(err);
      console.error(`Error inserting order to Supabase, falling back to localStorage: ${formatted.message || (typeof formatted === "string" ? formatted : JSON.stringify(formatted))}`, formatted);
      // LocalStorage fallback
      if (typeof window !== "undefined") {
        try {
          const existing = localStorage.getItem("yolo_orders");
          const orders = existing ? JSON.parse(existing) : [];
          orders.unshift(newOrder);
          localStorage.setItem("yolo_orders", JSON.stringify(orders));
        } catch (err) {
          console.error("Error saving fallback order:", err);
        }
      }
    }

    setStep("success");
  };

  const goBack = () => {
    switch (step) {
      case "table":         return setStep("mode");
      case "person-count":  return setStep("table");
      case "person-name":
        if (currentPersonIdx === 0) {
          setStep("person-count");
        } else {
          setCurrentPersonIdx((i) => i - 1);
          setStep("person-menu");
        }
        break;
      case "person-menu":  return setStep("person-name");
      case "delivery-menu": return setStep("mode");
      case "delivery-info": return setStep("delivery-menu");
      case "payment":
        if (mode === "dine-in") {
          setCurrentPersonIdx(personCount - 1);
          setStep("person-menu");
        } else {
          setStep("delivery-info");
        }
        break;
    }
  };

  /* ── Progress bar ─────────────────────────────── */
  const progressSteps = mode === "delivery" ? stepProgressDelivery : stepProgressDineIn;
  const progressIdx   = progressSteps.indexOf(step);

  /* ── Slide direction ──────────────────────────── */
  const slideIn = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, transition: { duration: 0.28 } };

  return (
    <div className="min-h-screen bg-deep-black text-warm-ivory">
      {/* Navbar */}
      <header className="sticky top-0 z-40 glass-nav px-5 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-luxury-gold/60">
            <img src="/images/logo.jpeg" alt="YOLO BITES" className="w-full h-full object-cover" />
          </div>
          <span className="font-serif text-base font-bold tracking-widest text-white group-hover:text-luxury-gold transition-colors">
            YOLO BITES
          </span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-warm-ivory/40 font-medium">
          <ChefHat className="w-4 h-4 text-luxury-gold" />
          <span className="hidden sm:inline">Order Experience</span>
        </div>
      </header>

      {/* Progress Stepper */}
      {step !== "mode" && step !== "success" && (
        <div className="max-w-2xl mx-auto px-6 pt-6 pb-2">
          <div className="flex items-center gap-1">
            {progressSteps
              .filter((s) => stepLabels[s])
              .map((s, i) => {
                const active = s === step || (s === "person-menu" && step === "person-name");
                const done   = progressSteps.indexOf(s) < progressIdx;
                return (
                  <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className={`w-full h-1 rounded-full transition-all duration-500 ${done || active ? "bg-primary-red" : "bg-white/10"}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-wider transition-colors duration-300 ${active ? "text-primary-red" : done ? "text-warm-ivory/40" : "text-warm-ivory/20"}`}>
                      {stepLabels[s]}
                    </span>
                  </div>
                );
              })}
          </div>

          {/* Person counter for dine-in */}
          {(step === "person-name" || step === "person-menu") && personCount > 1 && (
            <p className="text-center text-xs text-warm-ivory/40 mt-3">
              Person{" "}
              <span className="text-luxury-gold font-bold">{currentPersonIdx + 1}</span>
              {" "}of{" "}
              <span className="text-luxury-gold font-bold">{personCount}</span>
              {currentPerson?.name ? ` — ${currentPerson.name}` : ""}
            </p>
          )}
        </div>
      )}

      {/* Back Button */}
      {step !== "mode" && step !== "success" && (
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-warm-ivory/50 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto pt-8 pb-24">
        <AnimatePresence mode="wait">

          {step === "mode" && (
            <motion.div key="mode" {...slideIn}>
              <StepModeSelect onSelect={handleMode} />
            </motion.div>
          )}

          {step === "table" && (
            <motion.div key="table" {...slideIn}>
              <StepTableSelect onConfirm={handleTable} />
            </motion.div>
          )}

          {step === "person-count" && tableNumber && (
            <motion.div key="person-count" {...slideIn}>
              <StepPersonCount tableNumber={tableNumber} onConfirm={handlePersonCount} />
            </motion.div>
          )}

          {step === "person-name" && (
            <motion.div key={`person-name-${currentPersonIdx}`} {...slideIn}>
              <StepPersonName
                personIndex={currentPersonIdx}
                personCount={personCount}
                tableNumber={tableNumber!}
                onConfirm={handlePersonName}
              />
            </motion.div>
          )}

          {step === "person-menu" && currentPerson && (
            <motion.div key={`person-menu-${currentPersonIdx}`} {...slideIn}>
              <StepMenu
                initialCart={currentPerson.cart}
                personName={currentPerson.name}
                personIndex={currentPersonIdx}
                personCount={personCount}
                onNext={handlePersonMenu}
              />
            </motion.div>
          )}

          {step === "delivery-menu" && (
            <motion.div key="delivery-menu" {...slideIn}>
              <StepMenu
                initialCart={deliveryCart}
                nextLabel="Review Address"
                onNext={handleDeliveryMenu}
              />
            </motion.div>
          )}

          {step === "delivery-info" && (
            <motion.div key="delivery-info" {...slideIn}>
              <StepDeliveryInfo onConfirm={handleDeliveryInfo} />
            </motion.div>
          )}

          {step === "payment" && mode && (
            <motion.div key="payment" {...slideIn}>
              <StepPayment
                mode={mode}
                tableNumber={tableNumber}
                persons={persons}
                deliveryCart={deliveryCart}
                deliveryInfo={deliveryInfo}
                onConfirm={handlePayment}
              />
            </motion.div>
          )}

          {step === "success" && mode && paymentMethod && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
              <StepSuccess
                mode={mode}
                tableNumber={tableNumber}
                persons={persons}
                deliveryCart={deliveryCart}
                deliveryInfo={deliveryInfo}
                paymentMethod={paymentMethod}
                orderRef={orderRef}
                pin={pin}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
