"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Sofa, Camera, Users, Leaf, Sparkles } from "lucide-react";

const reasons = [
  {
    icon: UtensilsCrossed,
    title: "Premium Food",
    description: "Crafted by world-class chefs utilizing state-of-the-art culinary techniques. Every dish is a masterpiece designed to satisfy your finest cravings.",
    color: "border-primary-red/20 hover:border-primary-red/60 hover:shadow-[0_0_25px_rgba(225,29,72,0.15)]",
    iconColor: "text-primary-red",
  },
  {
    icon: Sofa,
    title: "Cozy Ambience",
    description: "Immerse yourself in a luxurious, modern architectural space featuring high-end furnishings, cozy lounge seating, and rich cinematic lighting.",
    color: "border-luxury-gold/20 hover:border-luxury-gold/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]",
    iconColor: "text-luxury-gold",
  },
  {
    icon: Camera,
    title: "Instagram-Worthy Experience",
    description: "Every corner is meticulously designed for content creators. Capture beautiful aesthetics, neon signage displays, and photogenic dishes.",
    color: "border-primary-red/20 hover:border-primary-red/60 hover:shadow-[0_0_25px_rgba(225,29,72,0.15)]",
    iconColor: "text-primary-red",
  },
  {
    icon: Users,
    title: "Great Company",
    description: "Kaduna's premier social hotspot. The ultimate destination to connect, network, host friends, and build unforgettable memories with loved ones.",
    color: "border-luxury-gold/20 hover:border-luxury-gold/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]",
    iconColor: "text-luxury-gold",
  },
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    description: "Zero compromises on quality. We source clean, fresh, organic ingredients daily from trusted local farms to serve wholesome dining experiences.",
    color: "border-primary-red/20 hover:border-primary-red/60 hover:shadow-[0_0_25px_rgba(225,29,72,0.15)]",
    iconColor: "text-primary-red",
  },
  {
    icon: Sparkles,
    title: "Exceptional Service",
    description: "Our highly trained staff delivers world-class, premium hospitality, catering to your specific preferences with rapid, friendly attention.",
    color: "border-luxury-gold/20 hover:border-luxury-gold/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.15)]",
    iconColor: "text-luxury-gold",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function WhyYolo() {
  return (
    <section id="why-yolo" className="relative py-24 md:py-32 bg-deep-black z-10">
      {/* Visual glowing background elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full bg-primary-red/5 blur-[100px] -z-10" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 rounded-full bg-luxury-gold/3 blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs md:text-sm font-semibold tracking-[0.25em] text-primary-red uppercase"
          >
            The YOLO Lifestyle
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3 leading-tight"
          >
            Why Everyone Will Be Talking About <span className="text-luxury-gold italic">YOLO Bites</span>
          </motion.h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-6 rounded-full" />
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`glass-card p-8 rounded-2xl border ${item.color} flex flex-col items-start hover:-translate-y-2`}
              >
                {/* Icon wrapper */}
                <div className={`p-4 rounded-xl bg-white/5 border border-white/10 mb-6 flex items-center justify-center ${item.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl font-bold text-white mb-3 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-warm-ivory/70 text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
