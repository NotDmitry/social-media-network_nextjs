import { useThemeStore } from './model/store';

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const restoreTheme = useThemeStore((state) => state.restoreTheme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return { theme, restoreTheme, setTheme };
}
