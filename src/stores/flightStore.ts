import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FlightSearchParams, FlightType } from '@/types/domain.types';

interface RecentFlightSearch extends FlightSearchParams {
  id: string;
  timestamp: number;
}

interface FlightState {
  searchParams: FlightSearchParams | null;
  searchResults: FlightType[];
  selectedFlight: FlightType | null;
  selectedSeat: string | null;
  recentSearches: RecentFlightSearch[];

  // Actions
  setSearchParams: (params: FlightSearchParams) => void;
  setSearchResults: (results: FlightType[]) => void;
  setSelectedFlight: (flight: FlightType | null) => void;
  setSelectedSeat: (seat: string | null) => void;
  addRecentSearch: (params: FlightSearchParams) => void;
  clearSearch: () => void;
}

export const useFlightStore = create<FlightState>()(
  persist(
    (set) => ({
      searchParams: null,
      searchResults: [],
      selectedFlight: null,
      selectedSeat: null,
      recentSearches: [],

      setSearchParams: (params) =>
        set({ searchParams: params }),

      setSearchResults: (results) =>
        set({ searchResults: results }),

      setSelectedFlight: (flight) =>
        set({ selectedFlight: flight }),

      setSelectedSeat: (seat) =>
        set({ selectedSeat: seat }),

      addRecentSearch: (params) =>
        set((state) => {
          const newSearch: RecentFlightSearch = {
            ...params,
            id: Date.now().toString(),
            timestamp: Date.now(),
          };

          // Remove duplicate if same route + date exists
          const filtered = state.recentSearches.filter(
            (s) =>
              !(
                s.origin === params.origin &&
                s.destination === params.destination &&
                s.departureDate === params.departureDate
              )
          );

          // Add to beginning and limit to 10
          return {
            recentSearches: [newSearch, ...filtered].slice(0, 10),
          };
        }),

      clearSearch: () =>
        set({
          searchParams: null,
          searchResults: [],
          selectedFlight: null,
          selectedSeat: null,
        }),
    }),
    {
      name: 'tradelife-flights',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist recent searches
      partialize: (state) => ({
        recentSearches: state.recentSearches,
      }),
    }
  )
);
