"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "40+", label: "Premium Recipes" },
  { value: "100%", label: "Fresh Ingredients" },
  { value: "15k+", label: "Happy Customers" },
  { value: "25k+", label: "Memories Made" },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 bg-deep-black z-10">
      {/* Background decoration glows */}
      <div className="absolute top-[10%] left-[-5%] w-[350px] h-[350px] bg-luxury-gold/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Brand Story */}
          <div className="lg:col-span-7">
            <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-primary-red uppercase">
              Our Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3 leading-tight">
              More Than Food. <br />
              <span className="text-luxury-gold italic">A Place To Create Memories.</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mt-6 mb-8 rounded-full" />

            <div className="space-y-6 text-warm-ivory/80 text-base md:text-lg font-light leading-relaxed">
              <p>
                At <strong className="font-semibold text-white">YOLO BITES</strong>, we believe that life should be lived with passion, flavor, and connection. Our journey began with a simple vision: to establish Kaduna's ultimate modern culinary destination where premium food meets unforgettable social energy.
              </p>
              <p>
                Nestled in the heart of Barnawa, we combine the comfort of a luxurious lounge with the sensory excitement of a world-class kitchen. Whether it is our gourmet wood-fired pizzas, slow-roasted shawarmas, hand-crafted mocktails, or fresh artisanal pastries, every item on our menu is designed to tell a story of quality.
              </p>
              <p>
                We do not just cook; we curate. We source organic, local ingredients daily to ensure peak freshness, while providing a stunning, Instagram-worthy atmosphere where Kaduna’s youth, families, and professionals come to vibe, connect, and celebrate.
              </p>
            </div>
          </div>

          {/* Right: Modern Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index}
                className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center group hover:border-luxury-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:-translate-y-1 transition-all duration-300"
              >
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-luxury-gold via-amber-200 to-luxury-gold tracking-tight mb-2 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm font-semibold tracking-wider text-warm-ivory/60 uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
