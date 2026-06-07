import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YOLO BITES | Taste It. Love It. Live It. - Kaduna's Premium Restaurant",
  description: "Experience the perfect blend of luxury, comfort, and unforgettable flavours at Kaduna's newest premium food destination. Fresh pizzas, gourmet burgers, Shawarmas, parfaits, and mocktails at Barnawa.",
  keywords: "YOLO BITES, Restaurant Kaduna, Barnawa restaurants, premium food, luxury dining Kaduna, pizza Kaduna, burger Barnawa, Mocktails Kaduna, food destination Nigeria",
  openGraph: {
    title: "YOLO BITES | Taste It. Love It. Live It.",
    description: "Discover the perfect blend of flavour, comfort, and unforgettable moments at Kaduna’s newest premium food destination.",
    url: "https://yolobites.ng",
    siteName: "YOLO BITES",
    images: [
      {
        url: "/images/background.png",
        width: 1200,
        height: 630,
        alt: "YOLO BITES Interior Ambience",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YOLO BITES | Kaduna's Premium Food Hub",
    description: "You Only Live Once. Make It Delicious. Visit us in Barnawa, Kaduna South.",
    images: ["/images/background.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-deep-black text-warm-ivory min-h-full antialiased selection:bg-primary-red selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
