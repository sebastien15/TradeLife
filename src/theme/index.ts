import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme } from './light';
import { darkTheme } from './dark';

// ── ThemeType ──────────────────────────────────────────────────────────────────
// Every field maps to a design-system token. Components must only reference
// `theme.*` keys — never hardcoded hex values or Colors.* directly in JSX.
export interface ThemeType {
  // Layout surfaces
  background:  string;
  surface:     string;
  surface2:    string;

  // Text hierarchy
  textPrimary:   string;
  textSecondary: string;
  textMuted:     string;

  // Borders & separators
  border:  string;
  divider: string;

  // Form inputs
  inputBg:     string;
  inputBorder: string;

  // Navigation bars
  cardBg:      string;
  tabBarBg:    string;
  tabBarBorder:string;
  headerBg:    string;

  // Brand
  primary:      string;
  primaryLight: string;
  accent:       string;

  // Semantic states
  success:     string;
  successBg:   string;
  successText: string;
  error:       string;
  errorBg:     string;
  errorText:   string;
  warning:     string;
  warningBg:   string;
  warningText: string;
  info:        string;
  infoBg:      string;
  infoText:    string;
  neutralBg:   string;
  neutralText: string;

  // Tab bar
  tabBarActive:   string;
  tabBarInactive: string;

  // Status bar
  statusBarStyle: 'light' | 'dark';
}

// ── Context ────────────────────────────────────────────────────────────────────
interface ThemeContextValue {
  theme:       ThemeType;
  isDark:      boolean;
  toggleTheme: () => void;
  setScheme:   (scheme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme:       lightTheme,
  isDark:      false,
  toggleTheme: () => undefined,
  setScheme:   () => undefined,
});

// ── Provider ───────────────────────────────────────────────────────────────────
interface ThemeProviderProps {
  children: React.ReactNode;
  /**
   * Override scheme. Pass from settingsStore.colorScheme.
   * 'system' (default) follows the device setting.
   */
  scheme?: 'light' | 'dark' | 'system';
  onSchemeChange?: (scheme: 'light' | 'dark' | 'system') => void;
}

export function ThemeProvider({
  children,
  scheme = 'system',
  onSchemeChange,
}: ThemeProviderProps) {
  const deviceScheme = useColorScheme();
  const [userScheme, setUserScheme] = useState<'light' | 'dark' | 'system'>(scheme);

  // Sync external prop changes (e.g. settingsStore hydrated from AsyncStorage)
  useEffect(() => {
    setUserScheme(scheme);
  }, [scheme]);

  const isDark = useMemo<boolean>(() => {
    if (userScheme === 'system') return deviceScheme === 'dark';
    return userScheme === 'dark';
  }, [userScheme, deviceScheme]);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = useCallback(() => {
    const next = isDark ? 'light' : 'dark';
    setUserScheme(next);
    onSchemeChange?.(next);
  }, [isDark, onSchemeChange]);

  const setScheme = useCallback(
    (s: 'light' | 'dark' | 'system') => {
      setUserScheme(s);
      onSchemeChange?.(s);
    },
    [onSchemeChange],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, isDark, toggleTheme, setScheme }),
    [theme, isDark, toggleTheme, setScheme],
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
}

// ── Hook ───────────────────────────────────────────────────────────────────────
/**
 * useTheme — access the current theme inside any component.
 *
 * @example
 * const { theme, isDark, toggleTheme } = useTheme();
 * <View style={{ backgroundColor: theme.background }} />
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  return ctx;
}

// Re-export themes for convenience
export { lightTheme, darkTheme };
