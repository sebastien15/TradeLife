# TradeLife — Master Project Context

> **⚠️ MANDATORY FIRST READ FOR ALL AI ASSISTANTS**
>
> **Before starting ANY task**, you MUST read these files in order:
> 1. **knowledge/context.md** → Quick start (3 min): stack, 8 hard rules, payment model
> 2. **knowledge/screens.md** → Screen map: exact routes, what exists, design folders
> 3. **This file** → Deep dive: full architecture, types, stores, design system
>
> **Why?** This is your table of contents. It tells you:
> - Which file to touch without browsing the whole project
> - The exact route path (e.g., `(auth)/sign-in.tsx` not `src/app/sign-in.tsx`)
> - Design folder to reference (e.g., `1h_sign_in_dark/`)
> - Whether a file already exists or needs to be created
>
> **Exception:** Only skip if the user explicitly says "don't read knowledge files" or gives you the exact file path.

> **Purpose of this file:** Anyone joining this project — developer, designer, AI assistant, or Claude Code session — reads this file first. It contains the complete context needed to understand, build, or contribute to TradeLife without needing to ask questions.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Target Users & Business Model](#2-target-users--business-model)
3. [Tech Stack](#3-tech-stack)
4. [App Structure & Navigation](#4-app-structure--navigation)
5. [All Screens — by Workflow](#5-all-screens--by-workflow)
6. [Design System](#6-design-system)
7. [Stitch Design Exports](#7-stitch-design-exports)
8. [Data & State Architecture](#8-data--state-architecture)
9. [Payment Model](#9-payment-model)
10. [Key Components Reference](#10-key-components-reference)
11. [Hard Rules — Non-Negotiable](#11-hard-rules--non-negotiable)
12. [Folder Structure](#12-folder-structure)
13. [Environment & Config](#13-environment--config)
14. [Claude Code — How to Use the Prompt Series](#14-claude-code--how-to-use-the-prompt-series)
15. [Glossary](#15-glossary)

---

## 1. Product Overview

**TradeLife** is a Rwanda-China trade super-app for Rwandan importers, traders, and business owners who source goods from China.

It consolidates into one app everything a Rwandan trader needs:

| Feature | What it does |
|---|---|
| **VPN** | Secure connection for accessing Chinese platforms (WeChat, Alibaba, etc.) |
| **Calling** | Low-cost calls to China from Rwanda (in-app wallet) |
| **Money** | Send money to China, receive payments, top up wallet, pay suppliers |
| **Shipping** | Quote, book, and track sea/air cargo from China to Rwanda |
| **Warehouse** | Use TradeLife's Guangzhou 3PL warehouse to consolidate multiple supplier orders |
| **Travel** | Chinese visa applications, flight booking |
| **Community** | Trade tips feed, marketplace, supplier directory, mentor chat |
| **Settings** | Profile, security, notifications, language (EN/RW/FR/ZH) |

### Design Target
- **Device:** iPhone 14 Pro — 393×852pt
- **Modes:** Light + Dark (full support for both)
- **Language:** 4 languages — English, Kinyarwanda, Français, 中文

---

## 2. Target Users & Business Model

### Primary User
A Rwandan trader who:
- Sources products from Chinese manufacturers/suppliers
- Ships goods to Rwanda via sea or air freight
- Needs to pay Chinese suppliers in CNY
- Uses WeChat/Alibaba daily (needs VPN)
- May travel to China for trade fairs

### User Types (businessType field)
`Importer` | `Exporter` | `Trader` | `Student` | `Other`

### Membership Tiers
Users have a `membershipTier` — drives badge display on profile and More screen. Tiers defined in backend (not specified in frontend — render whatever value comes from API).

### Revenue Model (relevant to frontend)
- **VPN subscription** — monthly/annual plans, shown in vpn-dashboard and renewal sheet
- **Calling** — per-minute rates, deducted from `walletStore.callBalance`
- **Shipping commissions** — baked into quote prices shown to user
- **Warehouse storage** — per-day fees shown in item storage bar
- **Visa service fee** — shown in visa step-3-payment
- **Flight booking** — commission baked into price

---

## 3. Tech Stack

| Category | Library | Version |
|---|---|---|
| Framework | React Native + Expo managed | SDK 51 |
| Language | TypeScript | strict mode |
| Routing | Expo Router | v3 (file-based) |
| Styling | NativeWind | v4 (Tailwind for RN) |
| Global state | Zustand + AsyncStorage | latest |
| Server state | TanStack Query | v5 |
| Forms | React Hook Form + Zod | latest |
| Animation | Reanimated | v3 |
| Gestures | Gesture Handler | latest |
| Bottom sheets | @gorhom/bottom-sheet | latest |
| Images | expo-image | latest (NOT RN Image) |
| Notifications | expo-notifications | latest |
| File system | expo-file-system + expo-sharing | latest |
| File picker | expo-document-picker | latest |
| Image picker | expo-image-picker | latest |
| Biometric | expo-local-authentication | latest |
| Clipboard | expo-clipboard | latest |
| Network | @react-native-community/netinfo | latest |
| i18n | i18next + react-i18next | latest |
| Date utils | date-fns | latest |
| SVG | react-native-svg | latest |
| QR code | react-native-qrcode-svg | latest |
| Deep links | Expo Router scheme | `tradelife://` |

### Key Config Decisions
- `NativeWind className` only — no `StyleSheet.create()` except inside Reanimated animated styles
- `Expo Router v3` file-based routing — no manual React Navigation setup
- `tsconfig.json` strict mode with path alias `@/*` → `./src/*`
- `EXPO_PUBLIC_USE_MOCK=true` enables full UI development without any backend

---

## 4. App Structure & Navigation

```
tradelife/
  app/
    _layout.tsx              Root layout — providers, auth guard, splash
    +not-found.tsx

    (auth)/                  No tab bar — slide_from_right animation
      _layout.tsx
      index.tsx              Splash / Welcome
      language.tsx
      sign-in.tsx
      sign-up.tsx
      otp.tsx
      profile-setup.tsx
      forgot-password.tsx

    (tabs)/                  Main app — custom TabBar
      _layout.tsx            5 tabs: Home | Money | Ship | Travel | More
      index.tsx              Home screen

      money/
        _layout.tsx
        index.tsx            Hub: Send | Receive | Top-Up | Pay Supplier (local state)
        history.tsx
        transaction/[id].tsx

      ship/
        _layout.tsx
        index.tsx            Hub: Quote | Active | Warehouse | Docs (local state)
        quote.tsx
        results.tsx
        cbm-calculator.tsx
        booking-form.tsx
        booking-review.tsx
        booking-success.tsx
        shipment/[id].tsx
        warehouse/
          _layout.tsx
          index.tsx          Warehouse hub
          address.tsx
          declare.tsx
          item/[id].tsx
          photo-review.tsx
          consolidate.tsx
          consolidate-review.tsx
          consolidate-success.tsx

      travel/
        _layout.tsx
        index.tsx
        visa/
          step-1-docs.tsx
          step-2-info.tsx
          step-3-payment.tsx
          step-4-success.tsx
        flights/
          search.tsx
          results.tsx
          detail.tsx
          eticket.tsx

      more/
        _layout.tsx
        index.tsx
        profile.tsx
        profile-edit.tsx
        settings/
          index.tsx
          security.tsx
          notifications.tsx
          language.tsx
        community/
          index.tsx
          create.tsx
          marketplace.tsx
          supplier/[id].tsx

      call/                  Modal screens — slide_from_bottom
        dialer.tsx
        active.tsx
        summary.tsx
```

### Tab Bar
5 tabs, custom `TabBar` component with expo-blur background:

| Tab | Icon | Badge |
|---|---|---|
| Home | house | — |
| Money | wallet | pending transactions count |
| Ship | package | warehouse items count (orange) |
| Travel | airplane | — |
| More | grid | — |

### Auth Guard
`app/_layout.tsx` watches `authStore.isAuthenticated`:
- `false` → redirect to `/(auth)/`
- `true` → redirect to `/(tabs)/`

---

## 5. All Screens — by Workflow

### Workflow 01 — Auth (8 screens)

| Screen file | Stitch folder | Description |
|---|---|---|
| `(auth)/index.tsx` | `1a_splash_light/dark` | Full-screen teal splash, 2.5s auto-navigate |
| `(auth)/language.tsx` | `1b_language_light/dark` | 4 language cards, EN/RW/FR/ZH |
| `(auth)/sign-up.tsx` | `1d_sign_up_light/dark` | RHF form, password strength, referral code |
| `(auth)/otp.tsx` | `1e_otp_light` | 6-digit input, auto-advance, paste, 30s resend |
| `(auth)/profile-setup.tsx` | `1f_profile_setup_light` | Avatar, businessType, StepIndicator |
| `(auth)/sign-in.tsx` | `1c_sign_in_light/dark` | PhoneInput + password, biometric, shake on error |
| `(auth)/forgot-password.tsx` | `1g_forgot_password_light` | Email/phone → success state |

---

### Workflow 02 — Home + VPN (7 screens / states)

| Screen / State | Stitch folder | Description |
|---|---|---|
| Home (VPN connected) | `2a_home_vpn_connected_light/dark` | Full home — nav, VPN card, calling card, tracking, quick actions, FAB |
| Home (VPN disconnected) | `2b_home_vpn_disconnected_light` | VPN card disconnected state |
| VPN server select | `2c_vpn_server_select_light` | BottomSheet: search + server list |
| VPN connecting | `2d_vpn_connecting_light` | Spinner + pulsing text in VPN card |
| VPN dashboard | `2e_vpn_dashboard_light` | Stats: data used / time / speed + disconnect |
| VPN error | `2f_vpn_error_light` | Connection failed + retry |
| VPN subscription expired | `2g_vpn_subscription_expired_light` | Renewal BottomSheet with 2 plans |

**Home screen sections (built as sub-components in `index.tsx`):**
- `<HomeNavBar />` — Avatar + logo + search + bell
- `<VPNCard />` — Reads `vpnStore`, 4 conditional states
- `<CallingCard />` — Teal gradient, reads `walletStore.callBalance`, → dialer
- `<SampleTracking />` — Horizontal FlatList of 100×100pt sample cards
- `<ContainerETA />` — Progress bar with 3 location nodes (Guangzhou → Mombasa → Kigali)
- `<QuickActions />` — 2×4 grid: Send Money, Book Cargo, Visa Kit, My Warehouse, Mentor Chat, Emergency, Buy China, Pay Supplier
- `<FAB />` — Absolute positioned, orange, mic icon

---

### Workflow 03 — Calling (3 screens)

| Screen file | Stitch folder | Description |
|---|---|---|
| `call/dialer.tsx` | `3a_dialer_light` | Balance strip, country selector, keypad, call button |
| `call/active.tsx` | `3c_active_call_light` | Full-screen gradient, timer, cost counter, controls |
| `call/summary.tsx` | `3e_call_ended_summary_light` | Duration, cost, remaining balance, actions |

---

### Workflow 04 — Money & Payments (11 screens / states)

| Screen file | Stitch folder | Description |
|---|---|---|
| `money/index.tsx` | `4a_money_send_light/dark` | Hub with 4 segments (local state — no route change) |
| — SEND segment | `4a_money_send_light` | CurrencyInput RWF, live conversion, recent recipients, fee breakdown |
| — RECEIVE segment | `4b_money_receive_light` | QR code with logo overlay, account details with [Copy] |
| — TOP-UP segment | `4c_money_topup_light` | Balance hero, method radio, quick amount pills |
| — PAY SUPPLIER segment | `4d_money_pay_supplier_light` | Supplier form, RWF→CNY live, saved suppliers |
| *(confirm screen)* | `4e_confirm_send_light` | Recipient + amount + fee table + PIN trigger |
| *(processing state)* | `4g_payment_processing_light` | Spinner + 3-step progress strip |
| *(success state)* | `4h_payment_success_light` | `PaymentSuccess` component |
| *(failed state)* | `4i_payment_failed_light` | `PaymentFailed` component |
| `money/history.tsx` | `4j_transaction_history_light` | Search, filter pills, date-grouped FlatList, infinite scroll |
| `money/transaction/[id].tsx` | `4k_transaction_detail_light` | Status hero, details, timeline, download |

---

### Workflow 05 — Shipping & Warehouse (17 screens)

Ship tab has **4 sub-tabs rendered as local state** (not nested routes):
`Quote` | `Active` | `Warehouse` | `Docs`

#### Part A — Direct Shipping

| Screen file | Stitch folder | Description |
|---|---|---|
| Ship hub (`ship/index.tsx`) | `5a_ship_quote_light` | 4 sub-tab shell |
| `ship/quote.tsx` | `5a_ship_quote_light` | Route card, cargo details, **Shipping Mode radio** (Direct vs Via Warehouse) |
| `ship/results.tsx` | `5b_quote_results_light` | Quote cards: Air / Sea / Express, Best Value badge |
| `ship/cbm-calculator.tsx` | `5c_cbm_calculator_light` | Dynamic rows L×W×H×qty, live CBM, [Use This] |
| `ship/booking-form.tsx` | `5d_booking_form_light` | Step 1 of 3 — pickup, delivery, cargo, add-ons |
| `ship/booking-review.tsx` | `5e_booking_review_light` | Step 2 — summary + wallet check |
| `ship/booking-success.tsx` | `5f_booking_success_light` | Step 3 — animated checkmark + reference |
| `ship/shipment/[id].tsx` | `5h_shipment_detail_light` | Status hero, map placeholder, tracking timeline, docs |

Active sub-tab (inside `ship/index.tsx`):
- FlatList of `ShipmentCard` — handles both `in_transit` AND `in_warehouse` variants
- `in_warehouse` card → taps to `ship/warehouse/index`

Docs sub-tab (inside `ship/index.tsx`):
- Search + filter + document list grouped by shipment
- Upload via `expo-document-picker`, download via `expo-file-system`

#### Part B — Warehouse

| Screen file | Stitch folder | Description |
|---|---|---|
| `ship/warehouse/index.tsx` | `5j_warehouse_hub_light/dark` | Address card + stats + filter + item list + selection mode |
| `ship/warehouse/address.tsx` | `5k_warehouse_address_light` | Full address, Chinese toggle, share buttons |
| `ship/warehouse/declare.tsx` | `5l_declare_goods_light` | Declare incoming goods form |
| `ship/warehouse/item/[id].tsx` | `5m_goods_received_light` | Item detail, photos, storage bar, actions |
| `ship/warehouse/photo-review.tsx` | `5n_photo_review_light` | Carousel, pinch-zoom, assessment, approve/report |
| `ship/warehouse/consolidate.tsx` | `5o_select_consolidate_light` | Select items, totals bar, savings callout |
| `ship/warehouse/consolidate-review.tsx` | `5p_consolidation_review_light` | Summary, shipping options, wallet check, PIN |
| `ship/warehouse/consolidate-success.tsx` | `5q_consolidation_success_light` | Success + next steps timeline |

**Warehouse hub features:**
- Pinned teal gradient header with `referenceCode` from `warehouseStore`
- `[Copy Address]` → `expo-clipboard` + "Copied ✓" toast
- `[Share to Supplier]` → `Share.share()` with formatted address text
- Stats strip: Items count | Total weight | Oldest item storage day (color: green→yellow→red at 20/27 days)
- Filter pills: All | Waiting | Received | Ready
- Selection mode: activated by `[Select & Ship Items]` → checkboxes on cards → sticky totals bar slides up

---

### Workflow 06 — Travel (9 screens)

| Screen file | Stitch folder | Description |
|---|---|---|
| `travel/index.tsx` | `6a_travel_hub_light` | Hero, 2×2 service grid, travel tips FlatList |
| `travel/visa/step-1-docs.tsx` | `6b_visa_step1_light` | Document checklist + upload progress |
| `travel/visa/step-2-info.tsx` | `6c_visa_step2_light` | Personal details form |
| `travel/visa/step-3-payment.tsx` | `6d_visa_step3_light` | Fee card + PIN payment |
| `travel/visa/step-4-success.tsx` | `6e_visa_step4_light` | `PaymentSuccess` + status timeline |
| `travel/flights/search.tsx` | `6f_flight_search_light` | Trip type, From/To, dates, passengers, class |
| `travel/flights/results.tsx` | `6g_flight_results_light` | FlightCard FlatList + Best Deal badge |
| `travel/flights/detail.tsx` | `6h_flight_detail_light` | Hero, fare rules, seat map grid |
| `travel/flights/eticket.tsx` | `6i_eticket_light` | Ticket card, QR, share/save |

---

### Workflow 07 — Community (4 screens)

| Screen file | Stitch folder | Description |
|---|---|---|
| `more/community/index.tsx` | `7a_community_feed_light` | Filter tabs, PostCard FlatList, like (optimistic), compose FAB |
| `more/community/create.tsx` | `7b_create_post_light` | Growing textarea, image picker, category chips, char counter |
| `more/community/marketplace.tsx` | `7c_marketplace_light` | Search, location filter, category grid, supplier cards |
| `more/community/supplier/[id].tsx` | `7d_supplier_detail_light` | Hero, info, stats, products, reviews, WeChat/WhatsApp contact |

---

### Workflow 08 — More, Settings, System (10 screens)

| Screen file | Stitch folder | Description |
|---|---|---|
| `more/index.tsx` | `8a_more_screen_light/dark` | Profile gradient header, sectioned menu, logout |
| `more/profile.tsx` | `8b_profile_view_light` | Hero gradient, stats strip, info, membership card |
| `more/profile-edit.tsx` | `8c_profile_edit_light` | Avatar picker, form, `useBeforeRemove` discard guard |
| `more/settings/index.tsx` | `8d_settings_light/dark` | Search-filtered list, Dark Mode toggle → `theme.toggleTheme()` |
| `more/settings/security.tsx` | `8e_security_settings_light` | Circular score (SVG arc), security items list |
| `more/settings/notifications.tsx` | `8f_notification_settings_light` | Master toggle, section sub-toggles, balance threshold |
| `more/settings/language.tsx` | — | Language list, `i18n.changeLanguage()` + persist |
| *(system state)* | `8g_no_internet_light` | Offline bar — implemented inside `Screen.tsx` |
| *(system state)* | `8i_empty_states_light` | Reference for `EmptyState` component |
| *(system state)* | `8j_loading_states_light` | Reference for `Skeleton` shimmer component |

---

## 6. Design System

> ⚠️ **Source of truth:** All values below were extracted from the Stitch design exports in `Prompt 2` of the Claude Code build series and written into `src/constants/`. Do not hardcode any of these values — always import from constants.

### Color Architecture

```ts
// src/constants/colors.ts
export const Colors = {
  // Brand
  primary,        // Deep teal — nav bg, CTA buttons, VPN card bg
  primaryLight,   // Lighter teal — gradients, active states
  primaryDark,    // Darker teal
  accent,         // Orange — FAB, highlights, warehouse badge

  // Semantic
  success,        // Green — badges, VPN connected, approved
  error,          // Red — badges, errors, VPN disconnected
  warning,        // Amber — badges, storage day warning
  info,           // Blue — informational badges

  // Neutrals (light mode)
  background,     // Page background
  surface,        // Card background
  textPrimary,    // Main body text
  textSecondary,  // Muted text, captions
  textMuted,      // Placeholders
  border,         // Input borders, card borders
  divider,        // Section separators
  inputBg,        // Form input fill

  // Dark mode overrides
  dark: { background, surface, surface2, textPrimary, textSecondary, border, divider, inputBg },

  // Badge fills (bg color paired with semantic text color)
  successBg, errorBg, warningBg, infoBg, neutralBg,

  // Wallet-specific brand colors
  wechat:    '#07C160',
  alipay:    '#1677FF',
  whatsapp:  '#25D366',
} as const;
```

### Typography Scale

All values extracted from Stitch exports. React Native unitless numbers (no px).

```ts
// src/constants/typography.ts
export const Typography = {
  h1:      { fontSize, fontWeight: '700', lineHeight },
  h2:      { fontSize, fontWeight: '700', lineHeight },
  h3:      { fontSize, fontWeight: '600', lineHeight },
  body:    { fontSize, fontWeight: '400', lineHeight },
  bodySm:  { fontSize, fontWeight: '400', lineHeight },
  caption: { fontSize, fontWeight: '400', lineHeight },
  label:   { fontSize, fontWeight: '600', lineHeight, letterSpacing },  // section labels
  button:  { fontSize, fontWeight: '600', lineHeight },
} as const;
```

### Spacing & Radius

```ts
// src/constants/spacing.ts
export const Spacing  = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const Radius   = { sm, md, lg, full: 999 } as const;  // values from designs
export const Elevation = {
  1: { shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation: 2 },
  2: { ...elevation: 4 },
  3: { ...elevation: 8 },
} as const;
```

### Theme System

```ts
// src/theme/index.ts
interface ThemeType {
  background, surface, surface2, textPrimary, textSecondary,
  textMuted, border, divider, inputBg, cardBg, tabBarBg, tabBarBorder
}

// useTheme() hook
const { theme, isDark, toggleTheme } = useTheme();
```
`useTheme()` reads from `settingsStore.colorScheme`, persists to `AsyncStorage`.

### Tailwind Extension
All `Colors` keys are mapped in `tailwind.config.js` so NativeWind classes work:
```
bg-primary  text-accent  border-success  bg-warningBg  etc.
```

---

## 7. Stitch Design Exports

### File Location
```
tradelife/
  designs/                          ← renamed from stitch_china_buyers/
    5l_declare_goods_light/         ← one folder per screen variant
      code.html                     ← CSS source of truth for layout
      screen.png                    ← visual reference
    5l_declare_goods_dark/
      code.html
      screen.png
    ...
```

### Naming Convention
```
[workflow-number][screen-letter]_[screen_name]_[light|dark]
```
Examples:
- `1a_splash_light` — Workflow 1, screen A, light mode
- `5l_declare_goods_light` — Workflow 5, screen L, light mode
- `2a_home_vpn_connected_dark` — Workflow 2, screen A, dark mode

### How Claude Code Uses These Files
For **every screen it builds**, Claude Code must:
1. **Read `code.html`** — extract layout structure, element order, sizing from CSS
2. **View `screen.png`** — confirm visual layout matches HTML
3. **Build the RN screen** — translate DOM structure → RN View/Text/Pressable hierarchy

> ❗ **Critical rule:** `code.html` is used for **layout structure only** after Prompt 2. Colors and typography are NEVER re-extracted from HTML in Prompts 3–10. Always use `src/constants/colors.ts` and `src/constants/typography.ts`.

### The 5 Screens Used for Design System Extraction (Prompt 2)

These 5 screens were chosen because together they contain every color, type style, and component state used across the entire app:

| Screen | Folder | What it covers |
|---|---|---|
| Home (VPN connected) | `2a_home_vpn_connected_light/dark` | All brand colors, gradients, cards, badges, quick actions |
| Money send | `4a_money_send_light/dark` | All form states, inputs, exchange rate ribbon, tab bar |
| Warehouse hub | `5j_warehouse_hub_light` | All 5 badge variants, status colors, item cards, stats |
| Sign up | `1d_sign_up_light` | Full typography scale, button variants, form labels |
| More screen | `8a_more_screen_light/dark` | Section dividers, menu rows, dark mode surfaces |

---

## 8. Data & State Architecture

### Zustand Stores

All stores use `persist` middleware with `AsyncStorage`.

#### `authStore`
```ts
state:   user: UserType | null
         token: string | null
         isAuthenticated: boolean
         isLoading: boolean
         preferredLanguage: 'en' | 'rw' | 'fr' | 'zh'
         onboardingComplete: boolean
actions: setUser, setToken, logout, setLanguage
```

#### `walletStore`
```ts
state:   balance: number          // RWF
         callBalance: number      // RWF — separate pool for calling
         transactions: TransactionType[]
         pendingCount: number
         savedSuppliers: SupplierType[]
actions: deduct(amount), credit(amount), setTransactions, addSupplier
```

#### `vpnStore`
```ts
state:   isConnected: boolean
         isConnecting: boolean
         server: { name, country, ping } | null
         daysRemaining: number
         subscriptionActive: boolean
actions: connect(serverId), disconnect, setServer
```

#### `shipmentStore`
```ts
state:   shipments: ShipmentType[]
         isLoading: boolean
actions: setShipments, updateShipment
```

#### `warehouseStore`
```ts
state:   items: WarehouseItemType[]
         referenceCode: string      // e.g. "TL-RW-00123"
         storageAddress: AddressType
         totalWeight: number
         totalCbm: number
computed: itemsReadyToShip         // items where status === 'received'
actions:  setItems, addItem, updateItem, removeItem
```

#### `settingsStore`
```ts
state:   colorScheme: 'light' | 'dark' | 'system'
         language: string
         notificationPrefs: { shipping, payments, vpn, community, lowBalance }
actions: setColorScheme, setLanguage, setNotificationPref
```

#### `callStore`
```ts
state:   isInCall: boolean
         duration: number         // seconds
         cost: number             // RWF accumulated
         remoteNumber: string
         status: 'idle' | 'connecting' | 'active' | 'held' | 'ended'
actions: startCall, endCall, toggleMute, toggleSpeaker
```

---

### Domain Types (`src/types/domain.types.ts`)

```ts
UserType {
  id, fullName, email, phone, countryCode, businessType,
  avatar, membershipTier, createdAt
}

TransactionType {
  id, type, amount, currency, recipient?, method,
  status: 'pending' | 'completed' | 'failed',
  reference, createdAt, fees
}

ShipmentType {
  id, status, route, method: 'air' | 'sea' | 'express',
  weight, cbm, eta, progress: number,   // 0–1
  trackingEvents: TrackingEvent[],
  cost, documents: Document[]
}

WarehouseItemType {
  id, description, category, declaredQty, actualQty,
  weight, cbm,
  status: 'waiting' | 'received' | 'review_needed' | 'ready' | 'shipped',
  supplier, arrivedAt, photos: string[],
  storageDay: number,
  notes?, discrepancy?
}
```

---

### API Layer (`src/services/api.ts`)

- Axios instance, `baseURL = EXPO_PUBLIC_API_URL`
- Request interceptor: `Authorization: Bearer {token}` from `authStore`
- Response interceptor: `401` → `authStore.logout()` + redirect to sign-in
- Timeout: 15 seconds
- Retry: 2× on network errors (not on 4xx/5xx)
- **Mock mode:** `EXPO_PUBLIC_USE_MOCK=true` → all requests return typed data from `src/services/mocks/index.ts`

### TanStack Query Config
```ts
defaultOptions: {
  queries:   { staleTime: 5min, gcTime: 30min, retry: 2 }
  mutations: { onError: (err) => toast.show(err.message, 'error') }
}
// Exchange rate override per-query:
useExchangeRate: { staleTime: 30_000 }  // 30 seconds
```

---

## 9. Payment Model

> This is the most important product decision for frontend developers to understand.

**Users always pay in RWF. The platform handles all CNY conversion on the backend.**

| Scenario | What user sees | What happens |
|---|---|---|
| Send money to China | CurrencyInput in RWF, live preview of CNY equivalent | Backend deducts RWF, sends CNY to supplier |
| Pay supplier | Same — RWF input, CNY preview via `useExchangeRate()` | Backend handles conversion |
| Top up wallet | MTN/Airtel MoMo or card → credited in RWF | No currency conversion |
| Calling | Balance shown in RWF. Per-minute rate shown at top of dialer | Deducted from `walletStore.callBalance` |
| Shipping booking | Price shown in both USD and RWF (converted at current rate) | User pays from RWF wallet |
| Warehouse consolidation | Price shown in RWF | Same |

### `walletStore.balance` is the source of truth
Before any payment screen shows a `[Confirm]` / `[Continue]` button, check:
```ts
if (walletStore.balance < totalCost) {
  // Show [Top Up Wallet] button instead of [Confirm]
}
```
This check is required on: `booking-review.tsx`, `consolidate-review.tsx`, `visa/step-3-payment.tsx`.

### `PINBottomSheet` is the universal auth gate
Every single payment in the app goes through `PINBottomSheet.open()` before the mutation fires. Never build a payment flow without PIN confirmation.

---

## 10. Key Components Reference

All components are exported from `src/components/index.ts`. Import as:
```ts
import { Button, Card, Screen, PINBottomSheet } from '@/components';
```

### Layout

| Component | Props | Notes |
|---|---|---|
| `Screen` | `scroll`, `padding`, `safeArea`, `backgroundColor`, `refreshControl` | **EVERY screen uses this** — handles SafeAreaView, KeyboardAvoidingView, ScrollView, offline bar |
| `Header` | `title`, `subtitle`, `leftAction`, `rightActions[]`, `transparent`, `large` | Default left = back arrow |
| `TabBar` | Expo Router tab props | Custom — expo-blur bg, 5 tabs, warehouse badge |
| `BottomSheet` | `snapPoints`, `onClose`, `showHandle` | @gorhom wrapper. `ref.expand()` / `ref.close()` |

### UI Primitives

| Component | Variants / Props | Notes |
|---|---|---|
| `Button` | `primary` `secondary` `ghost` `danger` / sm md lg | Reanimated scale press, haptic, loading Spinner |
| `Input` | default / focused / error / success / disabled | 52pt height, RHF compatible |
| `Card` | elevation 1–3, padding, radius, onPress, accentColor | Left strip when accentColor set |
| `Badge` | `success` `warning` `error` `info` `neutral` / sm md / dot | Pulsing dot for live states |
| `Avatar` | src, name (initials fallback), size, badge overlay | — |
| `Toggle` | value, onChange | iOS-style Reanimated thumb |
| `ProgressBar` | progress (0–1), color, height | Reanimated spring |
| `Skeleton` | width, height, radius | Shimmer loop via LinearGradient |
| `EmptyState` | icon, title, description, action | — |
| `Spinner` | size (sm/md/lg), color | Reanimated rotation |
| `Toast` | via `useToast()` hook | Slide from top, auto-dismiss |

### Forms

| Component | Notes |
|---|---|
| `FormField` | Label + Input + error. Wrapper for RHF Controller. |
| `PhoneInput` | Country picker (BottomSheet) + number input. Default: RW +250 |
| `CurrencyInput` | 40pt centered number, thousand separators, `[Max]` pill, `convertedAmount` display |
| `Dropdown` | Opens BottomSheet FlatList |
| `DatePicker` | BottomSheet calendar or `DateTimePicker` |

### Shared / Feature

| Component | Where reused |
|---|---|
| `PINBottomSheet` | ALL payment auth — Money, Shipping, Warehouse, Travel |
| `PaymentSuccess` | All successful payment outcomes |
| `PaymentFailed` | All failed payment outcomes |
| `StepIndicator` | Sign-up, Shipping booking (3 steps), Visa wizard (4 steps) |
| `ExchangeRateRibbon` | Money hub (all segments), Pay Supplier, Warehouse consolidation |
| `ShipmentCard` | Active tab — handles `in_transit` + `in_warehouse` variant |
| `WarehouseItemCard` | Warehouse hub + consolidation — `selectable` prop adds checkbox |
| `TransactionRow` | History screen — React.memo wrapped |
| `WalletBalance` | Compact balance anywhere it's needed |
| `VPNServerSheet` | Home VPN card toggle → opens this |
| `RateTimer` | Countdown timer, color shifts green→yellow→red |

---

## 11. Hard Rules — Non-Negotiable

These rules apply to every file in `src/`. No exceptions.

```
1. NativeWind className ONLY
   No StyleSheet.create() except inside Reanimated animated styles.
   ✅  <View className="bg-primary p-4 rounded-lg">
   ❌  <View style={{ backgroundColor: '#0A4B4B', padding: 16 }}>

2. Every screen uses <Screen>
   Import from @/components. Never raw SafeAreaView in a screen file.
   ✅  return <Screen scroll padding><YourContent /></Screen>
   ❌  return <SafeAreaView><ScrollView>...

3. Colors from constants only
   ✅  className="bg-primary"  or  Colors.primary
   ❌  style={{ backgroundColor: '#0A4B4B' }}

4. All user-visible text through i18n
   ✅  {t('ship.warehouse.copyAddress')}
   ❌  {"Copy Address"}

5. Forms use React Hook Form + Zod
   Schemas live in src/utils/validation.ts.
   ✅  const { control } = useForm<SignUpForm>({ resolver: zodResolver(signUpSchema) })

6. API calls only through src/services
   ✅  const { data } = useShipments()   // from shipment.service.ts
   ❌  const res = await fetch('/api/shipments')   // never in a component

7. No `any` types. Ever.
   ✅  const items: WarehouseItemType[] = ...
   ❌  const items: any[] = ...

8. FlatList items: React.memo + useCallback
   ✅  const renderItem = useCallback(({ item }) => <ItemCard item={item} />, [])
       export default React.memo(ItemCard)
   ❌  renderItem={({ item }) => <ItemCard item={item} />}  // inline, re-renders everything
```

---

## 12. Folder Structure

```
tradelife/
  designs/                    ← Stitch exports (one folder per screen)
  src/
    app/                      ← Expo Router file-based routes (see Section 4)
    components/
      ui/                     Button, Input, Card, Badge, Avatar, Toggle,
                               ProgressBar, Skeleton, EmptyState, Spinner, Toast
      layout/                 Screen, Header, TabBar, BottomSheet
      forms/                  FormField, PhoneInput, CurrencyInput, Dropdown, DatePicker
      shared/                 ExchangeRateRibbon, WalletBalance, StepIndicator,
                               PINBottomSheet, PaymentSuccess, PaymentFailed,
                               ShipmentCard, WarehouseItemCard, TransactionRow,
                               VPNServerSheet, RateTimer
      index.ts                Barrel export — import everything from @/components
    stores/                   authStore, walletStore, vpnStore, shipmentStore,
                               warehouseStore, settingsStore, callStore
    services/
      api.ts                  Axios instance + interceptors
      auth.service.ts
      wallet.service.ts
      shipment.service.ts
      warehouse.service.ts
      exchange.service.ts
      vpn.service.ts
      call.service.ts
      mocks/index.ts          Mock data for all entities (EXPO_PUBLIC_USE_MOCK)
    hooks/                    useAuth, useTheme, useToast, useExchangeRate,
                               useNetworkStatus, useAppRouter
    constants/
      colors.ts               ← extracted from Stitch in Prompt 2 — DO NOT hand-edit
      typography.ts           ← extracted from Stitch in Prompt 2 — DO NOT hand-edit
      spacing.ts              ← extracted from Stitch in Prompt 2
      routes.ts               Typed ROUTES object — all app paths
      config.ts               Env vars + app-level config
    theme/
      index.ts                ThemeContext + useTheme()
      light.ts                ThemeType values for light mode
      dark.ts                 ThemeType values for dark mode
    types/
      domain.types.ts         All entity types
      navigation.types.ts     Route param lists
    utils/
      format.ts               Currency, date, phone formatters
      validation.ts           All Zod schemas
      storage.ts              AsyncStorage helpers
      haptics.ts              Haptic feedback helpers
    i18n/
      index.ts                i18next init
      locales/
        en.json               Complete — all user-visible strings
        rw.json               Stub — same keys, empty values
        fr.json               Stub
        zh.json               Stub
  tailwind.config.js
  babel.config.js
  tsconfig.json               strict + "@/*" path alias
  app.json                    name: TradeLife, scheme: tradelife
  .env.example
```

---

## 13. Environment & Config

```bash
# .env.example
EXPO_PUBLIC_API_URL=https://api.tradelife.app
EXPO_PUBLIC_USE_MOCK=true
```

### Deep Link Scheme
`tradelife://` — configured in `app.json`

Handled notification deep links:
| Notification type | Navigates to |
|---|---|
| `shipment_update` | `/(tabs)/ship/shipment/[id]` |
| `warehouse_arrived` | `/(tabs)/ship/warehouse/item/[id]` |
| `payment_received` | `/(tabs)/money/transaction/[id]` |
| `vpn_expiring` | `/(tabs)/more/settings` |
| `call_balance_low` | `/(tabs)/call/dialer` |

---

## 14. Claude Code — How to Use the Prompt Series

The project is built using **10 sequential Claude Code prompts**. Each prompt = one clean commit.

| Prompt | What it builds | Design files needed |
|---|---|---|
| **1 — Scaffold** | Full folder structure + stub files + all config | None |
| **2 — Design System** | `colors.ts`, `typography.ts`, `spacing.ts`, theme, Tailwind extension | 5 specific screens (see Section 7) |
| **3 — Components** | All 30+ reusable components | Various `_light` screens for sizing reference |
| **4 — Navigation + Stores + API** | All Zustand stores, API layer, i18n, route types | None |
| **5 — Auth** | 7 auth screens | `1a`–`1g` Stitch folders |
| **6 — Home + VPN** | Home screen + all VPN states | `2a`–`2g` Stitch folders |
| **7 — Money + Calling** | 11 money screens + 3 calling screens | `4a`–`4k`, `3a`–`3e` Stitch folders |
| **8 — Ship + Warehouse** | 17 screens across direct shipping + warehouse | `5a`–`5q` Stitch folders |
| **9 — Travel + Community + More** | 25 screens | `6a`–`6i`, `7a`–`7d`, `8a`–`8j` Stitch folders |
| **10 — Wiring + Polish** | API services, push notifications, performance, accessibility, README | None |

### Before Starting
1. Rename `stitch_china_buyers/` → `designs/` and move to project root
2. Confirm `designs/2a_home_vpn_connected_light/`, `designs/4a_money_send_light/`, etc. exist
3. Copy `.env.example` → `.env` with `EXPO_PUBLIC_USE_MOCK=true`

### Resume Header (paste at top of every new Claude Code session)
```
Project: TradeLife — Rwanda-China trade super-app.
Stack: Expo SDK 51, React Native 0.74, TypeScript strict, Expo Router v3,
  NativeWind v4, Zustand, TanStack Query v5, RHF + Zod, Reanimated v3.

Design files: designs/ at project root.
  Folder naming: [wf-id]_[screen]_[light|dark]/code.html + screen.png
  ONLY read code.html for LAYOUT. Colors/typography are in src/constants/.
  NEVER re-extract colors from HTML after Prompt 2 — use constants always.

HARD RULES: (1) NativeWind className only (2) <Screen> wraps all screens
  (3) Colors from @/constants/colors (4) Text via i18n t()
  (5) RHF + Zod for all forms (6) API through @/services only
  (7) No `any` types (8) FlatList: React.memo + useCallback

TABS: Home | Money | Ship | Travel | More
SHIP sub-tabs: Quote | Active | Warehouse | Docs (local state, not routes)
MONEY segments: Send | Receive | Top-Up | Pay Supplier (local state)
PAYMENT: users pay RWF, platform handles CNY. walletStore.balance = truth.
WAREHOUSE: warehouseStore.referenceCode = user ID (TL-RW-XXXXX).
PINBottomSheet + PaymentSuccess/PaymentFailed = reused for ALL payments.
MOCK: EXPO_PUBLIC_USE_MOCK=true → all data from services/mocks/index.ts.
```

### Commit Strategy
```bash
git add . && git commit -m "feat: prompt-1-scaffold"
git tag prompt-1-done
# repeat after every prompt
```

If a prompt produces errors, roll back to the previous tag and retry:
```bash
git checkout prompt-3-done  # go back to last known good state
```

---

## 15. Glossary

| Term | Meaning |
|---|---|
| **3PL** | Third-Party Logistics — TradeLife's Guangzhou warehouse |
| **CBM** | Cubic Metre — volume unit used for sea freight |
| **Consolidation** | Combining multiple warehouse items into one shipment |
| **referenceCode** | User's warehouse ID, e.g. `TL-RW-00123` — used as delivery address for suppliers |
| **Stitch** | Google Stitch — the design tool used to create all app screens |
| **NativeWind** | Tailwind CSS adapted for React Native (uses `className` prop) |
| **Expo Router** | File-based routing for React Native (like Next.js but for mobile) |
| **RHF** | React Hook Form |
| **Mock mode** | `EXPO_PUBLIC_USE_MOCK=true` — enables full UI dev without any backend |
| **PINBottomSheet** | Universal 6-digit PIN auth component used before every payment mutation |
| **Local state tabs** | Ship and Money hubs use `useState` for sub-tabs — no nested routes |
| **in_transit** | ShipmentCard variant: cargo currently shipping |
| **in_warehouse** | ShipmentCard variant: cargo held at TradeLife Guangzhou warehouse |

---

*Last updated: March 2026 — v3 of build prompt series*