// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Axios API Client
// ─────────────────────────────────────────────────────────────────────────────
import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { getMockResponse } from './mocks';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.tradelife.app/v1';
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK === 'true';
const MAX_RETRIES = 2;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: inject Bearer token ──────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: 401 → logout + retry network errors ─────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number };

    // 401 Unauthorized — clear auth state
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    // Retry on network errors only (no response received = !error.response)
    if (!error.response && config && (config._retryCount ?? 0) < MAX_RETRIES) {
      config._retryCount = (config._retryCount ?? 0) + 1;
      // Exponential back-off: 500ms, 1000ms
      const delay = config._retryCount * 500;
      await new Promise<void>((resolve) => setTimeout(resolve, delay));
      return api(config);
    }

    return Promise.reject(error);
  },
);

// ── Mock adapter ──────────────────────────────────────────────────────────────
if (USE_MOCK) {
  api.defaults.adapter = async (config) => {
    // Simulate network latency in development
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
    const data = getMockResponse(config.url ?? '', (config.method ?? 'get').toLowerCase());
    return {
      data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  };
}
