export interface UserProfile {
  id: string;
  email?: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  address: string | null;
  preferred_language: 'ka' | 'en';
  is_admin: boolean;
  orders_count?: number;
  created_at: string;
  updated_at: string;
}
