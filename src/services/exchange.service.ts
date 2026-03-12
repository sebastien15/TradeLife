import { api } from './api';

interface RateResponse {
  rate: number;
  expiresAt: string; // ISO 8601
}

export const exchangeService = {
  /** Get all available exchange rates as a flat map (e.g. { CNY_RWF: 198.45 }) */
  getRates: () =>
    api.get<Record<string, number>>('/exchange/rates'),

  /** Get a specific live exchange rate between two currencies */
  getRate: (from: string, to: string) =>
    api.get<RateResponse>('/exchange/rate', { params: { from, to } }),
};
