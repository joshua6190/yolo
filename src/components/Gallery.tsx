"use client";

import { motion } from "framer-motion";

interface GalleryItem {
  id: number;
  src: string;
  category: string;
  title: string;
  aspectRatio: string; // Used to simulate organic heights in grids
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/images/background.png",
    category: "Interior",
    title: "Cinematic Main Lounge",
    aspectRatio: "mb-6 break-inside-avoid aspect-[4/3]",
  },
  {
    id: 2,
    src: "/images/yolo_pizza.png",
    category: "Food",
    title: "Truffle Pizza",
    aspectRatio: "mb-6 break-inside-avoid aspect-[1/1]",
  },
  {
    id: 3,
    src: "/images/cocktails.jpeg",
    category: "Drinks",
    title: "Vibrant Cocktail Craft",
    aspectRatio: "mb-6 break-inside-avoid aspect-[3/4]",
  },
  {
    id: 4,
    src: "/images/background 2.png",
    category: "Lifestyle",
    title: "Social Gatherings",
    aspectRatio: "mb-6 break-inside-avoid aspect-[3/2]",
  },
  {
    id: 5,
    src: "/images/burger.jpeg",
    category: "Food",
    title: "Artisanal Beef Burger",
    aspectRatio: "mb-6 break-inside-avoid aspect-[4/5]",
  },
  {
    id: 6,
    src: "/images/yolo_pastries.png",
    category: "Food",
    title: "Fresh Baked Croissants",
    aspectRatio: "mb-6 break-inside-avoid aspect-[1/1]",
  },
  {
    id: 7,
    src: "/images/background 3.png",
    category: "Interior",
    title: "Cozy Corner Lounge",
    aspectRatio: "mb-6 break-inside-avoid aspect-[16/10]",
  },
  {
    id: 8,
    src: "/images/sharwama.jpeg",
    category: "Food",
    title: "Gourmet Suya Wrap",
    aspectRatio: "mb-6 break-inside-avoid aspect-[3/4]",
  },
  {
    id: 9,
    src: "/images/yolo_parfaits.png",
    category: "Desserts",
    title: "Berry Bliss Parfait",
    aspectRatio: "mb-6 break-inside-avoid aspect-[1/1]",
  },
  {
    id: 10,
    src: "/images/yolo_chops.png",
    category: "Food",
    title: "Signature Chops Platter",
    aspectRatio: "mb-6 break-inside-avoid aspect-[4/3]",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-24 md:py-32 bg-deep-black z-10">
      {/* Glow Backdrops */}
      <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] bg-primary-red/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[30%] left-[-10%] w-[350px] h-[350px] bg-luxury-gold/3 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-primary-red uppercase">
            Visual Stories
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
            Moments Captured At <span className="text-luxury-gold italic">YOLO BITES</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mx-auto mt-4 rounded-full" />
        </div>

        {/* CSS Masonry Columns Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 w-full">
          {galleryItems.map((item) => (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              key={item.id}
              className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:border-primary-red/25 hover:shadow-[0_0_25px_rgba(225,29,72,0.15)] transition-all duration-500 ${item.aspectRatio}`}
            >
              {/* Image */}
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Glass Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8 z-10">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-luxury-gold uppercase px-2.5 py-1 rounded-full bg-deep-black/60 backdrop-blur-md border border-luxury-gold/25 inline-block mb-3">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
