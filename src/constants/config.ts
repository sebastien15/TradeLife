// App configuration & environment variables

export const CONFIG = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.tradelife.app',
  USE_MOCK: process.env.EXPO_PUBLIC_USE_MOCK === 'true',

  APP_NAME: 'TradeLife',
  APP_VERSION: '1.0.0',
  SCHEME: 'tradelife',

  // Pagination
  DEFAULT_PAGE_SIZE: 20,

  // Timeouts (ms)
  API_TIMEOUT: 30_000,
  RATE_REFRESH_INTERVAL: 60_000,

  // Supported languages
  SUPPORTED_LANGUAGES: ['en', 'rw', 'fr', 'zh'] as const,
  DEFAULT_LANGUAGE: 'en' as const,

  // Supported currencies
  SUPPORTED_CURRENCIES: ['RWF', 'CNY', 'USD'] as const,
  DEFAULT_CURRENCY: 'RWF' as const,
} as const;

export type SupportedLanguage = typeof CONFIG.SUPPORTED_LANGUAGES[number];
export type SupportedCurrency = typeof CONFIG.SUPPORTED_CURRENCIES[number];
