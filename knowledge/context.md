# TRADELIFE — AI FAST-START CONTEXT
> Read this file first. ~3 min. Full project in 200 lines. See knowledge/screens.md for screen/design map.

---

## WHAT IS IT
Rwanda-China trade super-app. Rwandan importers source from China, consolidate at TradeLife's Guangzhou warehouse, ship to Rwanda, pay suppliers.
**Device:** iPhone 14 Pro 393×852pt | **Modes:** Light + Dark | **Lang:** EN / RW / FR / ZH

---

## STACK — quick ref

| Layer        | Tool                          | Notes                                |
|--------------|-------------------------------|--------------------------------------|
| Framework    | Expo SDK 51 / RN 0.74        | Managed workflow                     |
| Language     | TypeScript strict             | No `any`. No exceptions.             |
| Routing      | Expo Router v3                | File-based, src/app/                 |
| Styling      | NativeWind v4                 | `className` ONLY — no StyleSheet     |
| Global state | Zustand + AsyncStorage        | src/stores/                          |
| Server state | TanStack Query v5             | staleTime 5min, exchange rate 30s    |
| Forms        | React Hook Form + Zod         | Schemas in src/utils/validation.ts   |
| Animation    | Reanimated v3                 | Required on all interactive elements |
| Bottom sheets| @gorhom/bottom-sheet v4       | via BottomSheet component            |
| Images       | expo-image                    | NOT React Native Image               |
| Icons        | @expo/vector-icons MaterialIcons | Bundled, no install needed        |
| i18n         | i18next + react-i18next       | src/i18n/locales/en.json             |
| Dates        | date-fns v3                   |                                      |

**Path alias:** `@/*` → `src/*`
**Mock mode:** `EXPO_PUBLIC_USE_MOCK=true` → all data from `src/services/mocks/index.ts`

---

## FOLDER MAP

```
src/
  app/
    _layout.tsx              Root — providers, auth guard (isAuthenticated → (auth)/ or (tabs)/)
    (auth)/                  No tab bar, slide_from_right
      index.tsx              Welcome screen (1b_welcome)
      splash.tsx             Splash (auto-nav 2.5s)
      language.tsx           Lang select (1c)
      sign-up.tsx            (1d) RHF form, password strength
      otp.tsx                (1e) 6-digit, auto-advance, 30s resend
      profile-setup.tsx      (1f) Avatar, businessType, StepIndicator
      sign-in.tsx            (1h) Biometric, shake on error
      forgot-password.tsx    (1i) Email/phone → 1j success state
      permissions.tsx        (1g) permission request screen
    (tabs)/                  Custom TabBar — Home|Money|Ship|Travel|More
      index.tsx              Home (VPN card + Calling + tracking + quick actions + FAB)
      money/
        index.tsx            Hub: Send|Receive|Top-Up|Pay Supplier (LOCAL STATE — no sub-routes)
        history.tsx
        transaction/[id].tsx
      ship/
        index.tsx            Hub: Quote|Active|Warehouse|Docs (LOCAL STATE)
        quote.tsx  results.tsx  cbm-calculator.tsx
        booking-form.tsx  booking-review.tsx  booking-success.tsx
        shipment/[id].tsx
        warehouse/
          index.tsx  address.tsx  declare.tsx  item/[id].tsx
          photo-review.tsx  consolidate.tsx  consolidate-review.tsx  consolidate-success.tsx
      travel/
        index.tsx            Hero + 2×2 service grid
        visa/  step-1-docs.tsx  step-2-info.tsx  step-3-payment.tsx  step-4-success.tsx
        flights/  search.tsx  results.tsx  detail.tsx  eticket.tsx
      more/
        index.tsx  profile.tsx  profile-edit.tsx
        settings/  index.tsx  security.tsx  notifications.tsx  language.tsx
        community/  index.tsx  create.tsx  marketplace.tsx  supplier/[id].tsx
      call/                  Modal — slide_from_bottom
        dialer.tsx  active.tsx  summary.tsx
  components/
    ui/      Button Input Card Badge Avatar Toggle ProgressBar Skeleton EmptyState Spinner Toast
    layout/  Screen Header TabBar BottomSheet
    forms/   FormField PhoneInput CurrencyInput Dropdown DatePicker
    shared/  PINBottomSheet PaymentSuccess PaymentFailed ExchangeRateRibbon
             StepIndicator WalletBalance ShipmentCard WarehouseItemCard TransactionRow
             VPNServerSheet RateTimer
    index.ts ← barrel export — import { Button, Card, Screen } from '@/components'
  constants/ colors.ts  typography.ts  spacing.ts  routes.ts  config.ts
  stores/    authStore  walletStore  vpnStore  shipmentStore  warehouseStore  settingsStore  callStore
  services/  api.ts  auth  wallet  shipment  warehouse  exchange  vpn  call  mocks/
  hooks/     useAuth  useTheme  useToast  useExchangeRate  useNetworkStatus  useAppRouter
  theme/     index.ts (ThemeProvider, useTheme)  light.ts  dark.ts
  types/     domain.types.ts  navigation.types.ts
  utils/     format.ts  validation.ts  storage.ts  haptics.ts
  i18n/      index.ts  locales/en.json (complete) rw.json fr.json zh.json (stubs)
```

---

## HARD RULES — 8 unbreakables

```
[1] STYLE    NativeWind className for layout. style={} only for dynamic theme colors.
             ✅ <View className="flex-1 px-4 rounded-xl" style={{ bg: theme.surface }}>
             ❌ StyleSheet.create()  ❌ raw hex anywhere

[2] SCREEN   Every screen MUST start with <Screen> from @/components
             ✅ return <Screen scroll padding><Content /></Screen>
             ❌ <SafeAreaView>  ❌ raw <ScrollView> as root

[3] COLORS   From constants only — never hardcode hex
             ✅ className="bg-primary"  or  Colors.primary  or  theme.surface
             ❌ '#0b4c4c'  ❌ '#ffffff'

[4] TEXT     All user-visible strings via i18n
             ✅ {t('ship.warehouse.copyAddress')}
             ❌ {"Copy Address"}   — add key to en.json BEFORE using

[5] FORMS    React Hook Form + Zod. Schemas in src/utils/validation.ts
             ✅ useForm({ resolver: zodResolver(schema) })

[6] API      src/services/ only. Never fetch/axios in components/screens.
             ✅ const { data } = useShipments()   // from shipment.service.ts

[7] TYPES    No `any`. Strict mode on.
             ✅ const items: WarehouseItemType[] = ...

[8] LISTS    FlatList items MUST use React.memo + useCallback
             ✅ const renderItem = useCallback(({item}) => <Card item={item} />, [])
                export default React.memo(Card)

[9] SIZE     Never write a screen/component file exceeding 1000 lines.
             If a screen would exceed 1000 lines, extract sub-components into
             src/components/shared/ or a dedicated folder (e.g. src/app/(tabs)/home/).
             ✅ HomeScreen <300 lines, imports HomeVPNCard, HomeCallingCard, etc.
             ❌ index.tsx with 1000+ lines of inline components
```

---

## PAYMENT MODEL (CRITICAL)

| Scenario | User sees | Backend does |
|---|---|---|
| Send money | RWF input, CNY preview | Deducts RWF, sends CNY |
| Pay supplier | RWF input, CNY preview via useExchangeRate() | Converts on backend |
| Top up wallet | MTN/Airtel MoMo or card | Credits RWF |
| Calling | Balance in RWF, per-min rate shown | Deducts walletStore.callBalance |
| Shipping / Visa | Price in USD+RWF | User pays from RWF wallet |

**Pre-confirm check required on:** booking-review, consolidate-review, visa/step-3-payment
```ts
if (walletStore.balance < totalCost) { /* show TopUp button, not Confirm */ }
```

**PIN gate:** Every payment → `PINBottomSheet.open()` first. No exceptions.

---

## ZUSTAND STORES — state shape

| Store | Key state | Key actions |
|---|---|---|
| authStore | user, token, isAuthenticated, preferredLanguage | setUser, logout, setLanguage |
| walletStore | balance (RWF), callBalance (RWF), transactions, savedSuppliers | deduct, credit |
| vpnStore | isConnected, isConnecting, server, daysRemaining, subscriptionActive | connect, disconnect |
| shipmentStore | shipments, isLoading | setShipments, updateShipment |
| warehouseStore | items, referenceCode (TL-RW-XXXXX), storageAddress, totalWeight | setItems, addItem |
| settingsStore | colorScheme, language, notificationPrefs | setColorScheme, setLanguage |
| callStore | isInCall, duration, cost, status (idle/connecting/active/held/ended) | startCall, endCall |

---

## DESIGN FILES

```
designs/                          ← All Stitch exports
  [id]_[name]_[light|dark]/
    code.html                     ← LAYOUT ONLY — DOM structure, sizing, element order
    screen.png                    ← Visual reference

RULE: Use code.html for layout structure ONLY.
      Colors and typography ALWAYS from src/constants/ — NEVER re-extract from HTML.
```

**Numbered convention:** `[wf][screen]_[name]_[mode]`  e.g. `2a_home_vpn_connected_light`
**Non-numbered (newer):** descriptive names e.g. `travel_hub_light`, `visa_step_1_light`

See `knowledge/screens.md` for full design folder → screen file mapping.

---

## COMPONENT USAGE PATTERNS

```ts
// Theme access
const theme = useTheme();  // returns ThemeType (background, surface, textPrimary, etc.)

// Toast
const { showToast } = useToast();
showToast('Message', 'success' | 'error' | 'info' | 'warning');

// Navigation
import { ROUTES } from '@/constants/routes';
router.push(ROUTES.MONEY);

// Reanimated press feedback (apply to every interactive element)
const scale = useSharedValue(1);
const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
onPressIn: () => { scale.value = withSpring(0.96); }
onPressOut: () => { scale.value = withSpring(1); }

// Mount animation
const opacity = useSharedValue(0);
useEffect(() => { opacity.value = withTiming(1, { duration: 300 }); }, []);

// Exchange rate
const { rate, isLoading } = useExchangeRate();  // RWF → CNY, staleTime 30s
```

---

## DESIGN SYSTEM TOKENS

**Brand colors** (from src/constants/colors.ts — NativeWind classes available)
- `primary` #0b4c4c — main teal, nav bg, CTA
- `primaryLight` #166565 — hover/pressed
- `accent` #f97316 — orange FAB, highlights

**Semantic:** `success` `error` `warning` `info` + `*Bg` variants for badge fills

**Theme** (light/dark via useTheme()): `background` `surface` `surface2` `textPrimary` `textSecondary` `border` `inputBg`

**Typography** (Typography.h1 / .h2 / .h3 / .body / .bodySm / .caption / .label / .button)
**Spacing** (Spacing.xs=4 / .sm=8 / .md=16 / .lg=24 / .xl=32)
**Radius** (Radius.sm / .md / .lg / .full=999)
**Heights** Input=56 Button=56 TabBar=56 Header=64

---

## IMPLEMENTATION STATUS

**DONE:**
- ✅ P1 Scaffold — full folder structure + config
- ✅ P2 Design System — colors.ts, typography.ts, spacing.ts, theme
- ✅ P3 Components — all 30+ reusable components
- ✅ P4 Navigation + Stores + API — layouts, stores, services, i18n
- ✅ P5 Auth — all 9 auth screens fully implemented

**CURRENT — START HERE:**
- 🔲 **P6 Home + VPN** — `(tabs)/index.tsx` is a `// TODO: implement` stub

**TODO (all tab screens are stubs):**
- 🔲 P7 Money + Calling — money/index.tsx + call screens
- 🔲 P8 Ship + Warehouse — ship/index.tsx + warehouse flow
- 🔲 P9 Travel + Community + More — travel, community, more screens
- 🔲 P10 Wiring + Polish — API services, notifications, performance

**MISSING — designs exist, NO .tsx file yet:**
| Design folder       | Expected route                          | Notes                    |
|---------------------|-----------------------------------------|--------------------------|
| mentor_list_light   | more/community/mentor-list.tsx          | Not in original spec     |
| mentor_chat_light   | more/community/mentor-chat/[id].tsx     | Mentioned in QuickActions|
| buy_data_dark       | TBD (VPN or standalone)                 | Not in original spec     |

---

## SESSION RESUME HEADER (paste at top of new sessions)
```
Project: TradeLife — Rwanda-China trade super-app.
Stack: Expo SDK 51 / RN 0.74 / TypeScript strict / Expo Router v3 /
  NativeWind v4 / Zustand / TanStack Query v5 / RHF+Zod / Reanimated v3.
Design: designs/[id]_[name]_[light|dark]/ → code.html (layout) + screen.png (visual)
COLORS/TYPE: ALWAYS from src/constants/ — never from code.html.
RULES: [1]NativeWind className [2]<Screen> wraps all [3]Colors from constants
  [4]t() for all text [5]RHF+Zod forms [6]API via services/ [7]No any [8]Memo+callback lists
PAYMENT: RWF only → walletStore.balance. Check balance before confirm. PINBottomSheet = gate.
MOCK: EXPO_PUBLIC_USE_MOCK=true → src/services/mocks/index.ts
See knowledge/context.md for full context | knowledge/screens.md for screen/design map.
```
