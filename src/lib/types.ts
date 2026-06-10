export type ProductStatus = "available" | "unavailable" | "coming_soon";
export type OrderStatus = "new" | "contacted" | "processing" | "sold" | "cancelled";

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  name_fr: string | null;
  description: string | null;
  description_fr: string | null;
  price: number;
  old_price: number | null;
  status: ProductStatus;
  category: string | null;
  warranty: string | null;
  specs: Record<string, string>;
  colors: string[];
  images: string[];
  is_featured: boolean;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  golden_card_number: string | null;
  golden_card_expiry: string | null;
  id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  selected_color: string | null;
  first_name: string;
  last_name: string;
  wilaya: string;
  commune: string;
  address: string;
  phone_1: string;
  phone_2: string | null;
  email: string | null;
  notes: string | null;
  golden_card_number: string | null;
  golden_card_expiry: string | null;
  status: OrderStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}
