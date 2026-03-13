import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RecentSearch } from '@/types/domain.types';

interface SearchState {
  recentSearches: RecentSearch[];
  // Actions
  addSearch: (search: Omit<RecentSearch, 'id' | 'timestamp'>) => void;
  removeSearch: (id: string) => void;
  clearSearchHistory: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],

      addSearch: (search) =>
        set((state) => {
          const newSearch: RecentSearch = {
            ...search,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
          };

          // Remove duplicate if exists
          const filtered = state.recentSearches.filter(
            (s) => s.query.toLowerCase() !== search.query.toLowerCase()
          );

          // Add to beginning and limit to 10
          return {
            recentSearches: [newSearch, ...filtered].slice(0, 10),
          };
        }),

      removeSearch: (id) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s.id !== id),
        })),

      clearSearchHistory: () =>
        set({ recentSearches: [] }),
    }),
    {
      name: 'tradelife-search',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
