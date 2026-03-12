import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserType, SupportedLanguage } from '@/types/domain.types';

interface AuthState {
  user: UserType | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  preferredLanguage: SupportedLanguage;
  onboardingComplete: boolean;
  // Actions
  setUser: (user: UserType) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setOnboardingComplete: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      preferredLanguage: 'en',
      onboardingComplete: false,

      setUser: (user) =>
        set({ user, isAuthenticated: true }),

      setToken: (token) =>
        set({ token }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          onboardingComplete: false,
        }),

      setLanguage: (preferredLanguage) =>
        set({ preferredLanguage }),

      setOnboardingComplete: (value) =>
        set({ onboardingComplete: value }),

      setLoading: (value) =>
        set({ isLoading: value }),
    }),
    {
      name: 'tradelife-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        preferredLanguage: state.preferredLanguage,
        onboardingComplete: state.onboardingComplete,
      }),
    },
  ),
);
