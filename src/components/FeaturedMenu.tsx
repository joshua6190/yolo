"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, menuItems as defaultMenuItems, categories as defaultCategories } from "@/lib/menuData";
import type { MenuItem } from "@/lib/menuData";
import { createClient, formatError } from "@/utils/supabase/client";

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

export default function FeaturedMenu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [localMenuItems, setLocalMenuItems] = useState<MenuItem[]>(normalizeMenu(defaultMenuItems));
  const [localCategories, setLocalCategories] = useState<{ id: string; label: string }[]>(defaultCategories);

  useEffect(() => {
    const supabase = createClient();

    async function loadMenuData() {
      try {
        // Fetch categories
        const { data: cats, error: catError } = await supabase
          .from("yolo_categories")
          .select("*")
          .order("created_at", { ascending: true });

        if (catError) throw catError;

        // Fetch menu items
        const { data: menu, error: menuError } = await supabase
          .from("yolo_menu_items")
          .select("*")
          .order("created_at", { ascending: true });

        if (menuError) throw menuError;

        if (cats && cats.length > 0) {
          const filtered = cats.filter((c: any) => c.id !== "system_settings");
          setLocalCategories(filtered);
        } else {
          // Auto-seed if database is clean
          const cleanDefaultCats = defaultCategories.map(c => ({ id: c.id, label: c.label }));
          const { error: insertError } = await supabase.from("yolo_categories").insert(cleanDefaultCats);
          if (!insertError) setLocalCategories(cleanDefaultCats);
        }

        if (menu && menu.length > 0) {
          const normalized = normalizeMenu(menu);
          setLocalMenuItems(normalized);
          localStorage.setItem("yolo_menu_items", JSON.stringify(normalized));
        } else {
          // Auto-seed if database is clean
          const cleanDefaultMenu = normalizeMenu(defaultMenuItems).map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            description: item.description,
            image: item.image
          }));
          const { error: insertError } = await supabase.from("yolo_menu_items").insert(cleanDefaultMenu);
          if (!insertError) {
            setLocalMenuItems(cleanDefaultMenu);
            localStorage.setItem("yolo_menu_items", JSON.stringify(cleanDefaultMenu));
          }
        }
      } catch (err: any) {
        const formatted = formatError(err);
        console.error(`Error reading Supabase in FeaturedMenu, using localStorage: ${formatted.message || (typeof formatted === "string" ? formatted : JSON.stringify(formatted))}`, formatted);
        const storedMenu = localStorage.getItem("yolo_menu_items");
        if (storedMenu) {
          const parsed = JSON.parse(storedMenu);
          // Check for stale burger image mapping (which previously mapped to chops/generic)
          const hasStaleBurgers = parsed.some((item: any) => 
            item.category === "burger" && !item.image.includes("single_burger") && !item.image.includes("double_burger")
          );
          if (hasStaleBurgers) {
            localStorage.removeItem("yolo_menu_items");
            setLocalMenuItems(normalizeMenu(defaultMenuItems));
          } else {
            setLocalMenuItems(normalizeMenu(parsed));
          }
        } else {
          setLocalMenuItems(normalizeMenu(defaultMenuItems));
        }

        const storedCats = localStorage.getItem("yolo_categories");
        if (storedCats) {
          const parsed = JSON.parse(storedCats);
          const filtered = parsed.filter((c: any) => c.id !== "system_settings");
          setLocalCategories(filtered);
        } else {
          setLocalCategories(defaultCategories);
        }
      }
    }

    loadMenuData();
  }, []);

  const filteredItems = activeCategory === "all"
    ? localMenuItems
    : localMenuItems.filter(item => item.category === activeCategory);

  return (
    <section id="menu" className="relative py-24 md:py-32 bg-deep-black z-10">
      {/* Soft Background Glows */}
      <div className="absolute bottom-[10%] left-[20%] w-[35%] h-[35%] bg-primary-red/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-[20%] right-[20%] w-[35%] h-[35%] bg-luxury-gold/3 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-primary-red uppercase">
              Curated Taste
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mt-3">
              Explore Our <span className="text-luxury-gold italic">Signature Menu</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary-red to-luxury-gold mt-4 rounded-full" />
          </div>

          {/* Navigation/Filters */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            {localCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-primary-red text-white shadow-[0_4px_15px_rgba(225,29,72,0.3)]"
                    : "bg-white/5 text-warm-ivory/60 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={item.id}
                className="group relative rounded-3xl overflow-hidden glass-card flex flex-col h-full border border-white/5 hover:border-primary-red/30 hover:shadow-[0_0_30px_rgba(225,29,72,0.15)] transition-all duration-500"
              >
                {/* Image Wrapper */}
                <div className="relative h-32 sm:h-64 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent z-10 opacity-70" />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Category badge */}
                  <span className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 sm:px-3 sm:py-1 bg-deep-black/60 backdrop-blur-md rounded-full text-[8px] sm:text-[10px] font-bold tracking-wider text-luxury-gold uppercase border border-luxury-gold/20">
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-3.5 sm:p-8 flex flex-col flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-1.5 sm:mb-3">
                    <h3 className="font-serif text-xs sm:text-xl font-bold text-white group-hover:text-primary-red transition-colors duration-300 line-clamp-2 min-h-[2rem] sm:min-h-0">
                      {item.name}
                    </h3>
                    <span className="font-serif font-bold text-[11px] sm:text-lg text-luxury-gold text-neon-gold shrink-0">
                      {typeof item.price === "number" ? formatPrice(item.price) : item.price}
                    </span>
                  </div>
                  <p className="text-warm-ivory/70 text-[10px] sm:text-sm font-light leading-relaxed flex-grow line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
