export type SupportedLocale = 'es' | 'en' | 'de' | 'fr' | 'ja' | 'pt';

export type ExerciseType =
  | 'select_range'
  | 'predict'
  | 'build_formula'
  | 'formula'
  | 'drag_order'
  | 'find_error'
  | 'write_formula'
  | 'fix_error';

export interface Exercise {
  type: ExerciseType;
  prompt: string;
  promptByLocale?: Record<SupportedLocale, string>;
  correct: string;
  correctByLocale?: Record<SupportedLocale, string>;
  options?: string[];
  optionsByLocale?: Record<SupportedLocale, string[]>;
  data?: Record<string, string>;
  dataByLocale?: Record<SupportedLocale, Record<string, string>>;
  explanation?: string;
  explanationByLocale?: Record<SupportedLocale, string>;
  formula?: string;
  formulaByLocale?: Record<SupportedLocale, string>;
  blocks?: string[];
  blocksByLocale?: Record<SupportedLocale, string[]>;
  suggestions?: string[];
  targetCell?: string;
  errorCell?: string;
  displayValues?: Record<string, string>;
  targetFormula?: string;
}

export interface LevelData {
  ref: string;
  title: string;
  titleByLocale?: Record<SupportedLocale, string>;
  version?: number;
  rewardXp?: number;
  exercises: Exercise[];
}

export interface LevelMeta {
  ref: string;
  file: string;
  version: number;
  title?: string;
  stage?: number;
  isBoss?: boolean;
}

export interface UserStats {
  lives: number;
  maxLives: number;
  streak: number;
  gems: number;
  xp: number;
  completedLevels: Record<string, { stars: number; completedAt: string }>;
  unlockedLevel: string;
  soundEnabled: boolean;
  locale: SupportedLocale;
  isPro?: boolean;
  subscriptionPlan?: string;
  levelTitle?: string;
  displayName?: string;
  photoUrl?: string;
  activityHistory?: Record<string, number>;
  lastStreakDate?: string;
  streakFreezes?: number;
  bestStreak?: number;
  dailyMissions?: {
    date: string;
    claimedIds: string[];
  };
  theme?: 'dark' | 'light';
}
