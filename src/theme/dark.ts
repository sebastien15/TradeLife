import { Colors } from '@/constants/colors';
import type { ThemeType } from './index';

export const darkTheme: ThemeType = {
  // Page / screen
  background: Colors.dark.background,  // #112121 — deep dark teal-grey page bg
  surface:    Colors.dark.surface,     // #1E1E1E — card, menu bg
  surface2:   Colors.dark.surface2,    // #2C2C2C — elevated / action surface

  // Text
  textPrimary:   Colors.dark.textPrimary,   // #f1f5f9 — main text dark
  textSecondary: Colors.dark.textSecondary, // #94a3b8 — secondary text dark
  textMuted:     Colors.dark.textMuted,     // #64748b — captions/placeholders dark

  // Structure
  border:  Colors.dark.border,   // #1e293b — borders dark
  divider: Colors.dark.divider,  // #2C2C2C — section separators dark

  // Form inputs
  inputBg:     Colors.dark.inputBg,  // #0b4c4c (used with opacity: 0.1)
  inputBorder: Colors.dark.border,   // #1e293b

  // Navigation / bars
  cardBg:      Colors.dark.surface,      // #1E1E1E
  tabBarBg:    Colors.dark.background,   // #112121 — tab bar bg dark
  tabBarBorder:Colors.dark.border,       // #1e293b
  headerBg:    Colors.dark.background,   // #112121

  // Brand (same primary — teal reads well on dark bg)
  primary:      Colors.primary,      // #0b4c4c
  primaryLight: Colors.primaryMid,   // #1a7a7a — lighter for dark mode accents
  accent:       Colors.accent,       // #f97316

  // Semantic — dark variants
  success:     Colors.success,       // #10B981
  successBg:   Colors.successBgDark, // #064e3b (rendered at 30% opacity)
  successText: '#34d399',            // emerald-400 — badge text dark mode
  error:       Colors.error,         // #ef4444
  errorBg:     Colors.errorBgDark,   // #7f1d1d (rendered at 30% opacity)
  errorText:   '#f87171',            // red-400 — error text dark mode
  warning:     Colors.warning,       // #f59e0b
  warningBg:   Colors.warningBgDark, // #451a03
  warningText: '#fbbf24',            // amber-400
  info:        Colors.info,          // #3b82f6
  infoBg:      Colors.infoBgDark,    // #1e3a8a (rendered at 30% opacity)
  infoText:    '#60a5fa',            // blue-400 — badge text dark mode
  neutralBg:   Colors.neutralBgDark, // #1e293b
  neutralText: '#94a3b8',            // slate-400

  // Tab bar — brighter teal for visibility on dark background
  tabBarActive:   Colors.primaryMid,     // #1a7a7a — readable teal on dark bg
  tabBarInactive: Colors.tabBarInactive, // #94a3b8

  // Status bar style for expo-status-bar
  statusBarStyle: 'light' as const,
};
