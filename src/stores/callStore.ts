import { create } from 'zustand';

type CallStatus = 'idle' | 'dialing' | 'ringing' | 'connected' | 'ended';

// Cost per second in RWF (50 RWF/min)
const COST_PER_SECOND = 50 / 60;

interface CallState {
  isInCall: boolean;
  duration: number;      // seconds elapsed
  cost: number;          // RWF deducted so far
  remoteNumber: string;
  status: CallStatus;
  isMuted: boolean;
  isSpeaker: boolean;
  // Actions
  startCall: (number: string) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  tick: () => void;      // called by setInterval every second
  setStatus: (status: CallStatus) => void;
}

export const useCallStore = create<CallState>()((set) => ({
  isInCall: false,
  duration: 0,
  cost: 0,
  remoteNumber: '',
  status: 'idle',
  isMuted: false,
  isSpeaker: false,

  startCall: (number) =>
    set({
      isInCall: true,
      remoteNumber: number,
      status: 'dialing',
      duration: 0,
      cost: 0,
      isMuted: false,
      isSpeaker: false,
    }),

  endCall: () =>
    set({
      isInCall: false,
      status: 'ended',
    }),

  toggleMute: () =>
    set((state) => ({ isMuted: !state.isMuted })),

  toggleSpeaker: () =>
    set((state) => ({ isSpeaker: !state.isSpeaker })),

  tick: () =>
    set((state) => {
      if (!state.isInCall || state.status !== 'connected') return {};
      const duration = state.duration + 1;
      const cost = duration * COST_PER_SECOND;
      return { duration, cost };
    }),

  setStatus: (status) =>
    set({ status }),
}));
