export type SupportedLocale = 'es' | 'en' | 'de' | 'fr' | 'ja' | 'pt';

export type ExerciseType = 'select_range' | 'predict' | 'formula' | 'drag_order' | 'fix_error';

export interface Exercise {
  type: ExerciseType;
  prompt: string;
  promptByLocale?: Record<SupportedLocale, string>;
  correct: string;
  options?: string[];
  optionsByLocale?: Record<SupportedLocale, string[]>;
  data?: Record<string, string>;
  explanation?: string;
  explanationByLocale?: Record<SupportedLocale, string>;
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
}
