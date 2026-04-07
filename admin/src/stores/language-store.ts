import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'ka' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'ka',
      setLanguage: (language) => set({ language }),
    }),
    { name: 'admin-language' }
  )
);
