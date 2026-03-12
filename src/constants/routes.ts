// ─────────────────────────────────────────────────────────────────────────────
// TradeLife — Typed Route Constants
// ─────────────────────────────────────────────────────────────────────────────

export const ROUTES = {
  AUTH: {
    INDEX:           '/(auth)/',
    SPLASH:          '/(auth)/splash',
    LANGUAGE:        '/(auth)/language',
    SIGN_IN:         '/(auth)/sign-in',
    SIGN_UP:         '/(auth)/sign-up',
    OTP:             '/(auth)/otp',
    PROFILE_SETUP:   '/(auth)/profile-setup',
    PERMISSIONS:     '/(auth)/permissions',
    FORGOT_PASSWORD: '/(auth)/forgot-password',
  },

  TABS: {
    HOME:   '/(tabs)/',
    MONEY:  '/(tabs)/money',
    SHIP:   '/(tabs)/ship',
    TRAVEL: '/(tabs)/travel',
    MORE:   '/(tabs)/more',
  },

  MONEY: {
    INDEX:       '/(tabs)/money',
    HISTORY:     '/(tabs)/money/history',
    TRANSACTION: (id: string) => `/(tabs)/money/transaction/${id}` as const,
  },

  SHIP: {
    INDEX:           '/(tabs)/ship',
    QUOTE:           '/(tabs)/ship/quote',
    RESULTS:         '/(tabs)/ship/results',
    CBM_CALCULATOR:  '/(tabs)/ship/cbm-calculator',
    BOOKING_FORM:    '/(tabs)/ship/booking-form',
    BOOKING_REVIEW:  '/(tabs)/ship/booking-review',
    BOOKING_SUCCESS: '/(tabs)/ship/booking-success',
    SHIPMENT:        (id: string) => `/(tabs)/ship/shipment/${id}` as const,
    WAREHOUSE: {
      HUB:                 '/(tabs)/ship/warehouse/',
      ADDRESS:             '/(tabs)/ship/warehouse/address',
      DECLARE:             '/(tabs)/ship/warehouse/declare',
      ITEM:                (id: string) => `/(tabs)/ship/warehouse/item/${id}` as const,
      PHOTO_REVIEW:        '/(tabs)/ship/warehouse/photo-review',
      CONSOLIDATE:         '/(tabs)/ship/warehouse/consolidate',
      CONSOLIDATE_REVIEW:  '/(tabs)/ship/warehouse/consolidate-review',
      CONSOLIDATE_SUCCESS: '/(tabs)/ship/warehouse/consolidate-success',
    },
  },

  TRAVEL: {
    INDEX: '/(tabs)/travel',
    VISA: {
      STEP_1: '/(tabs)/travel/visa/step-1-docs',
      STEP_2: '/(tabs)/travel/visa/step-2-info',
      STEP_3: '/(tabs)/travel/visa/step-3-payment',
      STEP_4: '/(tabs)/travel/visa/step-4-success',
    },
    FLIGHTS: {
      SEARCH:  '/(tabs)/travel/flights/search',
      RESULTS: '/(tabs)/travel/flights/results',
      DETAIL:  '/(tabs)/travel/flights/detail',
      ETICKET: '/(tabs)/travel/flights/eticket',
    },
  },

  MORE: {
    INDEX:        '/(tabs)/more',
    PROFILE:      '/(tabs)/more/profile',
    PROFILE_EDIT: '/(tabs)/more/profile-edit',
    SETTINGS: {
      INDEX:         '/(tabs)/more/settings',
      SECURITY:      '/(tabs)/more/settings/security',
      NOTIFICATIONS: '/(tabs)/more/settings/notifications',
      LANGUAGE:      '/(tabs)/more/settings/language',
    },
    COMMUNITY: {
      INDEX:       '/(tabs)/more/community',
      CREATE:      '/(tabs)/more/community/create',
      MARKETPLACE: '/(tabs)/more/community/marketplace',
      SUPPLIER:    (id: string) => `/(tabs)/more/community/supplier/${id}` as const,
    },
  },

  CALL: {
    DIALER:  '/(tabs)/call/dialer',
    ACTIVE:  '/(tabs)/call/active',
    SUMMARY: '/(tabs)/call/summary',
  },
} as const;

export type AppRoutes = typeof ROUTES;
