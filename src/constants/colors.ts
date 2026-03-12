// ─────────────────────────────────────────────────────────────────────────────
// TradeLife Design System — Colors
// Source: extracted from 5 Stitch screen exports (2a home, 4a money, 5j
//         warehouse, 1d sign-up, 8a more). Never re-extract from HTML — use
//         this file as the single source of truth for the entire project.
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  // ── Brand ─────────────────────────────────────────────────────────────────
  // Extracted from tailwind config in every screen: "primary": "#0b4c4c"
  // Gradient deep end (warehouse card / profile header): #0A4B4B → #073535
  // Gradient light end (home glass-teal): #0b4c4c → #166565
  primary:      '#0b4c4c',  // main brand teal — buttons, active tabs, links
  primaryLight: '#166565',  // lighter teal — gradient end (light screens)
  primaryMid:   '#1a7a7a',  // mid teal — gradient end (dark screens)
  primaryDark:  '#0A4B4B',  // darker teal — gradient start on cards/headers
  primaryDeep:  '#073535',  // deepest teal — gradient end on warehouse card

  // Orange FAB + notification dot: "accent-orange": "#f97316"
  accent:       '#f97316',  // orange — FAB, highlights, notification badge

  // ── Semantic ──────────────────────────────────────────────────────────────
  // "success": "#10B981" from home-dark tailwind config; emerald-700 (#047857)
  // for badge text, emerald-100 (#d1fae5) for badge bg
  success:       '#10B981',  // emerald-500 — VPN connected, success states
  successText:   '#047857',  // emerald-700 — badge text light mode
  successBg:     '#d1fae5',  // emerald-100 — badge background light mode
  successBgDark: '#064e3b',  // emerald-900 — badge background dark mode (30% opacity base)

  // red-500 (#ef4444) — logout, error text; errorBg uses red-100
  error:        '#ef4444',  // red-500 — errors, logout button, destructive actions
  errorText:    '#dc2626',  // red-600 — error text emphasis
  errorBg:      '#fee2e2',  // red-100 — error badge background light
  errorBgDark:  '#7f1d1d',  // red-900 — error badge background dark (30% opacity base)

  // No amber/yellow extracted — warning maps to amber-500 standard
  warning:      '#f59e0b',  // amber-500 — caution badges, storage day warning
  warningText:  '#b45309',  // amber-700 — warning badge text light
  warningBg:    '#fef3c7',  // amber-100 — warning badge background light
  warningBgDark:'#451a03',  // amber-950 — warning badge background dark

  // blue-700 (#1d4ed8) info text, blue-100 (#dbeafe) info bg
  info:         '#3b82f6',  // blue-500 — info/ready badges, informational states
  infoText:     '#1d4ed8',  // blue-700 — info badge text light
  infoBg:       '#dbeafe',  // blue-100 — info badge background light
  infoBgDark:   '#1e3a8a',  // blue-900 — info badge background dark (30% opacity base)

  // ── Neutrals — Light Mode ─────────────────────────────────────────────────
  // body bg: "background-light": "#f6f8f8"
  background:   '#f6f8f8',  // page background light
  // white for cards, surfaces
  surface:      '#ffffff',  // card / sheet background light
  // slate-100 (#f1f5f9) for secondary surface / input bg
  surface2:     '#f1f5f9',  // secondary surface, segmented control bg

  // slate-900 (#0f172a) for primary text
  textPrimary:   '#0f172a',  // main text light mode  (slate-900)
  // slate-600 (#475569) for secondary text
  textSecondary: '#475569',  // muted/secondary text light  (slate-600)
  // slate-400 (#94a3b8) for placeholders, captions, tertiary
  textMuted:     '#94a3b8',  // placeholders, captions, hints  (slate-400)

  // slate-200 (#e2e8f0) for borders, dividers
  border:   '#e2e8f0',  // input borders, card borders light  (slate-200)
  divider:  '#f1f5f9',  // section separators light  (slate-100)
  inputBg:  '#ffffff',  // form input background light

  // neutral badge — "In Inspection" / pending state (slate tones from warehouse)
  neutralBg:     '#f1f5f9',  // slate-100 — neutral badge bg light
  neutralText:   '#334155',  // slate-700 — neutral badge text light
  neutralBgDark: '#1e293b',  // slate-800 — neutral badge bg dark

  // ── Dark Mode ─────────────────────────────────────────────────────────────
  // "background-dark": "#112121" canonical (4 of 5 files use this)
  // home-dark uses "#121212" but #112121 wins by frequency
  dark: {
    background:    '#112121',  // page background dark
    surface:       '#1E1E1E',  // card / menu background dark ("card-dark"/"menu-bg")
    surface2:      '#2C2C2C',  // elevated surface / action-dark / divider dark
    textPrimary:   '#f1f5f9',  // slate-100 — main text dark mode
    textSecondary: '#94a3b8',  // slate-400 — secondary text dark
    textMuted:     '#64748b',  // slate-500 — captions/placeholders dark
    border:        '#1e293b',  // slate-800 — borders dark
    divider:       '#2C2C2C',  // section separators dark
    inputBg:       '#0b4c4c',  // primary — tinted input bg dark (use with opacity)
  },

  // ── Gradient Pairs (use with expo-linear-gradient) ────────────────────────
  gradientCard:    ['#0A4B4B', '#073535'] as const,  // warehouse header card
  gradientProfile: ['#0A4B4B', '#0D6969'] as const,  // profile header (more screen)
  gradientPrimary: ['#0b4c4c', '#166565'] as const,  // light CTA buttons/cards
  gradientDark:    ['#0b4c4c', '#1a7a7a'] as const,  // dark mode gradient variant

  // ── Payment Provider Brand Colors ─────────────────────────────────────────
  wechat:   '#07C160',  // WeChat Pay green
  alipay:   '#1677FF',  // Alipay blue
  whatsapp: '#25D366',  // WhatsApp green

  // ── Tab Bar ───────────────────────────────────────────────────────────────
  tabBarActive:   '#0b4c4c',  // active tab icon/label (= primary)
  tabBarInactive: '#94a3b8',  // inactive tab icon/label (slate-400)

  // ── Overlay ───────────────────────────────────────────────────────────────
  overlay:      'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(255,255,255,0.1)',
  overlayCard:  'rgba(255,255,255,0.15)', // chip bg on gradient surface (CallingCard)

  // ── Pure white (for text/icons on dark/gradient backgrounds) ─────────────
  white:        '#ffffff',
} as const;

export type ColorKey = keyof typeof Colors;
