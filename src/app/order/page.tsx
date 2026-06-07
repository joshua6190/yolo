import type { Metadata } from "next";
import OrderFlow from "@/components/order/OrderFlow";

export const metadata: Metadata = {
  title: "Order Now | YOLO BITES — Taste It. Love It. Live It.",
  description: "Place your order at YOLO BITES. Dine in at our Barnawa restaurant or get it delivered. Premium food, seamless experience.",
};

export default function OrderPage() {
  return <OrderFlow />;
}
