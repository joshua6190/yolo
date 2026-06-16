"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Bike,
  UtensilsCrossed,
  Trash2,
  Edit2,
  PlusCircle,
  CheckCircle,
  Clock,
  Ban,
  BarChart3,
  Settings,
  Grid,
  FileText,
  ChevronRight,
  Play,
  RefreshCw,
  Printer,
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Award,
  Layers,
  Upload,
  X,
  Check,
  Smartphone,
  CreditCard,
  Banknote
} from "lucide-react";
import { formatPrice, categories as defaultCategories, menuItems as defaultMenuItems } from "@/lib/menuData";
import type { MenuItem } from "@/lib/menuData";
import type { PersonOrder, CartItem, DeliveryInfo } from "@/lib/orderTypes";
import { createClient, formatError } from "@/utils/supabase/client";

const presetImages = [
  { name: "Pizza", url: "/images/yolo_pizza.png" },
  { name: "Shawarma", url: "/images/sharwama.jpeg" },
  { name: "Chops", url: "/images/yolo_chops.png" },
  { name: "Fries", url: "/images/yolo_fries.png" },
  { name: "Burger", url: "/images/burger.jpeg" },
  { name: "Parfait", url: "/images/yolo_parfaits.png" },
  { name: "Drinks", url: "/images/cocktails.jpeg" },
  { name: "Smoothie", url: "/images/yolo_smoothie.png" },
  { name: "Milkshake", url: "/images/yolo_milkshake.png" },
];

interface StoredOrder {
  id: string;
  pin: string | null;
  mode: "dine-in" | "delivery";
  tableNumber: number | null;
  personCount: number;
  persons: PersonOrder[];
  deliveryCart: CartItem[];
  deliveryInfo: DeliveryInfo | null;
  paymentMethod: "cash" | "transfer" | "card";
  status: "pending" | "preparing" | "completed" | "cancelled";
  totalAmount: number;
  timestamp: string;
  taxRate?: number;
  taxAmount?: number;
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

export default function AdminPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "orders" | "categories" | "menu" | "settings">("analytics");
  
  // Local DB States
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);
  const [storeOpen, setStoreOpen] = useState(true);
  const [tablesCount, setTablesCount] = useState<number>(6);
  const [dbError, setDbError] = useState<{ message: string; details: string; hint: string; code: string } | null>(null);

  // Form states - Category
  const [newCatId, setNewCatId] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");
  // Form states - Menu Item
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("pizza");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemImage, setNewItemImage] = useState("/images/yolo_pizza.png");
  const [imageType, setImageType] = useState<"preset" | "upload">("preset");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  // Filters for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("pending");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderServiceFilter, setOrderServiceFilter] = useState<"all" | "dine-in" | "delivery">("all");

  // New states for printing, filtering and alerts
  const [newOrderAlert, setNewOrderAlert] = useState<StoredOrder | null>(null);
  const knownOrderIds = useRef<Set<string>>(new Set());
  const stickyNotificationRef = useRef<Notification | null>(null);

  // Filters and sorting for menu items showcase
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [menuCatFilter, setMenuCatFilter] = useState("all");
  const [menuSortOption, setMenuSortOption] = useState("default");

  // Admin authentication states
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [notificationPermission, setNotificationPermission] = useState<string>("default");

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (frequency: number, startTime: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(frequency, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = audioCtx.currentTime;
      playTone(659.25, now, 0.4);       // E5
      playTone(880.00, now + 0.15, 0.6); // A5
    } catch (e) {
      console.error("Failed to play synthesized notification sound:", e);
    }
  };

  const handlePrintReceipt = (order: StoredOrder) => {
    const isPaymentConfirmed = window.confirm(`Has payment been confirmed for Order #${order.id}?`);
    if (!isPaymentConfirmed) return;

    const allItems = order.mode === "dine-in"
      ? order.persons.flatMap(p => p.cart)
      : order.deliveryCart;
    const totalQty = allItems.reduce((s, c) => s + c.quantity, 0);
    const subtotal = allItems.reduce((s, c) => s + c.price * c.quantity, 0);
    const orderTaxRate = (order.mode === "delivery" && order.taxRate !== undefined) ? order.taxRate : 0;
    const orderTaxAmount = orderTaxRate > 0 ? (order.taxAmount !== undefined ? order.taxAmount : (order.totalAmount - subtotal > 0 ? order.totalAmount - subtotal : 0)) : 0;

    const formattedDate = new Date(order.timestamp).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const printWindow = window.open("", "_blank", "width=600,height=800");
    if (!printWindow) {
      alert("Popup blocked! Please allow popups to print receipts.");
      return;
    }

    const itemsHtml = order.mode === "dine-in"
      ? order.persons.map(p => `
          <div style="margin-top: 8px; font-weight: bold; border-bottom: 1px dashed #ccc; padding-bottom: 2px;">
            ${p.name}'s Plate:
          </div>
          ${p.cart.map(c => `
            <div style="display: flex; justify-content: space-between; font-size: 13px; margin: 4px 0 4px 10px;">
              <span>${c.name} x${c.quantity}</span>
              <span>₦${(c.price * c.quantity).toLocaleString("en-NG")}</span>
            </div>
          `).join("")}
        `).join("")
      : order.deliveryCart.map(c => `
          <div style="display: flex; justify-content: space-between; font-size: 13px; margin: 6px 0;">
            <span>${c.name} x${c.quantity}</span>
            <span>₦${(c.price * c.quantity).toLocaleString("en-NG")}</span>
          </div>
        `).join("");

    const serviceHtml = order.mode === "dine-in"
      ? `<div><strong>Table Number:</strong> ${order.tableNumber}</div>`
      : `<div>
          <strong>Receiver:</strong> ${order.deliveryInfo?.name || "N/A"} (${order.deliveryInfo?.phone || "N/A"})<br/>
          <strong>Address:</strong> ${order.deliveryInfo?.address || "N/A"}<br/>
          ${order.pin ? `<strong>PIN:</strong> ${order.pin}` : ""}
         </div>`;

    printWindow.document.write(`
      <html>
        <head>
          <title>YOLO BITES - Receipt #${order.id}</title>
          <style>
            @media print {
              body { margin: 0; padding: 10px; }
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              color: #000;
              background: #fff;
              padding: 20px;
              max-width: 400px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .title {
              font-size: 22px;
              font-weight: bold;
              margin: 0 0 4px 0;
              letter-spacing: 1px;
            }
            .subtitle {
              font-size: 11px;
              margin: 0;
              color: #555;
            }
            .meta {
              font-size: 12px;
              line-height: 1.5;
              margin-bottom: 12px;
              border-bottom: 1px dashed #000;
              padding-bottom: 12px;
            }
            .items {
              margin-bottom: 12px;
              border-bottom: 2px dashed #000;
              padding-bottom: 12px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              font-weight: bold;
              margin-top: 8px;
            }
            .footer {
              text-align: center;
              font-size: 11px;
              margin-top: 20px;
              border-top: 1px dashed #ccc;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">YOLO BITES</div>
            <div class="subtitle">Taste it. Love it. Control it.</div>
            <div class="subtitle">Barnawa, Kaduna South</div>
          </div>
          <div class="meta">
            <div><strong>Order Ref:</strong> #${order.id}</div>
            <div><strong>Date:</strong> ${formattedDate}</div>
            <div><strong>Service Type:</strong> ${order.mode.toUpperCase()}</div>
            <div style="margin-top: 6px;">${serviceHtml}</div>
            <div><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()} (${order.status === "completed" ? "Paid" : "Pending"})</div>
          </div>
          <div class="items">
            <div style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 4px; display: flex; justify-content: space-between; font-size: 12px;">
              <span>Item Description</span>
              <span>Price</span>
            </div>
            ${itemsHtml}
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
              <span>Total Qty:</span>
              <span>${totalQty}</span>
            </div>
            ${orderTaxRate > 0 ? `
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 4px;">
              <span>Subtotal:</span>
              <span>₦${subtotal.toLocaleString("en-NG")}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 2px;">
              <span>Tax / VAT (${orderTaxRate}%):</span>
              <span>₦${orderTaxAmount.toLocaleString("en-NG")}</span>
            </div>
            ` : ""}
            <div class="total-row">
              <span>GRAND TOTAL</span>
              <span>₦${order.totalAmount.toLocaleString("en-NG")}</span>
            </div>
          </div>
          <div class="footer">
            <strong>Thank you for dining with us!</strong><br/>
            Please attach this ticket to the pack.
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const loadAllData = async () => {
    const supabase = createClient();
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

      // Fetch orders
      const { data: ords, error: ordsError } = await supabase
        .from("yolo_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordsError) throw ordsError;

      if (cats && cats.length > 0) {
        const settingsRow = cats.find((c: any) => c.id === "system_settings");
        if (settingsRow) {
          try {
            const settingsObj = JSON.parse(settingsRow.label);
            if (settingsObj.tablesCount !== undefined) {
              setTablesCount(settingsObj.tablesCount);
              localStorage.setItem("yolo_tables_count", String(settingsObj.tablesCount));
            }
            if (settingsObj.storeOpen !== undefined) {
              setStoreOpen(settingsObj.storeOpen);
              localStorage.setItem("yolo_store_open", JSON.stringify(settingsObj.storeOpen));
            }
            if (settingsObj.taxRate !== undefined) {
              setTaxRate(settingsObj.taxRate);
              localStorage.setItem("yolo_tax_rate", String(settingsObj.taxRate));
            }
          } catch (e) {
            console.error("Failed to parse system settings row:", e);
          }
        }
        const filteredCats = cats.filter((c: any) => c.id !== "system_settings");
        setCategories(filteredCats);
      } else {
        const cleanDefaultCats = defaultCategories.map(c => ({ id: c.id, label: c.label }));
        const { error } = await supabase.from("yolo_categories").insert(cleanDefaultCats);
        if (!error) setCategories(cleanDefaultCats);
      }

      if (menu && menu.length > 0) {
        const normalized = normalizeMenu(menu);
        setMenuItems(normalized);
        localStorage.setItem("yolo_menu_items", JSON.stringify(normalized));
      } else {
        const cleanDefaultMenu = normalizeMenu(defaultMenuItems).map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          description: item.description,
          image: item.image
        }));
        const { error } = await supabase.from("yolo_menu_items").insert(cleanDefaultMenu);
        if (!error) {
          setMenuItems(cleanDefaultMenu);
          localStorage.setItem("yolo_menu_items", JSON.stringify(cleanDefaultMenu));
        }
      }

      if (ords) {
        const mappedOrders: StoredOrder[] = ords.map((o: any) => ({
          id: o.id,
          pin: o.pin,
          mode: o.mode,
          tableNumber: o.table_number,
          personCount: o.person_count,
          persons: o.persons || [],
          deliveryCart: o.delivery_cart || [],
          deliveryInfo: o.delivery_info,
          paymentMethod: o.payment_method,
          status: o.status,
          totalAmount: getNumericPrice(o.total_amount),
          timestamp: o.created_at || o.timestamp,
          taxRate: o.tax_rate !== undefined && o.tax_rate !== null ? getNumericPrice(o.tax_rate) : 0,
          taxAmount: o.tax_amount !== undefined && o.tax_amount !== null ? getNumericPrice(o.tax_amount) : 0
        }));

        // Trigger standard modal alert on screen only for brand new orders
        if (knownOrderIds.current.size > 0) {
          const newOrders = mappedOrders.filter(o => !knownOrderIds.current.has(o.id));
          if (newOrders.length > 0) {
            const newestPending = newOrders.find(o => o.status === "pending");
            if (newestPending) {
              setNewOrderAlert(newestPending);
            }
            newOrders.forEach(o => knownOrderIds.current.add(o.id));
          }
        } else {
          mappedOrders.forEach(o => knownOrderIds.current.add(o.id));
        }

        // Sticky system notifications & sound alert based on any active pending orders
        const pendingOrders = mappedOrders.filter(o => o.status === "pending");
        if (pendingOrders.length > 0) {
          playNotificationSound();

          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            try {
              const bodyText = pendingOrders.length === 1
                ? `Order #${pendingOrders[0].id} (${pendingOrders[0].mode === "delivery" ? "Delivery" : `Table ${pendingOrders[0].tableNumber}`}) is waiting for review.`
                : `You have ${pendingOrders.length} pending orders waiting for review. Click to inspect.`;

              if (stickyNotificationRef.current) {
                stickyNotificationRef.current.close();
              }

              stickyNotificationRef.current = new Notification("🔔 Pending Orders Alert", {
                body: bodyText,
                icon: "/images/logo.jpeg",
                tag: "yolo-pending-orders",
                requireInteraction: true
              });
            } catch (err) {
              console.error("Failed to display sticky notification:", err);
            }
          }
        } else {
          // Dismiss sticky notification if no pending orders remain
          if (stickyNotificationRef.current) {
            stickyNotificationRef.current.close();
            stickyNotificationRef.current = null;
          }
        }

        setOrders(mappedOrders);
      }
      setDbError(null);

    } catch (err: any) {
      const formatted = formatError(err);
      console.error("Error loading Supabase data, using localStorage fallback:", formatted);
      setDbError({
        message: formatted.message || (typeof formatted === "string" ? formatted : JSON.stringify(formatted)) || "Unknown Connection Error",
        details: formatted.details || "",
        hint: formatted.hint || "",
        code: formatted.code || ""
      });
      const storedOrders = localStorage.getItem("yolo_orders");
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedMenu = localStorage.getItem("yolo_menu_items");
      if (storedMenu) {
        const parsed = JSON.parse(storedMenu);
        const hasStaleBurgers = parsed.some((item: any) => 
          item.category === "burger" && !item.image.includes("single_burger") && !item.image.includes("double_burger")
        );
        if (hasStaleBurgers) {
          localStorage.removeItem("yolo_menu_items");
          setMenuItems(normalizeMenu(defaultMenuItems));
        } else {
          setMenuItems(normalizeMenu(parsed));
        }
      } else {
        setMenuItems(normalizeMenu(defaultMenuItems));
      }

      const storedCats = localStorage.getItem("yolo_categories");
      if (storedCats) {
        setCategories(JSON.parse(storedCats));
      } else {
        setCategories(defaultCategories);
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const sessionAuth = sessionStorage.getItem("yolo_admin_auth");
      if (sessionAuth === "true") {
        setIsAuthenticated(true);
      }
    }

    loadAllData();

    const storedStoreStatus = localStorage.getItem("yolo_store_open");
    if (storedStoreStatus) setStoreOpen(JSON.parse(storedStoreStatus));

    const storedTables = localStorage.getItem("yolo_tables_count");
    if (storedTables) setTablesCount(parseInt(storedTables) || 6);

    const storedTaxRate = localStorage.getItem("yolo_tax_rate");
    if (storedTaxRate) setTaxRate(parseFloat(storedTaxRate) || 0);

    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    return () => {
      if (stickyNotificationRef.current) {
        stickyNotificationRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === "default") {
        Notification.requestPermission().then((res) => {
          setNotificationPermission(res);
          if (res === "granted") {
            try {
              new Notification("🍕 Notifications Enabled", {
                body: "You will now receive desktop notifications for new orders!",
                icon: "/images/logo.jpeg"
              });
            } catch (e) {
              console.error(e);
            }
          }
        });
      }
    }

    const interval = setInterval(() => {
      loadAllData();
    }, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "Bites@123#") {
      setIsAuthenticated(true);
      sessionStorage.setItem("yolo_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Access Denied: Invalid System Code");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("yolo_admin_auth");
    setPasscode("");
  };

  const syncSystemSettings = async (newTablesCount: number, newStoreOpen: boolean, newTaxRate?: number) => {
    const supabase = createClient();
    const activeTaxRate = newTaxRate !== undefined ? newTaxRate : taxRate;
    try {
      await supabase.from("yolo_categories").delete().eq("id", "system_settings");
      await supabase.from("yolo_categories").insert({
        id: "system_settings",
        label: JSON.stringify({ tablesCount: newTablesCount, storeOpen: newStoreOpen, taxRate: activeTaxRate })
      });
    } catch (err) {
      console.error("Failed to sync system settings to database:", err);
    }
  };

  const handleIncrementTables = () => {
    const nextVal = tablesCount + 1;
    setTablesCount(nextVal);
    localStorage.setItem("yolo_tables_count", String(nextVal));
    syncSystemSettings(nextVal, storeOpen);
  };

  const handleDecrementTables = () => {
    if (tablesCount > 1) {
      const nextVal = tablesCount - 1;
      setTablesCount(nextVal);
      localStorage.setItem("yolo_tables_count", String(nextVal));
      syncSystemSettings(nextVal, storeOpen);
    }
  };

  // Helper: Save fallbacks to localStorage if DB fails
  const saveOrders = (updatedOrders: StoredOrder[]) => {
    setOrders(updatedOrders);
    localStorage.setItem("yolo_orders", JSON.stringify(updatedOrders));
  };

  const saveMenu = (updatedMenu: MenuItem[]) => {
    setMenuItems(updatedMenu);
    localStorage.setItem("yolo_menu_items", JSON.stringify(updatedMenu));
  };

  const saveCategories = (updatedCats: { id: string; label: string }[] | any) => {
    setCategories(updatedCats);
    localStorage.setItem("yolo_categories", JSON.stringify(updatedCats));
  };

  const handleToggleStore = () => {
    const nextVal = !storeOpen;
    setStoreOpen(nextVal);
    localStorage.setItem("yolo_store_open", JSON.stringify(nextVal));
    syncSystemSettings(tablesCount, nextVal);
  };

  const handleIncrementTax = () => {
    const nextVal = parseFloat(Math.min(100, taxRate + 0.5).toFixed(2));
    setTaxRate(nextVal);
    localStorage.setItem("yolo_tax_rate", String(nextVal));
    syncSystemSettings(tablesCount, storeOpen, nextVal);
  };

  const handleDecrementTax = () => {
    const nextVal = parseFloat(Math.max(0, taxRate - 0.5).toFixed(2));
    setTaxRate(nextVal);
    localStorage.setItem("yolo_tax_rate", String(nextVal));
    syncSystemSettings(tablesCount, storeOpen, nextVal);
  };

  // ── Seeding and Reset ───────────────────────────────────────────
  const seedMockOrders = async () => {
    const today = new Date();
    const mock: StoredOrder[] = [
      {
        id: "DINE-82",
        pin: null,
        mode: "dine-in",
        tableNumber: 3,
        personCount: 2,
        persons: [
          {
            name: "Emeka",
            cart: [
              { id: "pizza-1", name: "Truffle Emperor Pizza", category: "pizza", price: 12500, description: "", image: "/images/yolo_pizza.png", quantity: 1 }
            ]
          },
          {
            name: "Aisha",
            cart: [
              { id: "shawarma-1", name: "Kaduna Spicy Double Wrap", category: "shawarma", price: 4500, description: "", image: "/images/sharwama.jpeg", quantity: 1 }
            ]
          }
        ],
        deliveryCart: [],
        deliveryInfo: null,
        paymentMethod: "transfer",
        status: "completed",
        totalAmount: 17000,
        timestamp: new Date(today.getTime() - 1000 * 60 * 120).toISOString()
      },
      {
        id: "DEL-41A",
        pin: "4820",
        mode: "delivery",
        tableNumber: null,
        personCount: 1,
        persons: [],
        deliveryCart: [
          { id: "pizza-2", name: "Smoked Wagyu Gold Pizza", category: "pizza", price: 15000, description: "", image: "/images/yolo_pizza.png", quantity: 1 },
          { id: "parfaits-2", name: "Mango Passionfruit Crunch", category: "parfaits", price: 4000, description: "", image: "/images/yolo_parfaits.png", quantity: 2 }
        ],
        deliveryInfo: {
          name: "John Danladi",
          phone: "08031234567",
          address: "No 14 Constitution Rd, Kaduna South"
        },
        paymentMethod: "card",
        status: "completed",
        totalAmount: 23000,
        timestamp: new Date(today.getTime() - 1000 * 60 * 600).toISOString()
      },
      {
        id: "DINE-09",
        pin: null,
        mode: "dine-in",
        tableNumber: 5,
        personCount: 3,
        persons: [
          {
            name: "Zainab",
            cart: [
              { id: "shawarma-2", name: "Truffle Chicken Shawarma", category: "shawarma", price: 5200, description: "", image: "/images/sharwama.jpeg", quantity: 2 }
            ]
          },
          {
            name: "Abubakar",
            cart: [
              { id: "mocktails-1", name: "Barnawa Sunset Cooler", category: "mocktails", price: 3500, description: "", image: "/images/cocktails.jpeg", quantity: 1 }
            ]
          },
          {
            name: "Fatima",
            cart: [
              { id: "pastries-2", name: "Salted Caramel Pecan Tart", category: "pastries", price: 3800, description: "", image: "/images/yolo_pastries.png", quantity: 1 }
            ]
          }
        ],
        deliveryCart: [],
        deliveryInfo: null,
        paymentMethod: "transfer",
        status: "pending",
        totalAmount: 17700,
        timestamp: new Date().toISOString()
      },
      {
        id: "DEL-88F",
        pin: "1109",
        mode: "delivery",
        tableNumber: null,
        personCount: 1,
        persons: [],
        deliveryCart: [
          { id: "chops-1", name: "YOLO Royal Chops Platter", category: "chops", price: 7500, description: "", image: "/images/yolo_chops.png", quantity: 2 },
          { id: "mocktails-2", name: "Golden Pineapple Elixir", category: "mocktails", price: 3800, description: "", image: "/images/cocktails.jpeg", quantity: 2 }
        ],
        deliveryInfo: {
          name: "Dr. Aliyu",
          phone: "08129876543",
          address: "Flat 4, Command Guest House, Barnawa"
        },
        paymentMethod: "cash",
        status: "preparing",
        totalAmount: 22600,
        timestamp: new Date().toISOString()
      },
      {
        id: "DEL-02X",
        pin: "9451",
        mode: "delivery",
        tableNumber: null,
        personCount: 1,
        persons: [],
        deliveryCart: [
          { id: "pastries-1", name: "Glazed Raspberry Croissant", category: "pastries", price: 3000, description: "", image: "/images/yolo_pastries.png", quantity: 3 }
        ],
        deliveryInfo: {
          name: "Grace Pam",
          phone: "09055566677",
          address: "Aroma Junction, Barnawa, Kaduna"
        },
        paymentMethod: "transfer",
        status: "cancelled",
        totalAmount: 9000,
        timestamp: new Date(today.getTime() - 1000 * 60 * 1440 * 2).toISOString()
      },
      {
        id: "DINE-44",
        pin: null,
        mode: "dine-in",
        tableNumber: 1,
        personCount: 1,
        persons: [
          {
            name: "Bisi",
            cart: [
              { id: "chops-2", name: "Kaduna Suya Beef Skewers", category: "chops", price: 6000, description: "", image: "/images/yolo_chops.png", quantity: 1 }
            ]
          }
        ],
        deliveryCart: [],
        deliveryInfo: null,
        paymentMethod: "cash",
        status: "completed",
        totalAmount: 6000,
        timestamp: new Date(today.getTime() - 1000 * 60 * 1440 * 3).toISOString()
      }
    ];

    const supabase = createClient();
    try {
      const dbOrders = mock.map(o => ({
        id: o.id,
        pin: o.pin,
        mode: o.mode,
        table_number: o.tableNumber,
        person_count: o.personCount,
        persons: o.persons,
        delivery_cart: o.deliveryCart,
        delivery_info: o.deliveryInfo,
        payment_method: o.paymentMethod,
        status: o.status,
        total_amount: o.totalAmount,
        created_at: o.timestamp
      }));

      const { error } = await supabase.from("yolo_orders").insert(dbOrders);
      if (error) throw error;

      // Reload
      const { data: ords } = await supabase.from("yolo_orders").select("*").order("created_at", { ascending: false });
      if (ords) {
        const mappedOrders: StoredOrder[] = ords.map((o: any) => ({
          id: o.id,
          pin: o.pin,
          mode: o.mode,
          tableNumber: o.table_number,
          personCount: o.person_count,
          persons: o.persons || [],
          deliveryCart: o.delivery_cart || [],
          deliveryInfo: o.delivery_info,
          paymentMethod: o.payment_method,
          status: o.status,
          totalAmount: getNumericPrice(o.total_amount),
          timestamp: o.created_at || o.timestamp,
          taxRate: o.tax_rate !== undefined && o.tax_rate !== null ? getNumericPrice(o.tax_rate) : 0,
          taxAmount: o.tax_amount !== undefined && o.tax_amount !== null ? getNumericPrice(o.tax_amount) : 0
        }));
        setOrders(mappedOrders);
      }
      alert("Mock orders successfully seeded to Supabase!");
    } catch (err) {
      console.error("Failed seeding orders in Supabase, falling back to local storage:", err);
      saveOrders([...mock, ...orders]);
      alert("Mock orders seeded to local storage!");
    }
  };

  const resetSystem = async () => {
    if (confirm("Are you sure you want to reset all data (orders, custom menu items, custom categories) back to system defaults in the cloud database?")) {
      const supabase = createClient();
      try {
        await supabase.from("yolo_orders").delete().neq("id", "placeholder");
        await supabase.from("yolo_menu_items").delete().neq("id", "placeholder");
        await supabase.from("yolo_categories").delete().neq("id", "placeholder");

        const cleanDefaultCats = defaultCategories.map(c => ({ id: c.id, label: c.label }));
        await supabase.from("yolo_categories").insert(cleanDefaultCats);
        setCategories(cleanDefaultCats);

        const cleanDefaultMenu = normalizeMenu(defaultMenuItems).map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          description: item.description,
          image: item.image
        }));
        await supabase.from("yolo_menu_items").insert(cleanDefaultMenu);
        setMenuItems(cleanDefaultMenu);

        setOrders([]);
        setStoreOpen(true);
        localStorage.setItem("yolo_store_open", "true");
        alert("System successfully reset in Supabase!");
      } catch (err) {
        console.error("Error resetting Supabase database, falling back to local reset:", err);
        setOrders([]);
        localStorage.removeItem("yolo_orders");
        saveMenu(defaultMenuItems);
        saveCategories(defaultCategories);
        setStoreOpen(true);
        localStorage.setItem("yolo_store_open", "true");
        alert("System reset in local storage fallback!");
      }
    }
  };

  const clearOrderHistory = async () => {
    const password = prompt("Enter passcode to confirm clearing all order history:");
    if (password === null) return;
    if (password !== "Reg4social@123#") {
      alert("Verification failed: Incorrect security passcode.");
      return;
    }

    const supabase = createClient();
    try {
      const { error } = await supabase.from("yolo_orders").delete().neq("id", "placeholder");
      if (error) throw error;

      setOrders([]);
      localStorage.removeItem("yolo_orders");
      knownOrderIds.current = new Set();
      if (stickyNotificationRef.current) {
        stickyNotificationRef.current.close();
        stickyNotificationRef.current = null;
      }
      alert("All order history cleared successfully!");
    } catch (err) {
      console.error("Error clearing orders from Supabase, falling back to local clear:", err);
      setOrders([]);
      localStorage.removeItem("yolo_orders");
      knownOrderIds.current = new Set();
      if (stickyNotificationRef.current) {
        stickyNotificationRef.current.close();
        stickyNotificationRef.current = null;
      }
      alert("Order history cleared from local fallback (Supabase query failed).");
    }
  };

  // ── Financial and Analytical Computations ───────────────────────
  const completedOrders = orders.filter(o => o.status === "completed");
  const totalSales = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  
  const averageOrderValue = completedOrders.length > 0 ? totalSales / completedOrders.length : 0;
  
  const pendingCount = orders.filter(o => o.status === "pending").length;
  const preparingCount = orders.filter(o => o.status === "preparing").length;
  const activeOrdersCount = pendingCount + preparingCount;

  const dineInRevenue = completedOrders.filter(o => o.mode === "dine-in").reduce((s, o) => s + o.totalAmount, 0);
  const deliveryRevenue = completedOrders.filter(o => o.mode === "delivery").reduce((s, o) => s + o.totalAmount, 0);
  const totalCompletedRev = dineInRevenue + deliveryRevenue;
  const dineInPercentage = totalCompletedRev > 0 ? (dineInRevenue / totalCompletedRev) * 100 : 0;
  const deliveryPercentage = totalCompletedRev > 0 ? (deliveryRevenue / totalCompletedRev) * 100 : 0;

  const revTransfer = completedOrders.filter(o => o.paymentMethod === "transfer").reduce((s, o) => s + o.totalAmount, 0);
  const revCard = completedOrders.filter(o => o.paymentMethod === "card").reduce((s, o) => s + o.totalAmount, 0);
  const revCash = completedOrders.filter(o => o.paymentMethod === "cash").reduce((s, o) => s + o.totalAmount, 0);
  const totalPaymentRev = revTransfer + revCard + revCash;

  const itemSalesMap: Record<string, { item: MenuItem | CartItem; qty: number; revenue: number }> = {};
  completedOrders.forEach(order => {
    const items = order.mode === "dine-in" ? order.persons.flatMap(p => p.cart) : order.deliveryCart;
    items.forEach(c => {
      if (!itemSalesMap[c.id]) {
        itemSalesMap[c.id] = { item: c, qty: 0, revenue: 0 };
      }
      itemSalesMap[c.id].qty += c.quantity;
      itemSalesMap[c.id].revenue += getNumericPrice(c.price) * c.quantity;
    });
  });

  const topSellingItems = Object.values(itemSalesMap).sort((a, b) => b.qty - a.qty);

  const categorySalesMap: Record<string, number> = {};
  completedOrders.forEach(order => {
    const items = order.mode === "dine-in" ? order.persons.flatMap(p => p.cart) : order.deliveryCart;
    items.forEach(c => {
      const cat = c.category || "uncategorized";
      categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (getNumericPrice(c.price) * c.quantity);
    });
  });

  // Filter and Sort menu items showcase
  const filteredAndSortedMenuItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(menuSearchQuery.toLowerCase());
      const matchesCategory = menuCatFilter === "all" || item.category === menuCatFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (menuSortOption === "price-asc") {
        return getNumericPrice(a.price) - getNumericPrice(b.price);
      }
      if (menuSortOption === "price-desc") {
        return getNumericPrice(b.price) - getNumericPrice(a.price);
      }
      if (menuSortOption === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (menuSortOption === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      return 0; // Default Order
    });

  const highestCatRevenue = Math.max(...Object.values(categorySalesMap), 1);

  // ── Live Orders Filter Logic ────────────────────────────────────
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    const matchesService = orderServiceFilter === "all" || o.mode === orderServiceFilter;
    const searchLower = orderSearchQuery.toLowerCase();
    const matchesRef = o.id.toLowerCase().includes(searchLower);
    
    let matchesName = false;
    if (o.mode === "delivery" && o.deliveryInfo?.name.toLowerCase().includes(searchLower)) {
      matchesName = true;
    } else if (o.mode === "dine-in") {
      matchesName = o.persons.some(p => p.name.toLowerCase().includes(searchLower));
    }

    return matchesStatus && matchesService && (matchesRef || matchesName);
  });

  // ── Order Action Handlers ───────────────────────────────────────
  const handleOrderStatusChange = async (orderId: string, newStatus: StoredOrder["status"]) => {
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("yolo_orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      if (error) throw error;

      const updated = orders.map(o => {
        if (o.id === orderId) return { ...o, status: newStatus };
        return o;
      });
      setOrders(updated);
    } catch (err) {
      console.error("Failed to update status in Supabase, falling back to local state:", err);
      const updated = orders.map(o => {
        if (o.id === orderId) return { ...o, status: newStatus };
        return o;
      });
      saveOrders(updated);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm(`Delete Order #${orderId} permanently?`)) {
      const supabase = createClient();
      try {
        const { error } = await supabase.from("yolo_orders").delete().eq("id", orderId);
        if (error) throw error;

        const updated = orders.filter(o => o.id !== orderId);
        setOrders(updated);
      } catch (err) {
        console.error("Failed to delete order in Supabase, falling back to local state:", err);
        const updated = orders.filter(o => o.id !== orderId);
        saveOrders(updated);
      }
    }
  };

  // ── Categories Action Handlers ──────────────────────────────────
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatId || !newCatLabel) return alert("Please fill in all fields.");
    
    const cleanId = newCatId.toLowerCase().trim().replace(/\s+/g, "-");
    const exists = categories.some(c => c.id === cleanId);
    if (exists) return alert("Category ID already exists.");

    const newCat = { id: cleanId, label: newCatLabel.trim() };
    const supabase = createClient();
    try {
      const { error } = await supabase.from("yolo_categories").insert(newCat);
      if (error) throw error;
      setCategories([...categories, newCat]);
    } catch (err) {
      console.error("Failed to insert category in Supabase, falling back to local state:", err);
      saveCategories([...categories, newCat]);
    }

    setNewCatId("");
    setNewCatLabel("");
  };

  const handleDeleteCategory = async (catId: string) => {
    if (catId === "all") return alert("Cannot delete default filter category.");
    if (confirm(`Are you sure you want to delete category "${catId}"? This will not delete items, but they will be left uncategorized.`)) {
      const supabase = createClient();
      try {
        const { error } = await supabase.from("yolo_categories").delete().eq("id", catId);
        if (error) throw error;

        const updated = categories.filter(c => c.id !== catId);
        setCategories(updated);
      } catch (err) {
        console.error("Failed to delete category in Supabase, falling back to local state:", err);
        const updated = categories.filter(c => c.id !== catId);
        saveCategories(updated);
      }
    }
  };

  // ── Menu Items Action Handlers ──────────────────────────────────
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItemImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrEditMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemDescription) return alert("All fields are required.");
    
    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum) || priceNum <= 0) return alert("Price must be a valid positive number.");

    const supabase = createClient();

    if (editingItemId) {
      // Edit mode
      const updatedItem = {
        name: newItemName.trim(),
        category: newItemCategory,
        price: priceNum,
        description: newItemDescription.trim(),
        image: newItemImage
      };

      try {
        const { error } = await supabase.from("yolo_menu_items").update(updatedItem).eq("id", editingItemId);
        if (error) throw error;

        const updated = menuItems.map(item => {
          if (item.id === editingItemId) return { ...item, ...updatedItem };
          return item;
        });
        setMenuItems(updated);
        setEditingItemId(null);
      } catch (err) {
        console.error("Failed to edit menu item in Supabase, falling back to local state:", err);
        const updated = menuItems.map(item => {
          if (item.id === editingItemId) return { ...item, ...updatedItem };
          return item;
        });
        saveMenu(updated);
        setEditingItemId(null);
      }
    } else {
      // Create mode
      const newItem: MenuItem = {
        id: `custom-item-${Date.now()}`,
        name: newItemName.trim(),
        category: newItemCategory,
        price: priceNum,
        description: newItemDescription.trim(),
        image: newItemImage
      };

      try {
        const { error } = await supabase.from("yolo_menu_items").insert(newItem);
        if (error) throw error;
        setMenuItems([newItem, ...menuItems]);
      } catch (err) {
        console.error("Failed to create menu item in Supabase, falling back to local state:", err);
        saveMenu([newItem, ...menuItems]);
      }
    }

    setNewItemName("");
    setNewItemPrice("");
    setNewItemDescription("");
    setNewItemImage("/images/yolo_pizza.png");
    setImageType("preset");
  };

  const handleStartEditItem = (item: MenuItem) => {
    setEditingItemId(item.id);
    setNewItemName(item.name);
    setNewItemCategory(item.category);
    setNewItemPrice(item.price.toString());
    setNewItemDescription(item.description);
    setNewItemImage(item.image);
    if (item.image.startsWith("data:")) {
      setImageType("upload");
    } else {
      setImageType("preset");
    }
    document.getElementById("menu-form-container")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (confirm("Delete this menu item permanently?")) {
      const supabase = createClient();
      try {
        const { error } = await supabase.from("yolo_menu_items").delete().eq("id", itemId);
        if (error) throw error;
        const updated = menuItems.filter(item => item.id !== itemId);
        setMenuItems(updated);
      } catch (err) {
        console.error("Failed to delete menu item in Supabase, falling back to local state:", err);
        const updated = menuItems.filter(item => item.id !== itemId);
        saveMenu(updated);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Soft Background Glows */}
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-primary-red/5 rounded-full blur-[130px] -z-10" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-luxury-gold/5 rounded-full blur-[130px] -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md p-8 rounded-3xl glass-card border border-white/5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold mb-4 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Admin Room Lock
            </h2>
            <p className="text-[10px] text-warm-ivory/40 mt-1.5 uppercase tracking-[0.25em] font-bold">
              YOLO BITES CONTROL CENTRE
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="passcode" className="text-[10px] font-bold uppercase tracking-widest text-warm-ivory/50 block">
                Enter System Passcode
              </label>
              <div className="relative">
                <input
                  id="passcode"
                  type={showPasscode ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••••••••"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-warm-ivory/20 text-sm font-mono tracking-widest focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition duration-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-ivory/40 hover:text-white transition"
                  title={showPasscode ? "Hide Passcode" : "Show Passcode"}
                >
                  {showPasscode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {authError && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>{authError}</span>
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-luxury-gold hover:bg-luxury-gold/90 text-deep-black font-bold uppercase tracking-wider text-xs transition duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2"
            >
              Unlock Terminal
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link 
              href="/" 
              className="text-[10px] text-warm-ivory/30 hover:text-white uppercase tracking-widest transition duration-300"
            >
              ← Back to Dining Room
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-warm-ivory pb-20">
      
      {/* ── NEW ORDER ALERT SYSTEM & PENDING COUNT WIDGET ──────────────── */}
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-24 left-6 z-50 w-[90%] sm:w-[380px] bg-deep-black/95 backdrop-blur-xl border border-luxury-gold/50 rounded-3xl p-6 shadow-[0_15px_40px_rgba(212,175,55,0.25)] flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-luxury-gold/20 border border-luxury-gold/40 flex items-center justify-center shrink-0 text-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.2)] animate-bounce">
              <ShoppingBag className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-white font-serif text-base font-bold">New Order! 🍕</h4>
                <span className="text-[9px] bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  {pendingCount} Pending
                </span>
              </div>
              <p className="text-warm-ivory/80 text-xs">
                Order <strong className="text-luxury-gold">#{newOrderAlert.id}</strong> is waiting for review.
              </p>
              <div className="text-[10px] text-warm-ivory/50 flex flex-col gap-0.5 mt-2">
                <span><strong>Type:</strong> {newOrderAlert.mode === "dine-in" ? `Dine-in (Table ${newOrderAlert.tableNumber})` : "Delivery"}</span>
                <span><strong>Total:</strong> {formatPrice(newOrderAlert.totalAmount)}</span>
              </div>
              <div className="flex gap-2.5 pt-3">
                <button
                  onClick={() => {
                    setActiveTab("orders");
                    setOrderStatusFilter("all");
                    setOrderSearchQuery(newOrderAlert.id);
                    setNewOrderAlert(null);
                  }}
                  className="px-4 py-2 bg-luxury-gold hover:bg-luxury-gold/90 text-deep-black text-xs font-bold rounded-xl uppercase tracking-wider transition-colors duration-300"
                >
                  View Order
                </button>
                <button
                  onClick={() => setNewOrderAlert(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-warm-ivory/60 hover:text-white border border-white/5 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors duration-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-warm-ivory/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PERSISTENT PENDING ORDERS FLOATING WIDGET (LEFT SIDE) ── */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => {
            setActiveTab("orders");
            setOrderStatusFilter("pending");
            setOrderSearchQuery("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl backdrop-blur-xl border transition-all duration-500 shadow-2xl hover:scale-105 group text-left ${
            pendingCount > 0
              ? "bg-deep-black/90 border-luxury-gold/40 shadow-luxury-gold/10 hover:border-luxury-gold hover:shadow-luxury-gold/20"
              : "bg-deep-black/70 border-white/10 shadow-black/40 hover:border-white/20"
          }`}
        >
          <div className="relative flex items-center justify-center shrink-0">
            {pendingCount > 0 ? (
              <>
                <span className="absolute inline-flex h-8 w-8 rounded-full bg-luxury-gold/30 animate-ping" />
                <div className="relative w-8 h-8 rounded-xl bg-luxury-gold/20 border border-luxury-gold/40 flex items-center justify-center text-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.2)] font-mono font-black text-sm">
                  {pendingCount}
                </div>
              </>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-warm-ivory/30 font-mono font-semibold text-xs">
                0
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            <h4 className="text-white font-serif text-xs font-bold flex items-center gap-1.5">
              <span>Pending Queue</span>
              {pendingCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
              )}
            </h4>
            <p className="text-[9px] text-warm-ivory/40 uppercase tracking-wider font-bold">
              {pendingCount > 0 ? `${pendingCount} orders to process` : "All clear"}
            </p>
          </div>

          <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-warm-ivory/40 group-hover:bg-luxury-gold group-hover:text-deep-black transition-all duration-300">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>
      
      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 glass-nav py-4 px-6 md:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-warm-ivory/80 hover:text-white transition-colors flex items-center justify-center"
            title="Go Back Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-luxury-gold/50 shadow-md">
              <img src="/images/logo.jpeg" alt="YOLO BITES" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold tracking-wider text-white">YOLO BITES</h1>
                <span className="text-[10px] bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
              <p className="text-[10px] text-warm-ivory/40 uppercase tracking-[0.2em]">Taste it. Love it. Control it.</p>
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-4 self-end md:self-auto">
          <button 
            onClick={handleToggleStore}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              storeOpen 
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${storeOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
            Store: {storeOpen ? "Open for Orders" : "Closed"}
          </button>

          <span className="text-xs text-warm-ivory/30 font-medium hidden sm:inline font-mono">
            {new Date().toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" })}
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 border border-white/10 text-warm-ivory/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300"
            title="Lock Control Centre (Logout)"
          >
            <Ban className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-8">
        
        {/* ── TAB NAVIGATION ────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 mb-8">
          {[
            { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
            { id: "orders", label: `Orders (${filteredOrders.length})`, icon: FileText },
            { id: "categories", label: "Categories", icon: Layers },
            { id: "menu", label: "Menu Items Builder", icon: Grid },
            { id: "settings", label: "System Controls", icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-luxury-gold text-deep-black font-bold shadow-[0_4px_15px_rgba(212,175,55,0.25)] scale-[1.02]"
                    : "bg-white/5 text-warm-ivory/50 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Supabase Diagnostics Panel */}
        {dbError && (
          <div className="mb-8 p-6 rounded-3xl bg-red-950/20 border border-red-500/25 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[40px] rounded-full" />
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/15 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    Supabase Schema & Connection Diagnostics
                  </h3>
                  <p className="text-xs text-warm-ivory/50 mt-1">
                    The system has automatically activated <strong>Local Storage Fallback Mode</strong> because it could not sync with Supabase.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5 font-mono text-xs text-red-400">
                  <div><strong className="text-white/60">Error Message:</strong> {dbError.message}</div>
                  {dbError.code && <div><strong className="text-white/60">Postgres Code:</strong> {dbError.code}</div>}
                  {dbError.details && <div><strong className="text-white/60">Details:</strong> {dbError.details}</div>}
                  {dbError.hint && <div><strong className="text-white/60">Hint:</strong> {dbError.hint}</div>}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-luxury-gold block">
                    How to fix this:
                  </span>
                  <p className="text-xs text-warm-ivory/70 leading-relaxed">
                    This error usually occurs when the required tables are missing in your Supabase project or when Row-Level Security (RLS) is restricting access. To resolve it, go to your <strong>Supabase Dashboard</strong>, open the <strong>SQL Editor</strong>, and run the following script:
                  </p>
                </div>

                <div className="relative">
                  <pre className="p-4 rounded-xl bg-black/60 border border-white/5 text-[11px] text-warm-ivory/80 font-mono overflow-x-auto max-h-48 whitespace-pre leading-relaxed select-all">
{`-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.yolo_categories (
    id text PRIMARY KEY,
    label text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.yolo_menu_items (
    id text PRIMARY KEY,
    name text NOT NULL,
    category text REFERENCES public.yolo_categories(id) ON DELETE SET NULL,
    price numeric NOT NULL,
    description text,
    image text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.yolo_orders (
    id text PRIMARY KEY,
    pin text,
    mode text NOT NULL,
    table_number integer,
    person_count integer DEFAULT 1,
    persons jsonb DEFAULT '[]'::jsonb,
    delivery_cart jsonb DEFAULT '[]'::jsonb,
    delivery_info jsonb,
    payment_method text NOT NULL,
    status text DEFAULT 'pending'::text,
    total_amount numeric NOT NULL,
    tax_rate numeric DEFAULT 0,
    tax_amount numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.yolo_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yolo_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yolo_orders ENABLE ROW LEVEL SECURITY;

-- 3. Create public RLS policies
CREATE POLICY "Allow public read" ON public.yolo_categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.yolo_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.yolo_categories FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON public.yolo_menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.yolo_menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.yolo_menu_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.yolo_menu_items FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON public.yolo_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.yolo_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.yolo_orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.yolo_orders FOR DELETE USING (true);`}
                  </pre>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.yolo_categories (
    id text PRIMARY KEY,
    label text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.yolo_menu_items (
    id text PRIMARY KEY,
    name text NOT NULL,
    category text REFERENCES public.yolo_categories(id) ON DELETE SET NULL,
    price numeric NOT NULL,
    description text,
    image text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.yolo_orders (
    id text PRIMARY KEY,
    pin text,
    mode text NOT NULL,
    table_number integer,
    person_count integer DEFAULT 1,
    persons jsonb DEFAULT '[]'::jsonb,
    delivery_cart jsonb DEFAULT '[]'::jsonb,
    delivery_info jsonb,
    payment_method text NOT NULL,
    status text DEFAULT 'pending'::text,
    total_amount numeric NOT NULL,
    tax_rate numeric DEFAULT 0,
    tax_amount numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.yolo_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yolo_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yolo_orders ENABLE ROW LEVEL SECURITY;

-- 3. Create public RLS policies
CREATE POLICY "Allow public read" ON public.yolo_categories FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.yolo_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.yolo_categories FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON public.yolo_menu_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.yolo_menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.yolo_menu_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.yolo_menu_items FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON public.yolo_orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.yolo_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.yolo_orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.yolo_orders FOR DELETE USING (true);`);
                        alert("SQL Script copied to clipboard!");
                      }}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white uppercase tracking-wider transition"
                    >
                      Copy SQL
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400 uppercase tracking-wider transition-all duration-300"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Connection
                  </button>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-warm-ivory/70 uppercase tracking-wider transition-all duration-300"
                  >
                    Go to Supabase
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB PANEL CONTENTS ────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ANALYTICS & REPORTS */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Sales */}
                <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden group hover:border-luxury-gold/30 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-gold/5 blur-[30px] rounded-full" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold">Total Sales Revenue</span>
                    <div className="w-9 h-9 rounded-xl bg-luxury-gold/15 flex items-center justify-center text-luxury-gold">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white text-neon-gold">
                    {formatPrice(totalSales)}
                  </h3>
                  <p className="text-[10px] text-warm-ivory/40 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    From {completedOrders.length} completed orders
                  </p>
                </div>

                {/* Average Order Value (AOV) */}
                <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden group hover:border-primary-red/30 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-red/5 blur-[30px] rounded-full" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary-red font-bold">Average Order Value</span>
                    <div className="w-9 h-9 rounded-xl bg-primary-red/15 flex items-center justify-center text-primary-red">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {formatPrice(averageOrderValue)}
                  </h3>
                  <p className="text-[10px] text-warm-ivory/40 mt-2">
                    Average revenue per customer order
                  </p>
                </div>

                {/* Total Orders Split */}
                <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden group hover:border-blue-400/30 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[30px] rounded-full" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">Dine-In vs Delivery</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">
                        {orders.filter(o => o.mode === "dine-in").length} / {orders.filter(o => o.mode === "delivery").length}
                      </h3>
                      <p className="text-[10px] text-warm-ivory/40 mt-2 font-mono">
                        Dine-In orders vs. Deliveries
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md font-mono">
                      {totalOrdersCount} Total
                    </span>
                  </div>
                </div>

                {/* Active Orders */}
                <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden group hover:border-amber-400/30 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-[30px] rounded-full" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400 font-bold">Active Orders Queue</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
                      <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {activeOrdersCount}
                  </h3>
                  <p className="text-[10px] text-warm-ivory/40 mt-2 flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping" />
                    {pendingCount} Pending · {preparingCount} Preparing
                  </p>
                </div>
              </div>

              {/* Graphical Performance Splits */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 1. Category Revenue split chart */}
                <div className="glass-card rounded-3xl border border-white/5 p-6 md:p-8 space-y-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Revenue by Category</h3>
                    <p className="text-xs text-warm-ivory/40 mt-1">Breakdown of total income generated per category</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {categories.filter(c => c.id !== "all").map(cat => {
                      const rev = categorySalesMap[cat.id] || 0;
                      const percentage = totalSales > 0 ? (rev / totalSales) * 100 : 0;
                      return (
                        <div key={cat.id} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-warm-ivory/80 capitalize">{cat.label}</span>
                            <span className="text-white font-mono">{formatPrice(rev)} <span className="text-luxury-gold/50 ml-1">({percentage.toFixed(1)}%)</span></span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-primary-red to-luxury-gold rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                    {completedOrders.length === 0 && (
                      <div className="text-center py-6 text-warm-ivory/20 text-xs italic">
                        No sales recorded yet. Seed mock data to preview metrics.
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Order Mode & Payment Splits */}
                <div className="glass-card rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">Order Mode & Payments</h3>
                    <p className="text-xs text-warm-ivory/40 mt-1">Split analytics between checkout flows and payment methods</p>
                  </div>

                  {/* Mode split */}
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold block mb-1">Dine-In vs Delivery Income</span>
                    <div className="flex h-6 rounded-2xl overflow-hidden text-[9px] font-bold uppercase text-deep-black tracking-wider">
                      {dineInRevenue > 0 && (
                        <motion.div 
                          initial={{ flexGrow: 0 }} 
                          animate={{ flexGrow: dineInRevenue }} 
                          className="bg-luxury-gold flex items-center justify-center px-3 min-w-[30px]"
                          title={`Dine-In: ${formatPrice(dineInRevenue)}`}
                        >
                          Dine In ({dineInPercentage.toFixed(0)}%)
                        </motion.div>
                      )}
                      {deliveryRevenue > 0 && (
                        <motion.div 
                          initial={{ flexGrow: 0 }} 
                          animate={{ flexGrow: deliveryRevenue }} 
                          className="bg-primary-red text-white flex items-center justify-center px-3 min-w-[30px]"
                          title={`Delivery: ${formatPrice(deliveryRevenue)}`}
                        >
                          Delivery ({deliveryPercentage.toFixed(0)}%)
                        </motion.div>
                      )}
                      {totalSales === 0 && (
                        <div className="w-full bg-white/5 text-warm-ivory/30 flex items-center justify-center">
                          No sales data
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-warm-ivory/50">
                      <span className="flex items-center gap-1.5"><UtensilsCrossed className="w-3.5 h-3.5 text-luxury-gold" /> Dine-In: {formatPrice(dineInRevenue)}</span>
                      <span className="flex items-center gap-1.5"><Bike className="w-3.5 h-3.5 text-primary-red" /> Delivery: {formatPrice(deliveryRevenue)}</span>
                    </div>
                  </div>

                  {/* Payment method progress bars */}
                  <div className="space-y-3.5 border-t border-white/5 pt-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-luxury-gold font-bold block">Payment Breakdown</span>
                    
                    <div className="space-y-3">
                      {[
                        { method: "Bank Transfer", icon: Smartphone, val: revTransfer, color: "bg-blue-400" },
                        { method: "Card Terminal", icon: CreditCard, val: revCard, color: "bg-luxury-gold" },
                        { method: "Cash Payments", icon: Banknote, val: revCash, color: "bg-emerald-400" },
                      ].map(item => {
                        const pct = totalPaymentRev > 0 ? (item.val / totalPaymentRev) * 100 : 0;
                        const Icon = item.icon;
                        return (
                          <div key={item.method} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-warm-ivory/60 shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-grow space-y-1">
                              <div className="flex justify-between text-xs font-medium">
                                <span>{item.method}</span>
                                <span className="font-mono text-white">{formatPrice(item.val)} <span className="text-white/30 ml-0.5 text-[10px]">({pct.toFixed(0)}%)</span></span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  className={`h-full ${item.color} rounded-full`}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard: Top Selling Items */}
              <div className="glass-card rounded-3xl border border-white/5 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                      <Award className="w-5 h-5 text-luxury-gold animate-bounce" /> Top Selling Items Leaderboard
                    </h3>
                    <p className="text-xs text-warm-ivory/40 mt-1">Signature plates ranked by quantity ordered in completed sales</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-warm-ivory/40 font-bold">
                        <th className="pb-3 font-semibold">Rank</th>
                        <th className="pb-3 font-semibold">Item Details</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold text-center">Qty Sold</th>
                        <th className="pb-3 font-semibold text-right">Revenue Generated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {topSellingItems.map((record, index) => (
                        <tr key={record.item.id} className="group hover:bg-white/[0.01] transition-all">
                          <td className="py-4">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                              index === 0 ? "bg-luxury-gold text-deep-black shadow-[0_0_10px_rgba(212,175,55,0.4)]" :
                              index === 1 ? "bg-slate-300 text-deep-black" :
                              index === 2 ? "bg-amber-600 text-white" : "text-warm-ivory/40"
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-4 font-semibold">
                            <div className="flex items-center gap-3">
                              <img src={record.item.image} alt={record.item.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                              <span className="text-white group-hover:text-luxury-gold transition-colors">{record.item.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-xs font-semibold text-warm-ivory/60 uppercase tracking-wider capitalize">{record.item.category}</td>
                          <td className="py-4 text-center font-bold font-mono text-white text-base">{record.qty}</td>
                          <td className="py-4 text-right font-serif font-bold text-luxury-gold text-neon-gold text-base">{formatPrice(record.revenue)}</td>
                        </tr>
                      ))}
                      {topSellingItems.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-warm-ivory/30 italic">
                            No orders completed yet. Items will automatically stack here once orders are processed.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: LIVE ORDERS LIST */}
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              
              {/* Order Filtering Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/5 rounded-3xl p-5">
                
                {/* Search input */}
                <div className="relative w-full lg:w-72">
                  <input
                    type="text"
                    placeholder="Search by Ref ID or Customer Name..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-deep-black border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-luxury-gold transition-colors text-warm-ivory placeholder:text-warm-ivory/30 font-medium"
                  />
                  {orderSearchQuery && (
                    <button onClick={() => setOrderSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-ivory/40 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status Filter buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { id: "all", label: "All Status" },
                    { id: "pending", label: "Pending" },
                    { id: "preparing", label: "Preparing" },
                    { id: "completed", label: "Completed" },
                    { id: "cancelled", label: "Cancelled" },
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setOrderStatusFilter(filter.id)}
                      className={`px-3.5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all duration-200 border ${
                        orderStatusFilter === filter.id
                          ? "bg-white text-deep-black font-extrabold border-white shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                          : `bg-white/5 text-warm-ivory/60 border-white/5 hover:text-white hover:bg-white/10`
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Service Type Filter buttons */}
                <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5 shrink-0">
                  {[
                    { id: "all", label: "All Service", icon: Grid },
                    { id: "dine-in", label: "Dine In", icon: UtensilsCrossed },
                    { id: "delivery", label: "Delivery", icon: Bike },
                  ].map(filter => {
                    const Icon = filter.icon;
                    const isActive = orderServiceFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setOrderServiceFilter(filter.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1 ${
                          isActive
                            ? "bg-luxury-gold text-deep-black font-extrabold shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
                            : "text-warm-ivory/50 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{filter.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.map(order => {
                  const isDineIn = order.mode === "dine-in";
                  const dateObj = new Date(order.timestamp);
                  const formattedDate = dateObj.toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  });

                  const totalItemsQty = isDineIn
                    ? order.persons.flatMap(p => p.cart).reduce((sum, c) => sum + c.quantity, 0)
                    : order.deliveryCart.reduce((sum, c) => sum + c.quantity, 0);

                  return (
                    <motion.div
                      layout
                      key={order.id}
                      className={`glass-card rounded-3xl border p-6 flex flex-col md:flex-row md:items-start gap-6 transition-all duration-400 ${
                        order.status === "pending" ? "border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.03)]" :
                        order.status === "preparing" ? "border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.03)]" :
                        order.status === "completed" ? "border-emerald-500/20" : "border-red-500/10 opacity-70"
                      }`}
                    >
                      
                      {/* Left: Metadata Details */}
                      <div className="md:w-64 space-y-4 shrink-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-luxury-gold tracking-widest text-lg font-mono">
                            #{order.id}
                          </h4>
                          <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                            order.status === "pending" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                            order.status === "preparing" ? "bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse" :
                            order.status === "completed" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            "bg-red-500/10 border-red-500/20 text-red-400"
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Type Badge */}
                        <div className="text-xs space-y-1">
                          <p className="text-warm-ivory/40 uppercase text-[9px] tracking-wider font-semibold">Service Type</p>
                          <div className="flex items-center gap-1.5 font-bold text-white uppercase text-[10px]">
                            {isDineIn ? (
                              <><UtensilsCrossed className="w-3.5 h-3.5 text-luxury-gold" /> Dine In · Table {order.tableNumber}</>
                            ) : (
                              <><Bike className="w-3.5 h-3.5 text-primary-red" /> Delivery</>
                            )}
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="text-xs space-y-1">
                          <p className="text-warm-ivory/40 uppercase text-[9px] tracking-wider font-semibold">Payment Status</p>
                          <p className="font-semibold text-white/80 flex items-center gap-1">
                            {order.paymentMethod === "transfer" ? <Smartphone className="w-3.5 h-3.5 text-blue-400" /> : 
                             order.paymentMethod === "card" ? <CreditCard className="w-3.5 h-3.5 text-luxury-gold" /> :
                             <Banknote className="w-3.5 h-3.5 text-emerald-400" />}
                            {order.paymentMethod.toUpperCase()} · {order.status === "completed" ? "Settled" : "Processing"}
                          </p>
                        </div>

                        {/* Timestamp */}
                        <p className="text-[10px] text-warm-ivory/30 font-mono">
                          {formattedDate}
                        </p>
                      </div>

                      {/* Middle: Items Summary & Customer Info */}
                      <div className="flex-grow space-y-4">
                        
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2 text-xs">
                          {isDineIn ? (
                            <div>
                              <span className="text-[9px] font-bold text-luxury-gold uppercase tracking-wider block mb-1">Guests ({order.personCount})</span>
                              <div className="flex flex-wrap gap-2">
                                {order.persons.map((p, idx) => (
                                  <span key={idx} className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg font-medium text-white">
                                    {p.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            order.deliveryInfo && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <span className="text-[9px] font-bold text-primary-red uppercase tracking-wider block">Receiver</span>
                                  <span className="text-white font-medium">{order.deliveryInfo.name} ({order.deliveryInfo.phone})</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-bold text-primary-red uppercase tracking-wider block">Address</span>
                                  <span className="text-warm-ivory/70 block truncate" title={order.deliveryInfo.address}>{order.deliveryInfo.address}</span>
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        {/* Items breakdown list */}
                        <div className="space-y-2">
                          <p className="text-[9px] font-bold text-warm-ivory/40 uppercase tracking-wider">Ordered Items ({totalItemsQty})</p>
                          <div className="divide-y divide-white/5 bg-white/[0.01] rounded-2xl p-3 border border-white/5">
                            {isDineIn ? (
                              order.persons.map((person, pIdx) => (
                                <div key={pIdx} className="py-2.5 first:pt-1 last:pb-1">
                                  <p className="text-[11px] font-bold text-luxury-gold mb-1">{person.name}'s Plate:</p>
                                  <div className="space-y-1 pl-2.5">
                                    {person.cart.map((c, cIdx) => (
                                      <div key={cIdx} className="flex items-center justify-between text-xs">
                                        <span className="text-warm-ivory/80">{c.name} <span className="text-white/40 text-[10px]">×{c.quantity}</span></span>
                                        <span className="text-white font-mono font-medium">{formatPrice(c.price * c.quantity)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              order.deliveryCart.map((c, cIdx) => (
                                <div key={cIdx} className="flex items-center justify-between text-xs py-1.5 first:pt-0.5 last:pb-0.5">
                                  <span className="text-warm-ivory/80">{c.name} <span className="text-white/40 text-[10px]">×{c.quantity}</span></span>
                                  <span className="text-white font-mono font-medium">{formatPrice(c.price * c.quantity)}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions, Pin & Total */}
                      <div className="md:w-56 flex flex-col justify-between items-end gap-4 shrink-0 text-right self-stretch">
                        
                        <div>
                          {order.mode === "delivery" && order.taxRate !== undefined && order.taxRate > 0 && (
                            <div className="text-right text-[10px] text-warm-ivory/50 space-y-0.5 mb-1.5 font-mono">
                              <div>Subtotal: {formatPrice(order.totalAmount - (order.taxAmount || 0))}</div>
                              <div>VAT ({order.taxRate}%): {formatPrice(order.taxAmount || 0)}</div>
                            </div>
                          )}
                          <p className="text-[9px] font-semibold text-warm-ivory/40 uppercase tracking-wider mb-0.5">Grand Total</p>
                          <p className="font-serif font-bold text-2xl text-luxury-gold text-neon-gold">
                            {formatPrice(order.totalAmount)}
                          </p>
                          
                          {!isDineIn && order.pin && (
                            <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px]">
                              <span className="text-warm-ivory/40">PIN:</span>
                              <span className="font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded font-extrabold text-white tracking-widest">{order.pin}</span>
                            </div>
                          )}
                        </div>

                        {/* Status Actions */}
                        <div className="w-full space-y-2">
                          <p className="text-[9px] font-semibold text-warm-ivory/40 uppercase tracking-wider text-right mb-1">Update Status</p>
                          <div className="flex gap-1.5 justify-end">
                            {order.status !== "preparing" && order.status !== "completed" && order.status !== "cancelled" && (
                              <button
                                onClick={() => handleOrderStatusChange(order.id, "preparing")}
                                className="px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                              >
                                <Play className="w-3 h-3" /> Prepare
                              </button>
                            )}
                            {order.status !== "completed" && order.status !== "cancelled" && (
                              <button
                                onClick={() => handleOrderStatusChange(order.id, "completed")}
                                className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                              >
                                <Check className="w-3 h-3" /> Complete
                              </button>
                            )}
                            {order.status !== "cancelled" && order.status !== "completed" && (
                              <button
                                onClick={() => handleOrderStatusChange(order.id, "cancelled")}
                                className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                              >
                                <Ban className="w-3 h-3" /> Cancel
                              </button>
                            )}
                          </div>

                          <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                            <button
                              onClick={() => handlePrintReceipt(order)}
                              className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-warm-ivory/40 hover:text-white hover:bg-white/10 transition-colors"
                              title="Print Invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 rounded-lg bg-red-500/5 border border-red-500/10 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete Order Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}

                {filteredOrders.length === 0 && (
                  <div className="glass-card rounded-3xl border border-white/5 p-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-7 h-7 text-warm-ivory/20" />
                    </div>
                    <h4 className="text-white font-bold text-sm">No Orders Found</h4>
                    <p className="text-xs text-warm-ivory/40 max-w-xs mx-auto">
                      We couldn't find any orders matching status "{orderStatusFilter}" and search query "{orderSearchQuery}".
                    </p>
                    <button 
                      onClick={() => { setOrderStatusFilter("all"); setOrderSearchQuery(""); }}
                      className="px-4 py-2 bg-luxury-gold text-deep-black font-semibold text-xs rounded-xl uppercase tracking-wider transition-all"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* TAB 3: CATEGORIES MANAGEMENT */}
          {activeTab === "categories" && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              
              {/* Form panel: Add Category */}
              <div className="lg:col-span-1 glass-card rounded-3xl border border-white/5 p-6 md:p-8 space-y-6 self-start">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-luxury-gold" /> Create Item Category
                  </h3>
                  <p className="text-xs text-warm-ivory/40 mt-1">Add a new filter segment for menu and ordering</p>
                </div>

                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-warm-ivory/50">Category ID (Unique)</label>
                    <input
                      type="text"
                      placeholder="e.g. burgers, drinks, soups"
                      value={newCatId}
                      onChange={(e) => setNewCatId(e.target.value)}
                      className="w-full bg-deep-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-warm-ivory focus:outline-none focus:border-luxury-gold transition-colors font-medium placeholder:text-white/10"
                    />
                    <p className="text-[9px] text-warm-ivory/30">ID will be converted to lower-case with hyphens.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-warm-ivory/50">Display Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Gourmet Burgers, Cold Drinks"
                      value={newCatLabel}
                      onChange={(e) => setNewCatLabel(e.target.value)}
                      className="w-full bg-deep-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-warm-ivory focus:outline-none focus:border-luxury-gold transition-colors font-medium placeholder:text-white/10"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-luxury-gold text-deep-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 hover:scale-[1.01] shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
                  >
                    Add Category
                  </button>
                </form>
              </div>

              {/* List panel: Categories List */}
              <div className="lg:col-span-2 glass-card rounded-3xl border border-white/5 p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Categories List</h3>
                  <p className="text-xs text-warm-ivory/40 mt-1">Available active tags in the store ordering system</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map(cat => {
                    const isSystemDefault = cat.id === "all" || cat.id === "pizza" || cat.id === "shawarma";
                    const itemsCount = menuItems.filter(item => item.category === cat.id).length;
                    return (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-luxury-gold/20 transition-all duration-300"
                      >
                        <div>
                          <p className="font-semibold text-sm text-white capitalize">{cat.label}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-mono text-warm-ivory/30 bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-wider">{cat.id}</span>
                            <span className="text-[9px] text-warm-ivory/40">{itemsCount} item{itemsCount > 1 || itemsCount === 0 ? "s" : ""}</span>
                          </div>
                        </div>

                        {!isSystemDefault ? (
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 bg-red-500/5 hover:bg-red-500/10 text-red-400/60 hover:text-red-400 rounded-xl transition-colors border border-red-500/5 hover:border-red-500/10"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[9px] font-bold text-luxury-gold/50 bg-luxury-gold/5 border border-luxury-gold/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            System
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 4: MENU ITEMS BUILDER */}
          {activeTab === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              
              {/* Form panel: Add/Edit Menu Item */}
              <div id="menu-form-container" className="lg:col-span-1 glass-card rounded-3xl border border-white/5 p-6 md:p-8 space-y-6 self-start">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-luxury-gold" /> 
                    {editingItemId ? "Edit Menu Plate" : "Create Menu Plate"}
                  </h3>
                  <p className="text-xs text-warm-ivory/40 mt-1">Define details for menu cards displayed to customers</p>
                </div>

                <form onSubmit={handleAddOrEditMenuItem} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-warm-ivory/50">Item Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Royal Pepperoni Pizza"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full bg-deep-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-warm-ivory focus:outline-none focus:border-luxury-gold transition-colors font-medium placeholder:text-white/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-warm-ivory/50">Category</label>
                      <select
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value)}
                        className="w-full bg-deep-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-warm-ivory focus:outline-none focus:border-luxury-gold transition-colors font-medium select-custom capitalize"
                      >
                        {categories.filter(c => c.id !== "all").map(c => (
                          <option key={c.id} value={c.id} className="bg-deep-black text-warm-ivory capitalize">
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-warm-ivory/50">Price (₦)</label>
                      <input
                        type="number"
                        placeholder="Price"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="w-full bg-deep-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-warm-ivory focus:outline-none focus:border-luxury-gold transition-colors font-medium placeholder:text-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-warm-ivory/50">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Write ingredients or description..."
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                      className="w-full bg-deep-black border border-white/10 rounded-xl px-4 py-2.5 text-sm text-warm-ivory focus:outline-none focus:border-luxury-gold transition-colors font-medium placeholder:text-white/10 resize-none"
                    />
                  </div>

                  {/* Image Options */}
                  <div className="space-y-3.5 border-t border-white/5 pt-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-warm-ivory/50">Item Image</label>
                      <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/5">
                        <button
                          type="button"
                          onClick={() => { setImageType("preset"); setNewItemImage("/images/yolo_pizza.png"); }}
                          className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors ${
                            imageType === "preset" ? "bg-luxury-gold text-deep-black" : "text-warm-ivory/50 hover:text-white"
                          }`}
                        >
                          Presets
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageType("upload")}
                          className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-colors ${
                            imageType === "upload" ? "bg-luxury-gold text-deep-black" : "text-warm-ivory/50 hover:text-white"
                          }`}
                        >
                          Upload File
                        </button>
                      </div>
                    </div>

                    {/* Presets Mode */}
                    {imageType === "preset" ? (
                      <div className="grid grid-cols-3 gap-2">
                        {presetImages.map(img => {
                          const isSelected = newItemImage === img.url;
                          return (
                            <button
                              key={img.name}
                              type="button"
                              onClick={() => setNewItemImage(img.url)}
                              className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all ${
                                isSelected ? "border-luxury-gold scale-105" : "border-transparent opacity-60 hover:opacity-100"
                              }`}
                            >
                              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                                <span className="text-[8px] font-bold uppercase tracking-wider text-white">{img.name}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      // Custom Upload Mode
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-center border border-dashed border-white/20 rounded-xl p-4 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <div className="text-center space-y-1">
                            <Upload className="w-5 h-5 text-luxury-gold mx-auto" />
                            <p className="text-[10px] text-warm-ivory/50">Click to choose image file</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preview box */}
                    <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                      <img src={newItemImage} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-luxury-gold">Active Image Selection</p>
                        <p className="text-[10px] text-warm-ivory/40 truncate max-w-[160px]" title={newItemImage}>
                          {newItemImage.startsWith("data:") ? "Custom base64 image data" : newItemImage}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    {editingItemId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItemId(null);
                          setNewItemName("");
                          setNewItemPrice("");
                          setNewItemDescription("");
                          setNewItemImage("/images/yolo_pizza.png");
                          setImageType("preset");
                        }}
                        className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-warm-ivory border border-white/10 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`py-3 bg-luxury-gold text-deep-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 hover:scale-[1.01] shadow-[0_4px_15px_rgba(212,175,55,0.2)] ${
                        editingItemId ? "w-2/3" : "w-full"
                      }`}
                    >
                      {editingItemId ? "Save Changes" : "Publish Plate"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Grid panel: Menu Items Showcase */}
              <div className="lg:col-span-2 glass-card rounded-3xl border border-white/5 p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">Menu Items Showcase</h3>
                    <p className="text-xs text-warm-ivory/40 mt-1">Current collection of active plates offered in the shop</p>
                  </div>
                </div>

                {/* Showcase Filtering & Sorting Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                  {/* Search */}
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-warm-ivory/40 block mb-1">Search Showcase</label>
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={menuSearchQuery}
                      onChange={(e) => setMenuSearchQuery(e.target.value)}
                      className="w-full bg-deep-black border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-luxury-gold transition-colors text-warm-ivory placeholder:text-white/10"
                    />
                  </div>

                  {/* Filter Category */}
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-warm-ivory/40 block mb-1">Category Filter</label>
                    <select
                      value={menuCatFilter}
                      onChange={(e) => setMenuCatFilter(e.target.value)}
                      className="w-full bg-deep-black border border-white/10 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-luxury-gold transition-colors text-warm-ivory capitalize"
                    >
                      <option value="all">All Categories</option>
                      {categories.filter(c => c.id !== "all").map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-warm-ivory/40 block mb-1">Sort Showcase</label>
                    <select
                      value={menuSortOption}
                      onChange={(e) => setMenuSortOption(e.target.value)}
                      className="w-full bg-deep-black border border-white/10 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-luxury-gold transition-colors text-warm-ivory"
                    >
                      <option value="default">Default (Newly Added)</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-y-auto max-h-[800px] pr-2">
                  {filteredAndSortedMenuItems.map(item => (
                    <div
                      key={item.id}
                      className="flex bg-white/[0.02] border border-white/5 rounded-2xl p-4 gap-4 hover:border-luxury-gold/20 transition-all duration-300 group"
                    >
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0" />
                      <div className="flex-grow min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-semibold text-sm text-white group-hover:text-luxury-gold transition-colors truncate">{item.name}</h4>
                            <span className="font-mono font-bold text-xs text-luxury-gold shrink-0 whitespace-nowrap">
                              {typeof item.price === "number" ? formatPrice(item.price) : item.price}
                            </span>
                          </div>
                          <span className="text-[8px] font-bold text-warm-ivory/40 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded border border-white/5 capitalize inline-block mt-0.5">
                            {item.category}
                          </span>
                          <p className="text-[10px] text-warm-ivory/50 mt-1.5 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Card controls */}
                        <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-white/5">
                          <button
                            onClick={() => handleStartEditItem(item)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 text-warm-ivory/40 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="p-1.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-400/60 hover:text-red-400 rounded-lg transition-colors flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredAndSortedMenuItems.length === 0 && (
                    <div className="col-span-2 text-center py-16 text-warm-ivory/30 italic">
                      No menu items found. Adjust filters or create new plates on the left.
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 5: SYSTEM CONTROLS */}
          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto glass-card rounded-3xl border border-white/5 p-6 md:p-8 space-y-8"
            >
              
              <div>
                <h3 className="font-serif text-xl font-bold text-white">System Controls</h3>
                <p className="text-xs text-warm-ivory/40 mt-1">Manage state settings, data seeding, and system reset functions</p>
              </div>

              <div className="space-y-6">
                
                {/* 1. Toggle Store status */}
                <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-white">Store Availability Switch</p>
                    <p className="text-xs text-warm-ivory/40 max-w-sm">Toggles store open status banner across front page and checkout screens.</p>
                  </div>
                  <button
                    onClick={handleToggleStore}
                    className="p-1.5 hover:scale-105 transition-transform"
                  >
                    {storeOpen ? (
                      <CheckCircle className="w-9 h-9 text-emerald-400" />
                    ) : (
                      <X className="w-9 h-9 text-red-400" />
                    )}
                  </button>
                </div>

                {/* Dining Tables Count setup */}
                <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-white">Dining Room Tables Count</p>
                    <p className="text-xs text-warm-ivory/40 max-w-sm">Set the total number of dining tables in the venue for Dine-In selections.</p>
                  </div>
                  <div className="flex items-center gap-3.5 bg-deep-black/60 border border-white/10 px-4 py-2 rounded-xl shrink-0">
                    <button
                      onClick={handleDecrementTables}
                      disabled={tablesCount <= 1}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-serif text-lg font-bold text-luxury-gold w-6 text-center select-none font-mono">
                      {tablesCount}
                    </span>
                    <button
                      onClick={handleIncrementTables}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* VAT / Tax Percentage setup */}
                <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-white">VAT / Tax Percentage (%)</p>
                    <p className="text-xs text-warm-ivory/40 max-w-sm">Configure the VAT / tax percentage rate applied to client orders at checkout.</p>
                  </div>
                  <div className="flex items-center gap-3.5 bg-deep-black/60 border border-white/10 px-4 py-2 rounded-xl shrink-0">
                    <button
                      onClick={handleDecrementTax}
                      disabled={taxRate <= 0}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-serif text-lg font-bold text-luxury-gold w-14 text-center select-none font-mono">
                      {taxRate}%
                    </span>
                    <button
                      onClick={handleIncrementTax}
                      disabled={taxRate >= 100}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Desktop System Notifications Control */}
                <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-white">Desktop System Notifications</p>
                    <p className="text-xs text-warm-ivory/40 max-w-sm">Receive instant OS alert popups on your PC when new customer orders arrive.</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {typeof window !== "undefined" && "Notification" in window ? (
                      notificationPermission === "granted" ? (
                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Enabled
                        </div>
                      ) : notificationPermission === "denied" ? (
                        <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-bold uppercase tracking-wider">
                          Blocked in Browser
                        </div>
                      ) : (
                        <button
                          onClick={async () => {
                            const result = await Notification.requestPermission();
                            if (result === "granted") {
                              try {
                                new Notification("🍕 Notifications Enabled", {
                                  body: "You will now receive desktop notifications for new orders!",
                                  icon: "/images/logo.jpeg"
                                });
                              } catch (e) {
                                console.error(e);
                              }
                            }
                            setNotificationPermission(result);
                          }}
                          className="px-4 py-2.5 bg-primary-red hover:bg-primary-red/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(225,29,72,0.2)] transition-all cursor-pointer"
                        >
                          Enable Notifications
                        </button>
                      )
                    ) : (
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-warm-ivory/40 text-xs font-bold uppercase tracking-wider">
                        Not Supported
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Seed database */}
                <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-white">Seed Simulation Orders</p>
                    <p className="text-xs text-warm-ivory/40 max-w-sm">Inserts 6 realistic Dine-In & Delivery orders with timestamps, totals, and statuses to preview dashboard statistics.</p>
                  </div>
                  <button
                    onClick={() => { seedMockOrders(); }}
                    className="px-4 py-2.5 bg-luxury-gold hover:bg-luxury-gold/90 text-deep-black rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(212,175,55,0.2)] transition-all shrink-0 cursor-pointer"
                  >
                    Seed Mock Orders
                  </button>
                </div>

                {/* Clear Order History */}
                <div className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-white">Clear Order History</p>
                    <p className="text-xs text-warm-ivory/40 max-w-sm">Deletes all client order history from both the Supabase cloud database and local fallback caches. Requires passcode confirmation.</p>
                  </div>
                  <button
                    onClick={clearOrderHistory}
                    className="px-4 py-2.5 bg-primary-red hover:bg-primary-red/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(225,29,72,0.2)] transition-all shrink-0 cursor-pointer"
                  >
                    Clear Orders
                  </button>
                </div>

                {/* 3. Reset database */}
                <div className="flex items-center justify-between p-5 bg-red-500/[0.01] border border-red-500/10 rounded-2xl hover:border-red-500/20 transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-red-400">Purge System Data</p>
                    <p className="text-xs text-red-400/40 max-w-sm">Erases all data in local storage (orders, custom menu items, and categories) and restarts settings to default presets.</p>
                  </div>
                  <button
                    onClick={resetSystem}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-[0_4px_15px_rgba(239,68,68,0.15)] transition-all shrink-0"
                  >
                    Purge & Reset
                  </button>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
