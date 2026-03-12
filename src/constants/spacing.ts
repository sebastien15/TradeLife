// ─────────────────────────────────────────────────────────────────────────────
// TradeLife Design System — Spacing, Radius & Elevation
// Source: extracted from 5 Stitch screen exports.
//
// Spacing scale (Tailwind p-N → px values found in designs):
//   p-1=4  p-2=8  p-3=12  p-4=16  p-5=20  p-6=24  p-8=32  p-12=48
//
// Border-radius (from tailwind config in all screen files):
//   DEFAULT=4px  lg=8px  xl=12px  full=9999px
//   Cards / inputs / buttons → rounded-xl (12px)
//   Badges → rounded (4px)
//   Avatar / FAB / chips → rounded-full
//
// Elevation (mapped from Tailwind shadow-sm/md/lg/xl/2xl to RN shadow props):
//   shadow-sm  → elevation 2  (item cards in warehouse/money lists)
//   shadow-lg  → elevation 6  (CTA buttons, badge + shadow-primary/20)
//   shadow-xl  → elevation 10 (FAB, swap button)
//   shadow-2xl → elevation 16 (modal / bottom-sheet container)
// ─────────────────────────────────────────────────────────────────────────────

// ── Spacing ───────────────────────────────────────────────────────────────────
// Use these tokens everywhere instead of raw numbers.
export const Spacing = {
  xs:  4,   // p-1 — tight internal padding, icon gaps
  sm:  8,   // p-2 — icon button tap targets, small gaps
  md:  16,  // p-4 — standard horizontal/vertical screen padding
  lg:  24,  // p-6 — section padding, card inner padding (amount card)
  xl:  32,  // p-8 — section top margin, large vertical gaps
  xxl: 48,  // p-12 — search input left padding (icon offset), max bottom safe area

  // Derived / common composites
  screenH: 16,  // horizontal screen edge padding (px-4)
  screenV: 16,  // vertical screen edge padding (py-4)
  cardPad: 16,  // standard card inner padding (p-4 on most item cards)
  sectionGap: 24, // vertical gap between sections

  // Component-specific heights (extracted from h-14, h-[56px] in sign-up)
  inputHeight:  56,  // h-14 / h-[56px] — all form inputs and primary buttons
  tabBarHeight: 64,  // h-16 — top navigation bar height
  headerHeight: 64,  // sticky header height
} as const;

// ── Border Radius ─────────────────────────────────────────────────────────────
// Directly from tailwind config found in all 5 screen HTML files:
//   "DEFAULT": "0.25rem" → 4px
//   "lg":      "0.5rem"  → 8px
//   "xl":      "0.75rem" → 12px
//   "full":    "9999px"
export const Radius = {
  xs:   4,    // rounded (DEFAULT) — badges, SKU chips, small elements
  sm:   8,    // rounded-lg — image thumbnails, small cards, segmented control
  md:   12,   // rounded-xl — inputs, buttons, cards (most common in designs)
  lg:   16,   // rounded-2xl — large cards (amount section, fee card in money)
  xl:   24,   // rounded-3xl — extra large cards / modals (not explicit in designs, provided for completeness)
  full: 9999, // rounded-full — avatars, FAB, toggle, badge pills
} as const;

// ── Elevation (React Native shadow props) ────────────────────────────────────
// Android uses `elevation`. iOS uses shadow* props.
// shadowColor is always black; opacities tuned for dark teal design aesthetic.
export const Elevation = {
  // shadow-sm — list item cards (warehouse items, transaction rows)
  1: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius:  2,
    elevation:     2,
  },
  // shadow-md — exchange rate ribbon, segmented control active pill
  2: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius:  4,
    elevation:     4,
  },
  // shadow-lg — primary CTA buttons, cards with shadow-primary/20
  3: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius:  8,
    elevation:     6,
  },
  // shadow-xl — FAB (orange), swap button, floating elements
  4: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius:  12,
    elevation:     10,
  },
  // shadow-2xl — modal / bottom-sheet container, full-screen overlaid cards
  5: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius:  20,
    elevation:     16,
  },
} as const;

// ── Primary-tinted shadow (shadow-primary/20 on CTA buttons) ─────────────────
// Used on the "Send Money", "Create Account", etc. primary buttons.
export const PrimaryShadow = {
  shadowColor:   '#0b4c4c',
  shadowOffset:  { width: 0, height: 4 },
  shadowOpacity: 0.30,
  shadowRadius:  8,
  elevation:     6,
} as const;

export type SpacingKey  = keyof typeof Spacing;
export type RadiusKey   = keyof typeof Radius;
export type ElevationKey = keyof typeof Elevation;
