import type { MenuItem } from "./menuData";

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface PersonOrder {
  name: string;
  cart: CartItem[];
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
}
