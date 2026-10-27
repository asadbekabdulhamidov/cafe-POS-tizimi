import { create } from 'zustand';
import { DICTIONARY, toCyrillic, toLatin } from '../utils/translations';

const THEME_KEY = 'choyxona_theme';
const LANG_KEY = 'choyxona_lang';

// Get initial theme
const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {}
  return 'light';
};

// Get initial language
const getInitialLang = () => {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'cyrl' || saved === 'latn') return saved;
  } catch {}
  return 'latn';
};

// Apply theme to HTML root immediately
const applyThemeToDOM = (theme) => {
  if (typeof document !== 'undefined') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

export const useAppConfigStore = create((set, get) => ({
  theme: initialTheme,
  lang: getInitialLang(), // 'latn' | 'cyrl'

  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    applyThemeToDOM(next);
    set({ theme: next });
  },

  setTheme: (newTheme) => {
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch {}
    applyThemeToDOM(newTheme);
    set({ theme: newTheme });
  },

  setLang: (newLang) => {
    try {
      localStorage.setItem(LANG_KEY, newLang);
    } catch {}
    set({ lang: newLang });
  },

  toggleLang: () => {
    const current = get().lang;
    const next = current === 'latn' ? 'cyrl' : 'latn';
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {}
    set({ lang: next });
  },

  // Get translated UI string by key
  t: (key, fallback = '') => {
    const { lang } = get();
    const entry = DICTIONARY[key];
    if (entry && entry[lang]) {
      return entry[lang];
    }
    return fallback || (entry ? entry.latn : key);
  },

  // Dynamic text translator (translates user content like room or dish names)
  localize: (text) => {
    if (!text || typeof text !== 'string') return text;
    const { lang } = get();
    if (lang === 'cyrl') {
      return toCyrillic(text);
    }
    return toLatin(text);
  },

  // Format currency with proper suffix for current language
  formatMoney: (amount) => {
    const { lang } = get();
    const num = Number(amount) || 0;
    const formatted = num.toLocaleString('uz-UZ').replace(/,/g, ' ');
    const suffix = lang === 'cyrl' ? 'сўм' : 'so‘m';
    return `${formatted} ${suffix}`;
  },
}));
