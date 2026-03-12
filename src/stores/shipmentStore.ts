import { create } from 'zustand';
import type { ShipmentType } from '@/types/domain.types';

interface ShipmentState {
  shipments: ShipmentType[];
  isLoading: boolean;
  // Actions
  setShipments: (shipments: ShipmentType[]) => void;
  updateShipment: (id: string, partial: Partial<ShipmentType>) => void;
  setLoading: (value: boolean) => void;
}

export const useShipmentStore = create<ShipmentState>()((set) => ({
  shipments: [],
  isLoading: false,

  setShipments: (shipments) =>
    set({ shipments }),

  updateShipment: (id, partial) =>
    set((state) => ({
      shipments: state.shipments.map((s) =>
        s.id === id ? { ...s, ...partial } : s,
      ),
    })),

  setLoading: (value) =>
    set({ isLoading: value }),
}));
