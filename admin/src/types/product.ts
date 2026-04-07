export interface Product {
  id: string;
  sku: string | null;
  name_ka: string;
  name_en: string;
  description_ka: string | null;
  description_en: string | null;
  price: number;
  sale_price: number | null;
  currency: string;
  category_id: string;
  brand: string | null;
  stock_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  specifications: Record<string, string>;
  images: ProductImage[];
  category?: { name_ka: string; name_en: string };
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}
