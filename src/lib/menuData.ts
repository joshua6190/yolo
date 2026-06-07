export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
}

export const menuItems: MenuItem[] = [
  // SHAWARMA (CHICKEN)
  {
    id: "sh-ck-1",
    name: "Chicken Shawarma (Without Sausage)",
    category: "shawarma",
    price: 4000,
    description: "Classic wraps loaded with marinated chicken strips, vegetables, and creamy dressing.",
    image: "/images/sharwama.jpeg"
  },
  {
    id: "sh-ck-2",
    name: "Chicken Shawarma (Single Sausage)",
    category: "shawarma",
    price: 4500,
    description: "Premium chicken wrap with one grilled sausage and house-made spices.",
    image: "/images/sharwama.jpeg"
  },
  {
    id: "sh-ck-3",
    name: "Chicken Shawarma (Double Sausage)",
    category: "shawarma",
    price: 5000,
    description: "Tender chicken wraps with two grilled sausages and mixed cream sauce.",
    image: "/images/sharwama.jpeg"
  },
  // SHAWARMA (BEEF)
  {
    id: "sh-bf-1",
    name: "Beef Shawarma (Without Sausage)",
    category: "shawarma",
    price: 4000,
    description: "Savory slow-roasted spicy beef wraps with fresh veggies and custom sauce.",
    image: "/images/sharwama.jpeg"
  },
  {
    id: "sh-bf-2",
    name: "Beef Shawarma (Single Sausage)",
    category: "shawarma",
    price: 4500,
    description: "Spicy beef wrap containing one grilled sausage and special local spices.",
    image: "/images/sharwama.jpeg"
  },
  {
    id: "sh-bf-3",
    name: "Beef Shawarma (Double Sausage)",
    category: "shawarma",
    price: 5000,
    description: "Double sausage, roasted beef slices, cabbage, and creamy dressing wrap.",
    image: "/images/sharwama.jpeg"
  },
  // SMALL CHOPS
  {
    id: "sc-1",
    name: "Samosa",
    category: "chops",
    price: 2000,
    description: "Crispy triangular pastry filled with spiced minced meat and vegetables.",
    image: "/images/yolo_chops.png"
  },
  {
    id: "sc-2",
    name: "Spring Rolls",
    category: "chops",
    price: 2000,
    description: "Crispy fried wraps packed with seasonal vegetables and seasoning.",
    image: "/images/yolo_chops.png"
  },
  {
    id: "sc-3",
    name: "Puff Puff",
    category: "chops",
    price: 2000,
    description: "Soft, fluffy, golden-brown fried local dough balls.",
    image: "/images/yolo_chops.png"
  },
  {
    id: "sc-4",
    name: "Meat Pie",
    category: "chops",
    price: 1500,
    description: "Flaky pastry crust stuffed with savory minced beef, potatoes, and carrots.",
    image: "/images/yolo_chops.png"
  },
  {
    id: "sc-5",
    name: "Pancake",
    category: "chops",
    price: 1500,
    description: "Soft, warm, classic thin pancakes.",
    image: "/images/yolo_chops.png"
  },
  {
    id: "sc-6",
    name: "Waffles",
    category: "chops",
    price: 2000,
    description: "Freshly-baked grid waffles, crispy outside and soft inside.",
    image: "/images/yolo_chops.png"
  },
  {
    id: "sc-7",
    name: "Spicy Wings",
    category: "chops",
    price: 4500,
    description: "Crunchy fried wings tossed in sweet and hot chili sauce.",
    image: "/images/yolo_chops.png"
  },
  {
    id: "sc-8",
    name: "Grilled Wings",
    category: "chops",
    price: 4500,
    description: "Barbecue-style flame grilled chicken wings seasoned with local herbs.",
    image: "/images/yolo_chops.png"
  },
  {
    id: "sc-9",
    name: "Gizzard",
    category: "chops",
    price: 4500,
    description: "Peppered skewered gizzards grilled to perfection.",
    image: "/images/yolo_chops.png"
  },
  // FRIES
  {
    id: "fr-1",
    name: "Chicken & Chips",
    category: "fries",
    price: 7000,
    description: "Crispy salted french fries served with juicy golden fried chicken pieces.",
    image: "/images/yolo_fries.png"
  },
  {
    id: "fr-2",
    name: "Loaded Fries (Fries, Chicken, Cheese & Minced Meat)",
    category: "fries",
    price: 5500,
    description: "Seasoned fries loaded with chopped chicken, melted cheese, and savory minced meat.",
    image: "/images/yolo_fries.png"
  },
  // PIZZA - Pepperoni
  {
    id: "pz-pe-s",
    name: "Pepperoni Pizza (Small)",
    category: "pizza",
    price: 8000,
    description: "Small size pizza topped with rich mozzarella cheese and spicy beef pepperoni slices.",
    image: "/images/yolo_pizza.png"
  },
  {
    id: "pz-pe-m",
    name: "Pepperoni Pizza (Medium)",
    category: "pizza",
    price: 11500,
    description: "Medium size pizza topped with rich mozzarella cheese and spicy beef pepperoni slices.",
    image: "/images/yolo_pizza.png"
  },
  {
    id: "pz-pe-l",
    name: "Pepperoni Pizza (Large)",
    category: "pizza",
    price: 16500,
    description: "Large size pizza topped with rich mozzarella cheese and spicy beef pepperoni slices.",
    image: "/images/yolo_pizza.png"
  },
  // PIZZA - Margherita
  {
    id: "pz-ma-s",
    name: "Margherita Pizza (Small)",
    category: "pizza",
    price: 8000,
    description: "Small size classic pizza featuring tomato marinara, mozzarella, and fresh basil herbs.",
    image: "/images/yolo_pizza.png"
  },
  {
    id: "pz-ma-m",
    name: "Margherita Pizza (Medium)",
    category: "pizza",
    price: 11500,
    description: "Medium size classic pizza featuring tomato marinara, mozzarella, and fresh basil herbs.",
    image: "/images/yolo_pizza.png"
  },
  {
    id: "pz-ma-l",
    name: "Margherita Pizza (Large)",
    category: "pizza",
    price: 16500,
    description: "Large size classic pizza featuring tomato marinara, mozzarella, and fresh basil herbs.",
    image: "/images/yolo_pizza.png"
  },
  // PIZZA - Vegetable
  {
    id: "pz-vg-s",
    name: "Vegetable Pizza (Small)",
    category: "pizza",
    price: 8000,
    description: "Small size garden fresh pizza with olives, sweet corn, bell peppers, and onions.",
    image: "/images/yolo_pizza.png"
  },
  {
    id: "pz-vg-m",
    name: "Vegetable Pizza (Medium)",
    category: "pizza",
    price: 11500,
    description: "Medium size garden fresh pizza with olives, sweet corn, bell peppers, and onions.",
    image: "/images/yolo_pizza.png"
  },
  {
    id: "pz-vg-l",
    name: "Vegetable Pizza (Large)",
    category: "pizza",
    price: 16500,
    description: "Large size garden fresh pizza with olives, sweet corn, bell peppers, and onions.",
    image: "/images/yolo_pizza.png"
  },
  // BURGER
  {
    id: "bg-1",
    name: "Single Burger",
    category: "burger",
    price: 6000,
    description: "Perfect grilled beef patty with cheese, tomatoes, pickles, and classic burger sauce.",
    image: "/images/single_burger.png"
  },
  {
    id: "bg-2",
    name: "Double Burger",
    category: "burger",
    price: 9000,
    description: "Two flame-grilled beef patties, double cheese layers, onions, and burger sauce.",
    image: "/images/double_burger.png"
  },
  // PARFAIT
  {
    id: "pf-1",
    name: "Fruit Parfait",
    category: "parfait",
    price: 3500,
    description: "Yogurt layers paired with crisp apples, grapes, pineapples, and toasted granola.",
    image: "/images/yolo_parfaits.png"
  },
  // DRINKS
  { id: "dr-1", name: "Hollandia", category: "drinks", price: 2500, description: "Hollandia Yoghurt pack (various flavors).", image: "/images/soft_drinks.png" },
  { id: "dr-2", name: "Chi Exotic", category: "drinks", price: 2500, description: "Rich, creamy tropical exotic fruit drink.", image: "/images/soft_drinks.png" },
  { id: "dr-3", name: "Chivita Active", category: "drinks", price: 2500, description: "Healthy fruit juice beverage packet.", image: "/images/soft_drinks.png" },
  { id: "dr-4", name: "5 Alive Pulp", category: "drinks", price: 1700, description: "Refreshing orange juice with natural pulp segments.", image: "/images/soft_drinks.png" },
  { id: "dr-5", name: "5 Alive Berry Blast", category: "drinks", price: 1700, description: "Sweet mixed berry flavored fruit juice.", image: "/images/soft_drinks.png" },
  { id: "dr-6", name: "Vitamilk", category: "drinks", price: 2000, description: "Nourishing, smooth premium soy milk beverage.", image: "/images/soft_drinks.png" },
  { id: "dr-7", name: "Pure Heaven", category: "drinks", price: 1800, description: "Sparkling non-alcoholic white grape beverage.", image: "/images/soft_drinks.png" },
  { id: "dr-8", name: "Veleta", category: "drinks", price: 1500, description: "Premium sparkling red grape juice.", image: "/images/soft_drinks.png" },
  { id: "dr-9", name: "Fayrouz", category: "drinks", price: 1000, description: "Premium pear/pineapple flavored malt drink.", image: "/images/soft_drinks.png" },
  { id: "dr-10", name: "Maltina", category: "drinks", price: 1000, description: "Rich, smooth, classic sweet malt drink.", image: "/images/soft_drinks.png" },
  { id: "dr-11", name: "Amstel Malt", category: "drinks", price: 1000, description: "Light, low-sugar premium malt beverage.", image: "/images/soft_drinks.png" },
  { id: "dr-12", name: "Coca-Cola", category: "drinks", price: 700, description: "Original cold carbonated cola beverage.", image: "/images/soft_drinks.png" },
  { id: "dr-13", name: "Sprite", category: "drinks", price: 700, description: "Lemon-lime flavored fizzy soda drink.", image: "/images/soft_drinks.png" },
  { id: "dr-14", name: "Fanta", category: "drinks", price: 700, description: "Orange flavored carbonated soft drink.", image: "/images/soft_drinks.png" },
  { id: "dr-15", name: "Schweppes Mojito", category: "drinks", price: 800, description: "Mint & lime carbonated premium beverage.", image: "/images/soft_drinks.png" },
  { id: "dr-16", name: "Schweppes Chapman", category: "drinks", price: 800, description: "Carbonated chapman mixer drink.", image: "/images/soft_drinks.png" },
  { id: "dr-17", name: "Red Bull", category: "drinks", price: 1500, description: "Energy drink to vitalize body and mind.", image: "/images/soft_drinks.png" },
  { id: "dr-18", name: "Water", category: "drinks", price: 500, description: "Cold bottled premium table water.", image: "/images/soft_drinks.png" },
  // COCKTAILS
  {
    id: "ct-1",
    name: "Sex on the Beach",
    category: "cocktails",
    price: 4500,
    description: "Classic blend of vodka, peach schnapps, cranberry and orange juices.",
    image: "/images/cocktails.jpeg"
  },
  {
    id: "ct-2",
    name: "Cosmopolitan",
    category: "cocktails",
    price: 4500,
    description: "Vodka, triple sec, sweet cranberry juice, and fresh lime squeeze.",
    image: "/images/cocktails.jpeg"
  },
  {
    id: "ct-3",
    name: "Long Island",
    category: "cocktails",
    price: 5000,
    description: "Vodka, gin, rum, tequila, triple sec, lemon juice, topped with cola.",
    image: "/images/cocktails.jpeg"
  },
  {
    id: "ct-4",
    name: "Adios Motherf*****",
    category: "cocktails",
    price: 5000,
    description: "High-octane blend of blue curaçao, mixed spirits, and lemon lime soda.",
    image: "/images/cocktails.jpeg"
  },
  {
    id: "ct-5",
    name: "Blue Lagoon",
    category: "cocktails",
    price: 4500,
    description: "Vibrant blend of vodka, blue curaçao, and fresh lemonade.",
    image: "/images/cocktails.jpeg"
  },
  {
    id: "ct-6",
    name: "Tequila Sunrise",
    category: "cocktails",
    price: 4500,
    description: "Tequila, freshly-pressed orange juice, and grenadine syrup drizzle.",
    image: "/images/cocktails.jpeg"
  },
  // SMOOTHIES
  {
    id: "sm-1",
    name: "Sunburst",
    category: "smoothies",
    price: 3000,
    description: "Tropical signature smoothie with orange, banana, mango, and pineapples.",
    image: "/images/yolo_smoothie.png"
  },
  {
    id: "sm-2",
    name: "Nutty Banana",
    category: "smoothies",
    price: 3000,
    description: "Creamy banana smoothie containing peanut butter, Greek yogurt, and honey.",
    image: "/images/yolo_smoothie.png"
  },
  {
    id: "sm-3",
    name: "Heart Beat",
    category: "smoothies",
    price: 3000,
    description: "Healthy and energizing blend of beetroot, red apples, ginger, and strawberries.",
    image: "/images/yolo_smoothie.png"
  },
  {
    id: "sm-4",
    name: "Strawberry Clout",
    category: "smoothies",
    price: 3000,
    description: "Smooth thick blend of fresh strawberries, bananas, yogurt, and milk.",
    image: "/images/yolo_smoothie.png"
  },
  {
    id: "sm-5",
    name: "Mixed Fruit",
    category: "smoothies",
    price: 3000,
    description: "Rich blended smoothie loaded with dynamic seasonal fruits.",
    image: "/images/yolo_smoothie.png"
  },
  // MILKSHAKES
  {
    id: "ms-1",
    name: "Oreo Shake",
    category: "milkshakes",
    price: 4500,
    description: "Creamy vanilla milkshake blended with heaps of real Oreo cookies.",
    image: "/images/oreo_milkshake.png"
  },
  {
    id: "ms-2",
    name: "Strawberry Shake",
    category: "milkshakes",
    price: 4000,
    description: "Thick sweet milkshake crafted with fresh strawberry ice cream and sauce.",
    image: "/images/strawberry_milkshake.png"
  },
  {
    id: "ms-3",
    name: "Vanilla Shake",
    category: "milkshakes",
    price: 4000,
    description: "Classic creamy milkshake infused with premium vanilla bean extract.",
    image: "/images/vanilla_milkshake.png"
  },
  {
    id: "ms-4",
    name: "Chocolate Shake",
    category: "milkshakes",
    price: 4000,
    description: "Rich chocolate milkshake topped with dark chocolate drizzle.",
    image: "/images/chocolate_milkshake.png"
  },
  {
    id: "ms-5",
    name: "Banana Shake",
    category: "milkshakes",
    price: 4000,
    description: "Sweet banana fruit puree blended with creamy vanilla ice cream.",
    image: "/images/banana_milkshake.png"
  },
  // MOCKTAILS
  {
    id: "mc-1",
    name: "Kiwi Breeze",
    category: "mocktails",
    price: 3500,
    description: "Sparkling kiwi juice, fresh mint leaves, green apples, and lime juice.",
    image: "/images/cocktails.jpeg"
  },
  {
    id: "mc-2",
    name: "Swimming Pool",
    category: "mocktails",
    price: 3500,
    description: "Vibrant blue curaçao syrup, cream of coconut, and pineapple juice.",
    image: "/images/cocktails.jpeg"
  },
  {
    id: "mc-3",
    name: "Chapman",
    category: "mocktails",
    price: 3000,
    description: "Nigerian classic chapman mocktail with blackcurrant, lime, and angostura bitters.",
    image: "/images/cocktails.jpeg"
  },
  {
    id: "mc-4",
    name: "Virgin Mojito",
    category: "mocktails",
    price: 3000,
    description: "Refreshing club soda with crushed mint leaves, lime juice, and cane sugar.",
    image: "/images/cocktails.jpeg"
  },
  {
    id: "mc-5",
    name: "Safe Sex on the Beach",
    category: "mocktails",
    price: 3500,
    description: "Sweet non-alcoholic version with peach syrup, cranberry, and orange juices.",
    image: "/images/cocktails.jpeg"
  },
  {
    id: "mc-6",
    name: "Virgin Colada",
    category: "mocktails",
    price: 3500,
    description: "Smooth blend of sweet cream of coconut and refreshing pineapple juice.",
    image: "/images/cocktails.jpeg"
  }
];

export const categories = [
  { id: "all",        label: "All Items" },
  { id: "pizza",      label: "Pizza" },
  { id: "shawarma",   label: "Shawarma" },
  { id: "chops",      label: "Small Chops" },
  { id: "fries",      label: "Fries" },
  { id: "burger",     label: "Burger" },
  { id: "parfait",    label: "Parfait" },
  { id: "drinks",     label: "Drinks" },
  { id: "cocktails",  label: "Cocktails" },
  { id: "smoothies",  label: "Smoothies" },
  { id: "milkshakes", label: "Milkshakes" },
  { id: "mocktails",  label: "Mocktails" }
];

export const formatPrice = (n: number) =>
  `₦${n.toLocaleString("en-NG")}`;
