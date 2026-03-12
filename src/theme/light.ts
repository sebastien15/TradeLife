import { Colors } from '@/constants/colors';
import type { ThemeType } from './index';

export const lightTheme: ThemeType = {
  // Page / screen
  background:   Colors.background,    // #f6f8f8 — light grey page bg
  surface:      Colors.surface,       // #ffffff — card, sheet bg
  surface2:     Colors.surface2,      // #f1f5f9 — secondary surface, input bg

  // Text
  textPrimary:   Colors.textPrimary,   // #0f172a — main body text
  textSecondary: Colors.textSecondary, // #475569 — muted labels, subtitles
  textMuted:     Colors.textMuted,     // #94a3b8 — placeholders, captions

  // Structure
  border:  Colors.border,   // #e2e8f0 — input borders, card outlines
  divider: Colors.divider,  // #f1f5f9 — section separators

  // Form inputs (same as surface in light)
  inputBg:    Colors.inputBg,  // #ffffff
  inputBorder: Colors.border,  // #e2e8f0

  // Navigation / bars
  cardBg:      Colors.surface,      // #ffffff
  tabBarBg:    Colors.surface,      // #ffffff — bottom tab bar
  tabBarBorder:Colors.border,       // #e2e8f0 — tab bar top border
  headerBg:    Colors.background,   // #f6f8f8 — sticky header bg

  // Brand
  primary:       Colors.primary,       // #0b4c4c
  primaryLight:  Colors.primaryLight,  // #166565
  accent:        Colors.accent,        // #f97316

  // Semantic
  success:      Colors.success,      // #10B981
  successBg:    Colors.successBg,    // #d1fae5
  successText:  Colors.successText,  // #047857
  error:        Colors.error,        // #ef4444
  errorBg:      Colors.errorBg,      // #fee2e2
  errorText:    Colors.errorText,    // #dc2626
  warning:      Colors.warning,      // #f59e0b
  warningBg:    Colors.warningBg,    // #fef3c7
  warningText:  Colors.warningText,  // #b45309
  info:         Colors.info,         // #3b82f6
  infoBg:       Colors.infoBg,       // #dbeafe
  infoText:     Colors.infoText,     // #1d4ed8
  neutralBg:    Colors.neutralBg,    // #f1f5f9
  neutralText:  Colors.neutralText,  // #334155

  // Tab bar
  tabBarActive:   Colors.tabBarActive,   // #0b4c4c
  tabBarInactive: Colors.tabBarInactive, // #94a3b8

  // Status bar style for expo-status-bar
  statusBarStyle: 'dark' as const,
};
