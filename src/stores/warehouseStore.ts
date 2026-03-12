import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WarehouseItemType } from '@/types/domain.types';

interface WarehouseState {
  items: WarehouseItemType[];
  referenceCode: string;
  storageAddress: string;
  // Actions
  setItems: (items: WarehouseItemType[]) => void;
  addItem: (item: WarehouseItemType) => void;
  updateItem: (id: string, partial: Partial<WarehouseItemType>) => void;
  removeItem: (id: string) => void;
  setReferenceCode: (code: string) => void;
  setStorageAddress: (address: string) => void;
}

export const useWarehouseStore = create<WarehouseState>()(
  persist(
    (set) => ({
      items: [],
      referenceCode: '',
      storageAddress: '',

      setItems: (items) =>
        set({ items }),

      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),

      updateItem: (id, partial) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, ...partial } : item,
          ),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      setReferenceCode: (referenceCode) =>
        set({ referenceCode }),

      setStorageAddress: (storageAddress) =>
        set({ storageAddress }),
    }),
    {
      name: 'tradelife-warehouse',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        referenceCode: state.referenceCode,
        storageAddress: state.storageAddress,
      }),
    },
  ),
);

// ── Selectors ─────────────────────────────────────────────────────────────────

/** Total weight across all stored items */
export function selectTotalWeight(state: WarehouseState): number {
  return state.items.reduce((sum, item) => sum + item.weight, 0);
}

/** Total CBM across all stored items */
export function selectTotalCbm(state: WarehouseState): number {
  return state.items.reduce((sum, item) => sum + item.cbm, 0);
}

/** Items with status 'received' — ready to be shipped */
export function selectItemsReadyToShip(state: WarehouseState): WarehouseItemType[] {
  return state.items.filter((item) => item.status === 'received');
}
