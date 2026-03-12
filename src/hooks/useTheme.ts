import { useTheme as useThemeContext } from '@/theme';

/** Returns the current ThemeType directly for ergonomic access: const theme = useTheme() */
export function useTheme() {
  return useThemeContext().theme;
}
