export type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'gridverse_theme';

export function getInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      return 'light';
    }
  } catch {
    // ignore
  }
  return 'dark';
}

export function applyTheme(theme: ThemeMode): void {
  try {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);

    // Update meta theme-color for mobile status bar
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#F4F7F5' : '#0A0F0C');
    }
  } catch {
    // ignore
  }
}
