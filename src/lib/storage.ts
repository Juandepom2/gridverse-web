import { UserStats, SupportedLocale } from '../types';
import { getInitialTheme } from './theme';

const STORAGE_KEY = 'gridverse_web_user_stats';
const SUPPORTED_LOCALES: SupportedLocale[] = ['es', 'en', 'de', 'fr', 'ja', 'pt'];

export function detectBrowserLocale(): SupportedLocale {
  try {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang')?.toLowerCase().slice(0, 2) as SupportedLocale | undefined;
      if (langParam && SUPPORTED_LOCALES.includes(langParam)) {
        return langParam;
      }
    }
    if (typeof navigator !== 'undefined') {
      const candidates = navigator.languages?.length
        ? navigator.languages
        : [navigator.language];
      for (const raw of candidates) {
        if (!raw) continue;
        const code = raw.toLowerCase().split(/[-_]/)[0] as SupportedLocale;
        if (SUPPORTED_LOCALES.includes(code)) {
          return code;
        }
      }
    }
  } catch {
    // Fallback
  }
  return 'es';
}

const DEFAULT_STATS: UserStats = {
  lives: 5,
  maxLives: 5,
  streak: 1,
  streakFreezes: 0,
  bestStreak: 1,
  gems: 50,
  xp: 0,
  completedLevels: {},
  unlockedLevel: 'A1',
  soundEnabled: true,
  locale: detectBrowserLocale(),
  theme: getInitialTheme(),
};

export function loadUserStats(): UserStats {
  const detectedLocale = detectBrowserLocale();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_STATS, locale: detectedLocale };
    }
    const parsed = JSON.parse(raw);
    const hasExplicitLocale = localStorage.getItem('gridverse_locale_user_set') === 'true';
    const urlLang =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('lang')?.toLowerCase().slice(0, 2)
        : null;
    const resolvedLocale: SupportedLocale =
      urlLang && SUPPORTED_LOCALES.includes(urlLang as SupportedLocale)
        ? (urlLang as SupportedLocale)
        : hasExplicitLocale && SUPPORTED_LOCALES.includes(parsed.locale)
        ? parsed.locale
        : detectedLocale;

    return {
      ...DEFAULT_STATS,
      ...parsed,
      locale: resolvedLocale,
    };
  } catch {
    return { ...DEFAULT_STATS, locale: detectedLocale };
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // LocalStorage error
  }
}

export function resetUserStats(): UserStats {
  const clean: UserStats = {
    ...DEFAULT_STATS,
    completedLevels: {},
    activityHistory: {},
  };
  saveUserStats(clean);
  return clean;
}

export function formatLocalDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getOffsetDateKey(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return formatLocalDateKey(d);
}

export interface StreakTierInfo {
  id: 'fire' | 'diamond' | 'sapphire' | 'eternal';
  label: string;
  nextMilestone: number;
  colorClass: string;
  badgeBgClass: string;
}

/**
 * Compounding streak tiers (Motor 2: Freecash Diamond-Streak model).
 * Eliminates flat linear counters by turning streaks into escalating status assets.
 */
export function getStreakTier(streak: number, locale: SupportedLocale = 'es'): StreakTierInfo {
  const labels: Record<StreakTierInfo['id'], Record<SupportedLocale, string>> = {
    eternal: {
      es: 'Eterno',
      en: 'Eternal',
      de: 'Ewig',
      fr: 'Éternel',
      ja: 'エターナル',
      pt: 'Eterno',
    },
    sapphire: {
      es: 'Zafiro',
      en: 'Sapphire',
      de: 'Saphir',
      fr: 'Saphir',
      ja: 'サファイア',
      pt: 'Safira',
    },
    diamond: {
      es: 'Diamante',
      en: 'Diamond',
      de: 'Diamant',
      fr: 'Diamant',
      ja: 'ダイヤモンド',
      pt: 'Diamante',
    },
    fire: {
      es: 'Fuego',
      en: 'Fire',
      de: 'Feuer',
      fr: 'Flamme',
      ja: 'ファイア',
      pt: 'Fogo',
    },
  };

  if (streak >= 100) {
    return {
      id: 'eternal',
      label: labels.eternal[locale],
      nextMilestone: 365,
      colorClass: 'text-gv-warning',
      badgeBgClass: 'bg-gv-warning/15 border-gv-warning/40',
    };
  }
  if (streak >= 30) {
    return {
      id: 'sapphire',
      label: labels.sapphire[locale],
      nextMilestone: 100,
      colorClass: 'text-gv-boss',
      badgeBgClass: 'bg-gv-boss/15 border-gv-boss/40',
    };
  }
  if (streak >= 7) {
    return {
      id: 'diamond',
      label: labels.diamond[locale],
      nextMilestone: 30,
      colorClass: 'text-gv-bytes',
      badgeBgClass: 'bg-gv-bytes/15 border-gv-bytes/40',
    };
  }
  return {
    id: 'fire',
    label: labels.fire[locale],
    nextMilestone: 7,
    colorClass: 'text-gv-streak',
    badgeBgClass: 'bg-gv-streak/15 border-gv-streak/40',
  };
}

export function markLevelCompleted(
  current: UserStats,
  levelRef: string,
  stars: number,
  earnedXp: number,
  nextLevelRef?: string
): UserStats {
  const updated = { ...current };
  updated.completedLevels = {
    ...updated.completedLevels,
    [levelRef]: {
      stars: Math.max(stars, updated.completedLevels[levelRef]?.stars ?? 0),
      completedAt: new Date().toISOString(),
    },
  };
  updated.xp += earnedXp;
  updated.gems += earnedXp >= 15 ? 5 : 2;

  const todayKey = formatLocalDateKey();
  const yesterdayKey = getOffsetDateKey(-1);
  const twoDaysAgoKey = getOffsetDateKey(-2);

  const prevHistory = updated.activityHistory || {};
  updated.activityHistory = {
    ...prevHistory,
    [todayKey]: (prevHistory[todayKey] || 0) + 1,
  };

  if (updated.lastStreakDate !== todayKey) {
    const freezes = updated.streakFreezes ?? 0;
    if (!updated.lastStreakDate) {
      updated.streak = Math.max(1, updated.streak || 1);
    } else if (updated.lastStreakDate === yesterdayKey) {
      updated.streak = (updated.streak || 0) + 1;
    } else if (updated.lastStreakDate === twoDaysAgoKey && freezes > 0) {
      // Auto-consume 1 Streak Freeze shield to protect the user's streak!
      updated.streakFreezes = freezes - 1;
      updated.streak = (updated.streak || 0) + 1;
    } else {
      updated.streak = 1;
    }
    updated.lastStreakDate = todayKey;
  }

  updated.bestStreak = Math.max(updated.bestStreak ?? 1, updated.streak);

  if (nextLevelRef) {
    updated.unlockedLevel = nextLevelRef;
  }

  saveUserStats(updated);
  return updated;
}
