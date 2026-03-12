import { api } from './api';

interface CallBalanceResponse {
  minutes: number;
}

interface InitiateCallResponse {
  sessionId: string;
}

export const callService = {
  /** Get current call credit balance in minutes */
  getBalance: () =>
    api.get<CallBalanceResponse>('/call/balance'),

  /** Initiate a call session to the given number */
  initiateCall: (number: string) =>
    api.post<InitiateCallResponse>('/call/initiate', { number }),

  /** End an active call session and report duration */
  endCall: (sessionId: string, duration: number) =>
    api.post<void>('/call/end', { sessionId, duration }),
};
