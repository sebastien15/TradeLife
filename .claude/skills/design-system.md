# Design System & Styling

## Absolute Rules

### Colors
- **NEVER hardcode hex color strings** (e.g., `'#0b4c4c'`) directly in component JSX or styles.
- Always import from `@/constants/colors` (Colors object) or use `theme.*` from `useTheme()`.
- Alpha variants: compose as `Colors.primary + '1a'` — references the constant, not a raw hex.

### Styling
- **NativeWind `className`** for static layout/spacing (e.g., `className="flex-1 px-4 rounded-xl"`).
- **`style` prop** for dynamic theme-reactive colors (e.g., `style={{ backgroundColor: theme.surface }}`).
- **No `StyleSheet.create`** anywhere — the only exception is inside Reanimated `useAnimatedStyle` returns.
- All spacing values from `@/constants/spacing` (Spacing, Radius, Elevation, PrimaryShadow).
- All typography from `@/constants/typography` (Typography object).

## Tokens

### Brand Colors
| Token | Value | Use |
|-------|-------|-----|
| primary | #0b4c4c | Main brand teal |
| primaryLight | #166565 | Hover/pressed states |
| primaryMid | #1a7a7a | Accents on dark bg |
| accent | #f97316 | Orange CTA, FAB |

### Semantic Colors
| Token | Light | Dark |
|-------|-------|------|
| background | #f6f8f8 | #112121 |
| surface | #ffffff | #1E1E1E |
| surface2 | #f1f5f9 | #2C2C2C |
| textPrimary | #0f172a | #f1f5f9 |
| textSecondary | #475569 | #94a3b8 |
| border | #e2e8f0 | #1e293b |

### Typography Scale
| Token | Size | Weight | Use |
|-------|------|--------|-----|
| display | 30px | 900 | Money amounts |
| h1 | 24px | 700 | Screen titles |
| h2 | 20px | 700 | Modal headers |
| h3 | 18px | 700 | Card titles |
| body | 16px | 400 | Body text |
| label | 14px | 600 | Form labels |
| caption | 12px | 400 | Metadata |
| badge | 10px | 700 | Status badges |

### Spacing Scale
| Token | Value | Tailwind |
|-------|-------|----------|
| xs | 4px | p-1 |
| sm | 8px | p-2 |
| md | 16px | p-4 |
| lg | 24px | p-6 |
| xl | 32px | p-8 |

### Border Radius
| Token | Value | Use |
|-------|-------|-----|
| xs | 4px | Badges, chips |
| sm | 8px | Thumbnails |
| md | 12px | Inputs, buttons, cards |
| lg | 16px | Large cards |
| full | 9999px | Avatars, FAB, pills |

### Component Heights
| Component | Height |
|-----------|--------|
| Input / Button (primary) | 56px |
| Tab bar | 56px |
| Header | 64px |
