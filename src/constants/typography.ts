// ─────────────────────────────────────────────────────────────────────────────
// TradeLife Design System — Typography
// Source: extracted from 5 Stitch screen exports.
//
// Font family: "Inter" (Google Fonts, weights 400/500/600/700/800/900)
//   → In React Native, reference via expo-font loaded family name strings.
//   → System fallbacks: 'SF Pro Text' (iOS) / 'Roboto' (Android).
//
// Scale extracted from HTML:
//   text-[10px]=10  text-xs=12  text-sm=14  text-base=16
//   text-lg=18  text-xl=20  text-2xl=24  text-3xl=30
//
// React Native: font sizes are unitless numbers (not px strings).
// Line heights: RN requires numeric px values (not multipliers).
// ─────────────────────────────────────────────────────────────────────────────
import { Platform } from 'react-native';

// ── Font Family ───────────────────────────────────────────────────────────────
// Design uses Inter. Load with expo-font in _layout.tsx (Prompt 3+).
// These strings must match the loaded font family names exactly.
export const FontFamily = {
  regular: 'Inter_400Regular',
  medium:  'Inter_500Medium',
  semibold:'Inter_600SemiBold',
  bold:    'Inter_700Bold',
  // System fallbacks (used before fonts load / in stubs)
  system:  Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
} as const;

// ── Type Scale ────────────────────────────────────────────────────────────────
// Each entry maps to a Tailwind text-* class as used in the designs.
// lineHeight: design uses Tailwind defaults (≈ 1.5× fontSize for body,
//             1.25× for headings, 1.0 for 'leading-none').
export const Typography = {
  // Largest numbers — money amounts, big stats (text-3xl / font-black)
  display: {
    fontSize:   30,
    fontWeight: '900' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },

  // Screen/section title (text-2xl / font-bold)
  h1: {
    fontSize:   24,
    fontWeight: '700' as const,
    lineHeight: 30,
    letterSpacing: -0.3,
  },

  // Sub-section heading, modal header (text-xl / font-bold, leading-none on names)
  h2: {
    fontSize:   20,
    fontWeight: '700' as const,
    lineHeight: 24,
    letterSpacing: -0.2,
  },

  // Card title, screen title in nav bar (text-lg / font-bold, tracking-tight)
  h3: {
    fontSize:   18,
    fontWeight: '700' as const,
    lineHeight: 24,
    letterSpacing: -0.2,
  },

  // Body / input text (text-base — used on all form inputs, h-14 fields)
  body: {
    fontSize:   16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },

  // Body medium emphasis (text-base / font-medium — dropdowns, select)
  bodyMedium: {
    fontSize:   16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },

  // Secondary body / form labels / list secondary (text-sm / font-semibold for labels)
  bodySm: {
    fontSize:   14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Form field labels (text-sm / font-semibold — "Full Name", "Phone or Email")
  label: {
    fontSize:   14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Small chips, timestamps, metadata (text-xs / font-medium or semibold)
  caption: {
    fontSize:   12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
  },

  // Uppercase section headers (text-xs / font-bold / tracking-widest / uppercase)
  // e.g. "ACCOUNT DETAILS", "TOOLS", "RESOURCES" in More screen
  sectionLabel: {
    fontSize:      12,
    fontWeight:    '700' as const,
    lineHeight:    16,
    letterSpacing: 1.5,   // tracking-widest ≈ 0.1em @ 12px ≈ 1.2px; using 1.5
    // Apply textTransform: 'uppercase' at component level
  },

  // Badge text — "RECEIVED", "READY", "IN INSPECTION" (text-[10px] / font-bold)
  badge: {
    fontSize:      10,
    fontWeight:    '700' as const,
    lineHeight:    14,
    letterSpacing: 0.5,
    // Apply textTransform: 'uppercase' at component level
  },

  // Tab bar labels (text-[10px] / font-bold for active, font-medium for inactive)
  tabLabel: {
    fontSize:   10,
    fontWeight: '500' as const,
    lineHeight: 14,
    letterSpacing: 0,
  },

  // Primary CTA button text (font-bold, used on h-[56px] buttons)
  button: {
    fontSize:   16,
    fontWeight: '700' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Exchange rate ribbon / small CTA (text-sm / font-semibold)
  buttonSm: {
    fontSize:   14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
} as const;

export type TypographyKey = keyof typeof Typography;
