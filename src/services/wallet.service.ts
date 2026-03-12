import { api } from './api';
import type { TransactionRecord, SendPayload, TopUpPayload } from '@/types/domain.types';

interface BalanceResponse {
  balance: number;      // RWF
  callBalance: number;  // minutes
}

interface RateResponse {
  rate: number;
  expiresAt: string; // ISO 8601
}

export const walletService = {
  /** Get current wallet balance */
  getBalance: () =>
    api.get<BalanceResponse>('/wallet/balance'),

  /** Paginated transaction history */
  getTransactions: (page = 1, limit = 20) =>
    api.get<TransactionRecord[]>('/wallet/transactions', { params: { page, limit } }),

  /** Send money to a recipient */
  sendMoney: (payload: SendPayload) =>
    api.post<TransactionRecord>('/wallet/send', payload),

  /** Top up the wallet */
  topUp: (payload: TopUpPayload) =>
    api.post<TransactionRecord>('/wallet/topup', payload),

  /** Get live exchange rate (staleTime: 30s in TanStack Query) */
  getExchangeRate: (from: string, to: string) =>
    api.get<RateResponse>('/wallet/rate', { params: { from, to } }),
};
