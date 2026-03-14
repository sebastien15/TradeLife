import { create } from 'zustand';

type CallStatus = 'idle' | 'dialing' | 'ringing' | 'connected' | 'ended';

// Cost per second in RWF (50 RWF/min)
const COST_PER_SECOND = 50 / 60;

// Low balance threshold in RWF (~2 minutes at 50 RWF/min)
const LOW_BALANCE_THRESHOLD = 100;

interface CallState {
  isInCall: boolean;
  duration: number;      // seconds elapsed
  cost: number;          // RWF deducted so far
  remoteNumber: string;
  status: CallStatus;
  isMuted: boolean;
  isSpeaker: boolean;
  isOnHold: boolean;
  currentBalance: number;  // in RWF
  showLowBalanceWarning: boolean;
  // Actions
  startCall: (number: string, initialBalance: number) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  toggleHold: () => void;
  tick: () => void;      // called by setInterval every second
  setStatus: (status: CallStatus) => void;
  checkBalance: () => void;
  dismissLowBalanceWarning: () => void;
}

export const useCallStore = create<CallState>()((set, get) => ({
  isInCall: false,
  duration: 0,
  cost: 0,
  remoteNumber: '',
  status: 'idle',
  isMuted: false,
  isSpeaker: false,
  isOnHold: false,
  currentBalance: 0,
  showLowBalanceWarning: false,

  startCall: (number, initialBalance) =>
    set({
      isInCall: true,
      remoteNumber: number,
      status: 'dialing',
      duration: 0,
      cost: 0,
      isMuted: false,
      isSpeaker: false,
      isOnHold: false,
      currentBalance: initialBalance,
      showLowBalanceWarning: false,
    }),

  endCall: () =>
    set({
      isInCall: false,
      status: 'ended',
      isOnHold: false,
    }),

  toggleMute: () =>
    set((state) => ({ isMuted: !state.isMuted })),

  toggleSpeaker: () =>
    set((state) => ({ isSpeaker: !state.isSpeaker })),

  toggleHold: () =>
    set((state) => ({
      isOnHold: !state.isOnHold,
      // Auto-mute when putting on hold
      isMuted: !state.isOnHold ? true : state.isMuted,
    })),

  tick: () => {
    const state = get();
    if (!state.isInCall || state.isOnHold || state.status !== 'connected') return;

    set((state) => {
      const duration = state.duration + 1;
      const cost = duration * COST_PER_SECOND;
      return { duration, cost };
    });

    // Check balance after cost update
    get().checkBalance();
  },

  setStatus: (status) =>
    set({ status }),

  checkBalance: () => {
    const state = get();
    const remainingBalance = state.currentBalance - state.cost;

    if (remainingBalance < LOW_BALANCE_THRESHOLD && !state.showLowBalanceWarning) {
      set({ showLowBalanceWarning: true });
    }
  },

  dismissLowBalanceWarning: () =>
    set({ showLowBalanceWarning: false }),
}));
