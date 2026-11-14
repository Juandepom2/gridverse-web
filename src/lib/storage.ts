import { UserStats, SupportedLocale } from '../types';

const STORAGE_KEY = 'gridverse_web_user_stats';

const DEFAULT_STATS: UserStats = {
  lives: 5,
  maxLives: 5,
  streak: 1,
  gems: 50,
  xp: 0,
  completedLevels: {},
  unlockedLevel: 'A1',
  soundEnabled: true,
  locale: 'es',
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
  const prevHistory = updated.activityHistory || {};
  updated.activityHistory = {
    ...prevHistory,
    [todayKey]: (prevHistory[todayKey] || 0) + 1,
  };
  if (updated.lastStreakDate !== todayKey) {
    updated.lastStreakDate = todayKey;
    updated.streak = Math.max(1, updated.streak);
  }

  if (nextLevelRef) {
    updated.unlockedLevel = nextLevelRef;
  }

  saveUserStats(updated);
  return updated;
}
