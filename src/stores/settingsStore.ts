import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupportedLanguage } from '@/types/domain.types';
import i18n from '@/i18n';

type ColorScheme = 'light' | 'dark' | 'system';

export interface NotificationPrefs {
  shipmentUpdates: boolean;
  paymentAlerts: boolean;
  promotions: boolean;
  callAlerts: boolean;
}

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  shipmentUpdates: true,
  paymentAlerts: true,
  promotions: false,
  callAlerts: true,
};

interface SettingsState {
  colorScheme: ColorScheme;
  language: SupportedLanguage;
  notificationPrefs: NotificationPrefs;
  // Actions
  setColorScheme: (scheme: ColorScheme) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      colorScheme: 'system',
      language: 'en',
      notificationPrefs: DEFAULT_NOTIFICATION_PREFS,

      setColorScheme: (colorScheme) =>
        set({ colorScheme }),

      setLanguage: (language) => {
        i18n.changeLanguage(language);
        set({ language });
      },

      setNotificationPref: (key, value) =>
        set((state) => ({
          notificationPrefs: { ...state.notificationPrefs, [key]: value },
        })),
    }),
    {
      name: 'tradelife-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
