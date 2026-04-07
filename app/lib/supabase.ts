import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Order {
  id?: number;
  name: string;
  phone: string;
  address: string;
  volume: string;
  price: number;
  status: 'new' | 'confirmed' | 'delivered' | 'cancelled';
  created_at?: string;
}
