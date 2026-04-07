import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';

interface AdminAuthStore {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AdminAuthStore>((set) => ({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: true,
  setSession: (session) =>
    set({ session, user: session?.user ?? null }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
  setLoading: (isLoading) => set({ isLoading }),
}));
