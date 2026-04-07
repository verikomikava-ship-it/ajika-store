export interface Category {
  id: string;
  slug: string;
  name_ka: string;
  name_en: string;
  description_ka: string | null;
  description_en: string | null;
  icon: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}
