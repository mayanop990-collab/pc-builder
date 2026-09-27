export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  section: CategorySection;
  created_at: string;
};

export type CategorySection = "components" | "peripherals" | "setup";

export const CATEGORY_SECTIONS: { value: CategorySection; label: string; tagline: string }[] = [
  { value: "components", label: "PC Components", tagline: "The heart of every build" },
  { value: "peripherals", label: "Gaming Gear", tagline: "Aim, hear and speak like a pro" },
  { value: "setup", label: "Setup & Furniture", tagline: "Complete your battle station" },
];

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  category_id: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  specs: Record<string, string>;
  image_url: string | null;
  featured: boolean;
  active: boolean;
  created_at: string;
  categories?: Pick<Category, "name" | "slug" | "icon" | "section"> | null;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes: string | null;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Settings = {
  id: number;
  store_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  shipping_fee: number;
  updated_at: string;
};

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
