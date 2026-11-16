import { UserStats, SupportedLocale } from '../types';
import { getInitialTheme } from './theme';

const STORAGE_KEY = 'gridverse_web_user_stats';

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
  locale: 'es',
  theme: getInitialTheme(),
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
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
