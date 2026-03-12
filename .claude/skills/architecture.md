# Architecture & Project Structure

## Technology Stack

- **Expo SDK 54** / React Native 0.81.5 / React 19.1.0
- **Expo Router v6** (file-based routing, `expo-router/entry` in `index.ts`)
- **NativeWind v4** — Tailwind CSS for React Native
- **Zustand** — client state management
- **TanStack Query v5** — server/async state
- **React Hook Form + Zod** — forms and validation
- **Reanimated v4** — animations (requires `react-native-worklets` peer dep)
- **@gorhom/bottom-sheet v5** — bottom sheets
- **i18next + react-i18next** — internationalization
- **date-fns v3** — date formatting
- **expo-image** — image rendering (use instead of RN Image)
- **@expo/vector-icons (MaterialIcons)** — icons (bundled, no install needed)
- **expo-haptics** — haptic feedback
- **expo-linear-gradient** — gradients

## Architecture Rules

- API calls only through service files in `src/services/`.
- Screen components only orchestrate — no raw `fetch`/`axios` calls in components.
- Every screen must be wrapped in `<Screen>` from `@/components/layout/Screen`.
- Theme access: `const theme = useTheme()` (returns `ThemeType` directly).
- Dark/light theming: all color values via `theme.*`, never hardcoded.

## File Structure Conventions

```
src/
  app/                    # Expo Router routes (screens only, no logic)
  components/
    ui/                   # Primitive UI: Button, Input, Card, Badge, etc.
    layout/               # Screen, Header, TabBar, BottomSheet
    forms/                # FormField, PhoneInput, CurrencyInput, Dropdown, DatePicker
    shared/               # Feature-specific reusables
    index.ts              # Barrel export (export * from every component)
  constants/
    colors.ts             # Single source of truth for all color values
    typography.ts         # Font scale and weights
    spacing.ts            # Spacing, Radius, Elevation tokens
    config.ts             # App config (API URL, env flags)
    routes.ts             # Route path constants
  hooks/                  # Custom hooks (useTheme, useToast, useNetworkStatus, etc.)
  i18n/
    index.ts              # i18next init, exports t and useTranslation
    locales/en.json       # English strings (add keys here first)
  services/               # API layer (all fetch/axios calls go here)
  stores/                 # Zustand stores (settingsStore, authStore, walletStore, etc.)
  theme/
    index.ts              # ThemeProvider, useTheme (context), ThemeType interface
    light.ts              # Light theme token map
    dark.ts               # Dark theme token map
  types/
    domain.types.ts       # Shared domain types (ShipmentSummary, Transaction, etc.)
  utils/
    storage.ts            # Typed AsyncStorage wrappers
```

## File Size & Maintenance

- **Never write a single screen or component file exceeding 1000 lines** unless absolutely unavoidable.
- If a screen file would exceed 1000 lines, extract sub-components into `src/components/shared/` or create a dedicated folder (e.g., `src/app/(tabs)/home/`) with separate files imported by the screen index.
