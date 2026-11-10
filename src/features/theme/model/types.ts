export type ThemeVariant = 'light' | 'dark';

export interface ThemeStore {
  theme: ThemeVariant;
  restoreTheme: () => void;
  setTheme: (newTheme: ThemeVariant) => void;
}
