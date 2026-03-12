import { create } from 'zustand';
import type { TransactionRecord, SupplierType } from '@/types/domain.types';

interface WalletState {
  balance: number;          // RWF
  callBalance: number;      // minutes
  transactions: TransactionRecord[];
  pendingCount: number;
  savedSuppliers: SupplierType[];
  // Actions
  setBalance: (amount: number) => void;
  deduct: (amount: number) => void;
  credit: (amount: number) => void;
  setTransactions: (transactions: TransactionRecord[]) => void;
  addSupplier: (supplier: SupplierType) => void;
  removeSupplier: (id: string) => void;
  setPendingCount: (count: number) => void;
  setCallBalance: (minutes: number) => void;
}

export const useWalletStore = create<WalletState>()((set) => ({
  balance: 0,
  callBalance: 0,
  transactions: [],
  pendingCount: 0,
  savedSuppliers: [],

  setBalance: (amount) =>
    set({ balance: amount }),

  deduct: (amount) =>
    set((state) => ({ balance: Math.max(0, state.balance - amount) })),

  credit: (amount) =>
    set((state) => ({ balance: state.balance + amount })),

  setTransactions: (transactions) =>
    set({ transactions }),

  addSupplier: (supplier) =>
    set((state) => ({
      savedSuppliers: state.savedSuppliers.some((s) => s.id === supplier.id)
        ? state.savedSuppliers
        : [...state.savedSuppliers, supplier],
    })),

  removeSupplier: (id) =>
    set((state) => ({
      savedSuppliers: state.savedSuppliers.filter((s) => s.id !== id),
    })),

  setPendingCount: (count) =>
    set({ pendingCount: count }),

  setCallBalance: (minutes) =>
    set({ callBalance: minutes }),
}));
