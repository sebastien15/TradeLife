import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { VPNServer } from '@/types/domain.types';

interface VpnState {
  isConnected: boolean;
  isConnecting: boolean;
  server: VPNServer | null;
  daysRemaining: number;
  subscriptionActive: boolean;
  // Actions
  connect: (server: VPNServer) => Promise<void>;
  disconnect: () => void;
  setServer: (server: VPNServer) => void;
  setSubscription: (active: boolean, days: number) => void;
}

export const useVpnStore = create<VpnState>()(
  persist(
    (set) => ({
      isConnected: false,
      isConnecting: false,
      server: null,
      daysRemaining: 30, // Active subscription for development
      subscriptionActive: true, // Active subscription for development

      connect: async (server) => {
        set({ isConnecting: true, server });
        // Simulate connection handshake
        await new Promise<void>((resolve) => setTimeout(resolve, 1500));
        set({ isConnecting: false, isConnected: true });
      },

      disconnect: () =>
        set({ isConnected: false, isConnecting: false }),

      setServer: (server) =>
        set({ server }),

      setSubscription: (active, days) =>
        set({ subscriptionActive: active, daysRemaining: days }),
    }),
    {
      name: 'tradelife-vpn',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        server: state.server,
        subscriptionActive: state.subscriptionActive,
        daysRemaining: state.daysRemaining,
      }),
    },
  ),
);
