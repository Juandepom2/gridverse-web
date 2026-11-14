import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Star,
  Award,
  Lightbulb,
  Heart,
  Zap,
  RotateCcw,
  Bug,
  MousePointerClick,
  Eye,
  Lock,
  Delete,
  Infinity as InfinityIcon,
} from 'lucide-react';
import { LevelData, Exercise, UserStats, SupportedLocale } from '../types';
import { CeldiMascot, CeldiMood } from './CeldiMascot';
import { SpreadsheetGrid, highlightsForFormula } from './SpreadsheetGrid';
import { sound } from '../lib/audio';

interface LessonModalProps {
  levelFile: string;
  levelRef: string;
  stats: UserStats;
  locale: SupportedLocale;
  onClose: () => void;
  onCompleteLevel: (levelRef: string, stars: number, earnedXp: number) => void;
  onLoseLife: () => void;
}

interface QueuedExercise {
  id: string;
  exercise: Exercise;
  originalIndex: number;
  isReview: boolean;
}

const EXERCISE_LABELS: Record<string, Record<SupportedLocale, string>> = {
  build_formula: {
    es: 'Arma la fórmula',
    en: 'Build the formula',
    de: 'Formel zusammenbauen',
    fr: 'Construis la formule',
    ja: '数式を組み立て',
    pt: 'Monte a fórmula',
  },
  formula: {
    es: 'Arma la fórmula',
    en: 'Build the formula',
    de: 'Formel zusammenbauen',
    fr: 'Construis la formule',
    ja: '数式を組み立て',
    pt: 'Monte a fórmula',
  },
  predict: {
    es: 'Predice el resultado',
    en: 'Predict the result',
    de: 'Ergebnis vorhersagen',
    fr: 'Prédis le résultat',
    ja: '結果を予測',
    pt: 'Preveja o resultado',
  },
  select_range: {
    es: 'Selecciona el rango',
    en: 'Select the range',
    de: 'Bereich auswählen',
    fr: 'Sélectionne la plage',
    ja: '範囲を選択',
    pt: 'Selecione o intervalo',
  },
  find_error: {
    es: 'Encuentra el error',
    en: 'Find the error',
    de: 'Fehler finden',
    fr: "Trouve l'erreur",
    ja: 'エラーを発見',
    pt: 'Encontre o erro',
  },
  write_formula: {
    es: 'Escribe la fórmula',
    en: 'Write the formula',
    de: 'Formel eingeben',
    fr: 'Écris la formule',
    ja: '数式を入力',
    pt: 'Escreva a fórmula',
  },
};

/**
 * Exact port of Flutter's `_shuffleAnswerList` from `exercises.dart`:
 * - Keeps `'='` at the front if present (for formula blocks/suggestions)
 * - Prevents `')'` from appearing at index 0
 * - Ensures the shuffled order differs from the original order
 */
function shuffleAnswerList(original: string[], keepEqualsFirst = false): string[] {
  if (original.length <= 1) return [...original];
  const hasEquals = keepEqualsFirst && original.includes('=');
  const pool = (hasEquals ? original.filter((t) => t !== '=') : [...original]);

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  if (pool.length > 1 && pool[0] === ')') {
    const idx = pool.findIndex((t) => t !== ')');
    if (idx !== -1) {
      [pool[0], pool[idx]] = [pool[idx], pool[0]];
    }
  }

  const result = hasEquals ? ['=', ...pool] : pool;

  const isIdentical =
    result.length === original.length && result.every((v, i) => v === original[i]);
  const allEqual = original.every((v) => v === original[0]);
  if (isIdentical && !allEqual && result.length > 1) {
    if (hasEquals && result.length > 2) {
      const firstAfterEq = result.splice(1, 1)[0];
      result.push(firstAfterEq);
    } else if (!hasEquals) {
      const first = result.shift()!;
      result.push(first);
    }
  }
  return result;
}

/**
 * If a `write_formula` exercise in JSON has no `suggestions` array,
 * build interactive token chips from `correct` plus distractors (matching Flutter).
 */
function ensureSuggestionsForWriteFormula(ex: Exercise): string[] {
  if (ex.suggestions && ex.suggestions.length > 0) {
    return shuffleAnswerList(ex.suggestions, true);
  }
  const raw = (ex.correct || '').trim();
  if (!raw) return [];

  const tokens: string[] = [];
  let rest = raw;
  if (rest.startsWith('=')) {
    tokens.push('=');
    rest = rest.slice(1);
  }

  // Tokenize function calls like PROMEDIO(A2:B2) or arithmetic like B1+1
  const regex = /([A-ZÁÉÍÓÚÑ.]+\()|([A-Z]+\d+:[A-Z]+\d+)|(\$?[A-Z]+\$?\d+)|(\d+(?:\.\d+)?)|("[^"]*")|([+\-*/^(),;:])/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(rest)) !== null) {
    tokens.push(m[0]);
  }

  // Add 1 or 2 helpful distractor tokens
  const upper = raw.toUpperCase();
  if (upper.includes('PROMEDIO(') && !tokens.includes('SUMA(')) {
    tokens.push('SUMA(');
  } else if (upper.includes('SUMA(') && !tokens.includes('PROMEDIO(')) {
    tokens.push('PROMEDIO(');
  } else if (upper.includes('+') && !tokens.includes('-')) {
    tokens.push('-');
  } else if (upper.includes('*') && !tokens.includes('/')) {
    tokens.push('/');
  } else if (!tokens.includes('+')) {
    tokens.push('+');
  }

  return shuffleAnswerList(tokens, true);
}

function shuffleExerciseAnswers(ex: Exercise, locale: SupportedLocale): Exercise {
  const copy: Exercise = { ...ex };

  const rawOptions = ex.optionsByLocale?.[locale] ?? ex.options;
  if (rawOptions && rawOptions.length > 1) {
    const shuffledOpts = shuffleAnswerList(rawOptions, false);
    copy.options = shuffledOpts;
    if (copy.optionsByLocale) {
      copy.optionsByLocale = { ...copy.optionsByLocale, [locale]: shuffledOpts };
    }
  }

  const rawBlocks = ex.blocksByLocale?.[locale] ?? ex.blocks;
  if (rawBlocks && rawBlocks.length > 1) {
    const shuffledBlocks = shuffleAnswerList(rawBlocks, true);
    copy.blocks = shuffledBlocks;
    if (copy.blocksByLocale) {
      copy.blocksByLocale = { ...copy.blocksByLocale, [locale]: shuffledBlocks };
    }
  }

  if (ex.type === 'write_formula') {
    copy.suggestions = ensureSuggestionsForWriteFormula(ex);
  }

  return copy;
}

/**
 * Exact port of Flutter's `Exercise.normalize` and `canonicalizeFormula`
 */
function normalizeAnswer(s: string): string {
  let str = s.replace(/\s+/g, '').toUpperCase().replace(/;/g, ',');
  const replacements: Record<string, string> = {
    'SUMA(': 'SUM(',
    'SUMME(': 'SUM(',
    'SOMME(': 'SUM(',
    'SOMA(': 'SUM(',
    'PROMEDIO(': 'AVERAGE(',
    'MITTELWERT(': 'AVERAGE(',
    'MOYENNE(': 'AVERAGE(',
    'MÉDIA(': 'AVERAGE(',
    'MEDIA(': 'AVERAGE(',
    'SI(': 'IF(',
    'WENN(': 'IF(',
    'SE(': 'IF(',
    'SI.ERROR(': 'IFERROR(',
    'WENNFEHLER(': 'IFERROR(',
    'SIERREUR(': 'IFERROR(',
    'SEERRO(': 'IFERROR(',
    'CONTAR.SI(': 'COUNTIF(',
    'ZÄHLENWENN(': 'COUNTIF(',
    'NB.SI(': 'COUNTIF(',
    'CONT.SE(': 'COUNTIF(',
    'BUSCARV(': 'VLOOKUP(',
    'SVERWEIS(': 'VLOOKUP(',
    'RECHERCHEV(': 'VLOOKUP(',
    'PROCV(': 'VLOOKUP(',
    'BUSCARX(': 'XLOOKUP(',
    'XVERWEIS(': 'XLOOKUP(',
    'RECHERCHEX(': 'XLOOKUP(',
    'PROCX(': 'XLOOKUP(',
    'POTENCIA(': 'POWER(',
  };
  for (const [k, v] of Object.entries(replacements)) {
    str = str.split(k).join(v);
  }
  return str;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  levelFile,
  levelRef,
  stats,
  locale,
  onClose,
  onCompleteLevel,
  onLoseLife,
}) => {
  const [level, setLevel] = useState<LevelData | null>(null);
  const [loading, setLoading] = useState(true);

  // Queue of exercises (mistakes get re-queued at the end just like Flutter/Duolingo)
  const [queue, setQueue] = useState<QueuedExercise[]>([]);
  const [initialTotal, setInitialTotal] = useState(0);
  const [solvedOriginalIndices, setSolvedOriginalIndices] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  // Exercise interaction states (NO pre-selection on select_range/find_error!)
  const [selectedCell, setSelectedCell] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [pickedBlockIndices, setPickedBlockIndices] = useState<number[]>([]);
  const [writtenTokens, setWrittenTokens] = useState<string[]>([]);
  const [writtenFormula, setWrittenFormula] = useState<string>('');

  // Resolution states
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [celdiMood, setCeldiMood] = useState<CeldiMood>('thinking');
  const [isCompleted, setIsCompleted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [combo, setCombo] = useState(0);

  // Hint sheet & solution reveal limit (max 2 per lesson, matching Flutter)
  const [showHintModal, setShowHintModal] = useState(false);
  const [revealsRemaining, setRevealsRemaining] = useState(2);
  const [revealedOriginalIndices, setRevealedOriginalIndices] = useState<Set<number>>(new Set());

  const [shakeScreen, setShakeScreen] = useState(false);
  const [showLostLifeAnim, setShowLostLifeAnim] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load level JSON and shuffle answers
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/levels/${levelFile}`);
        if (!res.ok) throw new Error('File not found');
        const data: LevelData = await res.json();
        setLevel(data);

        const initialQueue: QueuedExercise[] = (data.exercises || []).map((ex, idx) => ({
          id: `ex-${idx}-init`,
          exercise: shuffleExerciseAnswers(ex, locale),
          originalIndex: idx,
          isReview: false,
        }));
        setQueue(initialQueue);
        setInitialTotal(initialQueue.length);
        setSolvedOriginalIndices(new Set());
        setCurrentIndex(0);
      } catch (err) {
        console.warn('Error loading level from public/levels, using fallback', err);
        const fallbackEx: Exercise = {
          type: 'select_range',
          prompt: 'Toca la celda A1 para seleccionarla.',
          correct: 'A1',
          data: { A1: '10', B1: '20', A2: '30', B2: '40' },
          explanation:
            'Las celdas se identifican por la letra de la columna y el número de la fila: Columna A, Fila 1 = A1.',
        };
        setLevel({
          ref: levelRef,
          title: 'Hola, celda',
          rewardXp: 15,
          exercises: [fallbackEx],
        });
        setQueue([
          {
            id: 'ex-0-init',
            exercise: fallbackEx,
            originalIndex: 0,
            isReview: false,
          },
        ]);
        setInitialTotal(1);
        setSolvedOriginalIndices(new Set());
        setCurrentIndex(0);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [levelFile, levelRef, locale]);

  const currentQueued: QueuedExercise | undefined = queue[currentIndex];
  const currentExercise: Exercise | undefined = currentQueued?.exercise;

  // Reset exercise state upon step change
  useEffect(() => {
    if (currentExercise) {
      // NEVER pre-select answer in select_range or find_error!
      setSelectedCell('');
      setSelectedOption(null);
      setPickedBlockIndices([]);
      setWrittenTokens([]);
      setWrittenFormula('');
      setIsAnswered(false);
      setIsCorrect(false);
      setCeldiMood('thinking');
      setShowHintModal(false);
      setShakeScreen(false);
      setShowLostLifeAnim(false);

      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [currentIndex, currentQueued?.id]);

  // Derived localized fields
  const promptText = useMemo(() => {
    if (!currentExercise) return '';
    return currentExercise.promptByLocale?.[locale] ?? currentExercise.prompt;
  }, [currentExercise, locale]);

  const explanationText = useMemo(() => {
    if (!currentExercise) return '';
    return currentExercise.explanationByLocale?.[locale] ?? currentExercise.explanation;
  }, [currentExercise, locale]);

  const options = useMemo(() => {
    if (!currentExercise) return [];
    return currentExercise.optionsByLocale?.[locale] ?? currentExercise.options ?? [];
  }, [currentExercise, locale]);

  const blocks = useMemo(() => {
    if (!currentExercise) return [];
    return currentExercise.blocksByLocale?.[locale] ?? currentExercise.blocks ?? [];
  }, [currentExercise, locale]);

  const exerciseFormula = useMemo(() => {
    if (!currentExercise) return '';
    return currentExercise.formulaByLocale?.[locale] ?? currentExercise.formula ?? '';
  }, [currentExercise, locale]);

  const exerciseData = useMemo(() => {
    if (!currentExercise) return undefined;
    return currentExercise.dataByLocale?.[locale] ?? currentExercise.data;
  }, [currentExercise, locale]);

  const correctTarget = useMemo(() => {
    if (!currentExercise) return '';
    return (currentExercise.correctByLocale?.[locale] ?? currentExercise.correct ?? '').trim();
  }, [currentExercise, locale]);

  // Determine exercise type
  const isBlocksExercise =
    currentExercise?.type === 'build_formula' ||
    currentExercise?.type === 'formula' ||
    blocks.length > 0;
  const isSelectRange = currentExercise?.type === 'select_range';
  const isFindError = currentExercise?.type === 'find_error';
  const isWriteFormula = currentExercise?.type === 'write_formula';
  const isPredict = !isBlocksExercise && !isSelectRange && !isFindError && !isWriteFormula;

  // Assembled answer value based on exercise type
  const currentAnswer = useMemo(() => {
    if (isBlocksExercise) {
      return pickedBlockIndices.map((i) => blocks[i]).join('');
    }
    if (isPredict) {
      return selectedOption ?? '';
    }
    if (isSelectRange || isFindError) {
      return selectedCell;
    }
    if (isWriteFormula) {
      return writtenFormula;
    }
    return '';
  }, [
    isBlocksExercise,
    pickedBlockIndices,
    blocks,
    isPredict,
    selectedOption,
    isSelectRange,
    isFindError,
    selectedCell,
    isWriteFormula,
    writtenFormula,
  ]);

  const canSubmit = currentAnswer.trim().length > 0;

  // Update Celdi mood when user inputs an answer (matching Flutter `_promptCeldiMood`)
  const activeCeldiMood: CeldiMood = useMemo(() => {
    if (isAnswered) {
      if (isCorrect) return combo >= 3 ? 'onFire' : 'celebrating';
      return 'sad';
    }
    if (canSubmit) return 'happy';
    return celdiMood;
  }, [isAnswered, isCorrect, combo, canSubmit, celdiMood]);

  // Exercise category label
  const exerciseLabel = useMemo(() => {
    if (!currentExercise) return '';
    if (isBlocksExercise) return EXERCISE_LABELS.build_formula[locale] || 'Arma la fórmula';
    if (isFindError) return EXERCISE_LABELS.find_error[locale] || 'Encuentra el error';
    if (isSelectRange) return EXERCISE_LABELS.select_range[locale] || 'Selecciona el rango';
    if (isWriteFormula) return EXERCISE_LABELS.write_formula[locale] || 'Escribe la fórmula';
    return EXERCISE_LABELS.predict[locale] || 'Predice el resultado';
  }, [currentExercise, isBlocksExercise, isFindError, isSelectRange, isWriteFormula, locale]);

  // Single-column layout for options with spaces or > 10 chars (matching Flutter `useSingleColumn`)
  const useSingleColumnOptions = useMemo(() => {
    return options.some((opt) => opt.length > 10 || opt.includes(' '));
  }, [options]);

  // Pedagogical hint generator (matching Flutter `_getPedagogicalHint`)
  const pedagogicalHint = useMemo(() => {
    if (explanationText && explanationText.trim().length > 0) {
      return explanationText.trim();
    }
    const p = promptText.toLowerCase();
    const c = correctTarget.toUpperCase();
    if ((p.includes('columna') && p.includes('fila')) || p.includes('coordenadas')) {
      return 'Recuerda que la letra indica la columna vertical (A, B, C...) y el número indica la fila horizontal (1, 2, 3...).';
    }
    if (p.includes('rango') || c.includes(':')) {
      return 'Un rango continuo se selecciona arrastrando desde la primera celda hasta la última (o tocando el encabezado de fila/columna).';
    }
    if (c.startsWith('=')) {
      return 'Toda fórmula en una hoja de cálculo debe comenzar siempre con el signo igual (=) seguido de la función o referencia.';
    }
    return 'Observa con atención los encabezados de columna y fila en la hoja de cálculo antes de confirmar.';
  }, [explanationText, promptText, correctTarget]);

  // WriteFormula token helpers (matching Flutter `_insert`, `_backspace`, `_clearAll`)
  const handleInsertWriteToken = (token: string) => {
    if (isAnswered) return;
    sound.play('tap');
    setWrittenTokens((prev) => [...prev, token]);
    setWrittenFormula((prev) => prev + token);
  };

  const handleBackspaceWriteFormula = () => {
    if (isAnswered) return;
    sound.play('tap');
    if (writtenTokens.length > 0) {
      const lastToken = writtenTokens[writtenTokens.length - 1];
      if (writtenFormula.endsWith(lastToken)) {
        setWrittenTokens((prev) => prev.slice(0, -1));
        setWrittenFormula((prev) => prev.slice(0, prev.length - lastToken.length));
        return;
      }
    }
    setWrittenFormula((prev) => prev.slice(0, -1));
  };

  const handleClearWriteFormula = () => {
    if (isAnswered) return;
    sound.play('tap');
    setWrittenTokens([]);
    setWrittenFormula('');
  };

  const handleVerify = () => {
    if (isAnswered || !canSubmit || !currentQueued) return;

    const normUser = normalizeAnswer(currentAnswer);
    const normTarget = normalizeAnswer(correctTarget);
    const won = normUser === normTarget;

    setIsAnswered(true);
    setIsCorrect(won);

    if (won) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo >= 3 && (newCombo === 3 || newCombo % 5 === 0)) {
        sound.play('streak');
      } else {
        sound.play('correct');
      }
      setCeldiMood(newCombo >= 3 ? 'onFire' : 'celebrating');

      setSolvedOriginalIndices((prev) => {
        const next = new Set(prev);
        next.add(currentQueued.originalIndex);
        return next;
      });

      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.72 },
          colors: ['#21C26B', '#7CFFB2', '#3B82F6', '#FFC53D'],
        });
      } catch (_) {}
    } else {
      setCombo(0);
      sound.play('wrong');
      setCeldiMood('sad');
      setMistakes((prev) => prev + 1);

      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500);

      if (!stats.isPro) {
        setShowLostLifeAnim(true);
        setTimeout(() => setShowLostLifeAnim(false), 1200);
        onLoseLife();
      }

      // Re-queue failed exercise at the end of the lesson with newly shuffled options/blocks (Duolingo / Flutter parity)
      const reshuffled = shuffleExerciseAnswers(currentQueued.exercise, locale);
      setQueue((prev) => [
        ...prev,
        {
          id: `ex-${currentQueued.originalIndex}-retry-${Date.now()}`,
          exercise: reshuffled,
          originalIndex: currentQueued.originalIndex,
          isReview: true,
        },
      ]);
    }
  };

  const handleNext = () => {
    if (!level) return;
    sound.play('tap');

    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed level
      setIsCompleted(true);
      sound.play('level_win');
      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#21C26B', '#7CFFB2', '#3B82F6', '#F59E0B'],
        });
      } catch (_) {}

      const stars = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
      const earnedXp = level.rewardXp ?? 20;
      onCompleteLevel(level.ref, stars, earnedXp);
    }
  };

  // Live sheet data for write_formula (inserts user's typed formula into targetCell live)
  const effectiveSheetData = useMemo(() => {
    if (!exerciseData) return undefined;
    if (isWriteFormula && currentExercise?.targetCell) {
      return {
        ...exerciseData,
        [currentExercise.targetCell]: writtenFormula,
      };
    }
    return exerciseData;
  }, [exerciseData, isWriteFormula, currentExercise?.targetCell, writtenFormula]);

  // Formula reference highlights (matching Flutter's `highlightsFor(formula)`)
  const activeFormulaHighlights = useMemo(() => {
    if (isWriteFormula) return highlightsForFormula(writtenFormula);
    if (isPredict && exerciseFormula) return highlightsForFormula(exerciseFormula);
    return {};
  }, [isWriteFormula, writtenFormula, isPredict, exerciseFormula]);

  // Effective selection displayed in SpreadsheetGrid:
  // - select_range: `selectedCell` (starts empty '')
  // - find_error: `selectedCell` (starts empty ''; user taps cell to diagnose)
  // - write_formula: `currentExercise.targetCell`
  // - predict: `'B1'`
  const sheetSelection = useMemo(() => {
    if (isSelectRange || isFindError) return selectedCell;
    if (isWriteFormula) return currentExercise?.targetCell || 'A1';
    return 'B1';
  }, [isSelectRange, isFindError, selectedCell, isWriteFormula, currentExercise?.targetCell]);

  if (loading || !level || !currentExercise || !currentQueued) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-6 text-center">
          <CeldiMascot mood="thinking" size={60} speechText="Cargando lección..." />
        </div>
      </div>
    );
  }

  // Progress bar advances only when original exercises are solved (matching Flutter)
  const progressPercent =
    initialTotal === 0
      ? 0
      : Math.min(100, Math.round((solvedOriginalIndices.size / initialTotal) * 100));

  const isCurrentRevealed = revealedOriginalIndices.has(currentQueued.originalIndex);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div
        className={`relative bg-gv-surface border border-gv-border rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[90vh] transition-all ${
          shakeScreen ? 'animate-shake' : ''
        }`}
      >
        {/* ── 1. Top Bar (Exit + Progress Bar + Lives) */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gv-border/80 flex items-center gap-2.5 sm:gap-3 bg-gv-surface-high/60 shrink-0">
          <button
            onClick={() => {
              sound.play('tap');
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-gv-surface border border-gv-border hover:bg-gv-surface-higher flex items-center justify-center text-gv-muted hover:text-gv-text transition-colors cursor-pointer shrink-0"
            title="Salir de la lección"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Progress bar */}
          <div className="flex-1">
            <div className="w-full bg-gv-surface-higher h-2.5 rounded-full overflow-hidden border border-gv-border p-0.5">
              <div
                className="bg-gradient-to-r from-gv-primary to-gv-accent h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(33,194,107,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Lives or PRO Indicator */}
          {stats.isPro ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gv-primary-soft border border-gv-primary/40 text-gv-accent text-xs font-mono font-extrabold shrink-0">
              <InfinityIcon className="w-4 h-4 stroke-[2.5]" />
              <span>PRO</span>
            </div>
          ) : (
            <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gv-integrity/15 border border-gv-integrity/30 text-gv-integrity text-xs font-mono font-extrabold shrink-0">
              <Heart
                className={`w-4 h-4 fill-gv-integrity ${shakeScreen ? 'animate-bounce' : ''}`}
              />
              <span>{stats.lives}</span>

              {showLostLifeAnim && (
                <span className="absolute -top-3 -right-2 bg-gv-error text-black font-black text-[10px] px-1.5 rounded-full animate-bounce">
                  -1
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── 2. Middle Exercise Body */}
        {!isCompleted ? (
          <div
            ref={containerRef}
            className="p-3.5 sm:p-5 flex-1 overflow-y-auto space-y-3 sm:space-y-3.5 spreadsheet-grid-bg"
          >
            {/* Category Row: Level Ref + Exercise Label + Review Badge + Hint Button + Combo */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-gv-primary-soft text-gv-primary text-[11px] font-mono font-extrabold">
                  {level.ref}
                </span>
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-gv-primary">
                  {exerciseLabel}
                </span>
                {currentQueued.isReview && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gv-info/15 border border-gv-info/40 text-gv-info text-[9px] font-mono font-extrabold uppercase">
                    <RotateCcw className="w-2.5 h-2.5" />
                    {locale === 'es' ? 'REPASO' : 'REVIEW'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    sound.play('hint');
                    setShowHintModal(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-gv-warning/15 border border-gv-warning/30 text-gv-warning hover:bg-gv-warning/25 transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{locale === 'es' ? 'Pista' : 'Hint'}</span>
                </button>

                {combo >= 2 && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gv-primary-soft border border-gv-primary/40 text-gv-primary text-[11px] font-mono font-extrabold animate-scale-up">
                    <Zap className="w-3 h-3 fill-gv-primary" />
                    <span>x{combo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Celdi Mascot + Prompt Bubble */}
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                <CeldiMascot mood={activeCeldiMood} size={58} showBubble={false} />
              </div>
              <div className="relative flex-1 bg-gv-surface border border-gv-border rounded-2xl p-3 sm:p-3.5 shadow-md">
                <p className="text-xs sm:text-[15px] font-semibold text-gv-text leading-snug">
                  {promptText}
                </p>
              </div>
            </div>

            {/* CASE 1: Predict View (Formula Box + MiniSheet without formula bar + Options) */}
            {isPredict && (
              <div className="space-y-3">
                {exerciseFormula && (
                  <div className="flex items-center gap-3 px-3.5 py-2.5 bg-gv-surface-high border border-gv-border rounded-xl">
                    <span className="text-xs font-mono italic text-gv-muted">fx</span>
                    <span className="text-sm sm:text-base font-mono font-bold text-gv-primary truncate">
                      {exerciseFormula}
                    </span>
                  </div>
                )}

                {effectiveSheetData && (
                  <SpreadsheetGrid
                    data={effectiveSheetData}
                    selectedCell="B1"
                    showFormulaBar={false}
                    highlights={activeFormulaHighlights}
                    extraRef={exerciseFormula}
                    readOnly={true}
                  />
                )}

                {options.length > 0 && (
                  <div
                    className={`grid gap-2.5 ${
                      useSingleColumnOptions ? 'grid-cols-1' : 'grid-cols-2'
                    }`}
                  >
                    {options.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      const isCode =
                        !useSingleColumnOptions ||
                        opt.startsWith('=') ||
                        opt.startsWith('#') ||
                        opt.startsWith('$') ||
                        !isNaN(Number(opt));

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => {
                            sound.play('tap');
                            setSelectedOption(opt);
                          }}
                          className={`px-3.5 py-2.5 rounded-xl border-2 border-b-4 transition-all cursor-pointer min-h-[48px] flex items-center select-none ${
                            useSingleColumnOptions
                              ? 'justify-start text-left'
                              : 'justify-center text-center'
                          } ${isCode ? 'font-mono font-bold text-sm' : 'font-semibold text-xs sm:text-sm'} ${
                            isSelected
                              ? isAnswered
                                ? isCorrect
                                  ? 'bg-gv-primary-soft border-gv-primary text-gv-accent animate-scale-up animate-glow-flash'
                                  : 'bg-gv-error/20 border-gv-error text-gv-error animate-shake'
                                : 'bg-gv-info/15 border-gv-info text-gv-info shadow-md'
                              : 'bg-gv-surface-high border-gv-border text-gv-text hover:border-gv-info/50 hover:bg-gv-surface-higher active:scale-[0.99]'
                          }`}
                        >
                          <span className="leading-snug">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CASE 2: Select Range View (MiniSheet with allowRange=true, NO pre-selection) */}
            {isSelectRange && effectiveSheetData && (
              <div className="space-y-2.5">
                <SpreadsheetGrid
                  data={effectiveSheetData}
                  selectedCell={sheetSelection}
                  onSelectCell={(range) => {
                    if (isAnswered) return;
                    setSelectedCell(range);
                  }}
                  allowRange={true}
                  expectRange={correctTarget.includes(':')}
                  extraRef={correctTarget}
                  readOnly={isAnswered}
                />
                <div className="flex items-center gap-2 text-xs text-gv-muted px-1">
                  <MousePointerClick className="w-4 h-4 text-gv-muted shrink-0" />
                  <span>
                    {locale === 'es'
                      ? 'Toca una celda o arrastra para seleccionar un rango (también puedes tocar encabezados A, B, C o 1, 2, 3).'
                      : 'Tap a cell or drag to select a range (or tap column/row headers).'}
                  </span>
                </div>
              </div>
            )}

            {/* CASE 3: Find Error View */}
            {isFindError && effectiveSheetData && (
              <div className="space-y-2.5">
                <SpreadsheetGrid
                  data={effectiveSheetData}
                  displayValues={currentExercise.displayValues}
                  selectedCell={sheetSelection}
                  onSelectCell={(cell) => {
                    if (isAnswered) return;
                    setSelectedCell(cell);
                  }}
                  allowRange={false}
                  extraRef={currentExercise.errorCell || correctTarget}
                  formulaBarOverride={
                    selectedCell
                      ? effectiveSheetData[selectedCell] ?? ''
                      : currentExercise.errorCell
                      ? effectiveSheetData[currentExercise.errorCell] ?? ''
                      : ''
                  }
                  readOnly={isAnswered}
                />
                <div className="flex items-center gap-2 text-xs text-gv-boss px-1">
                  <Bug className="w-4 h-4 shrink-0" />
                  <span>
                    {locale === 'es'
                      ? 'Inspecciona la hoja y toca la celda que provoca o contiene el error.'
                      : 'Inspect the sheet and tap the cell causing the error.'}
                  </span>
                </div>
              </div>
            )}

            {/* CASE 4: Write Formula View (MiniSheet + TargetCell Formula Input + Token Suggestions) */}
            {isWriteFormula && (
              <div className="space-y-3">
                {effectiveSheetData && (
                  <SpreadsheetGrid
                    data={effectiveSheetData}
                    selectedCell={currentExercise.targetCell || 'A1'}
                    highlights={activeFormulaHighlights}
                    formulaBarOverride={writtenFormula}
                    extraRef={currentExercise.targetCell || correctTarget}
                    readOnly={true}
                  />
                )}

                {/* Formula Input Bar with Target Cell & Backspace */}
                <div className="flex items-center bg-gv-surface border-2 border-gv-primary/70 rounded-xl px-3 py-2 gap-2.5 shadow-inner">
                  <span className="font-mono font-bold text-xs text-gv-primary shrink-0">
                    {currentExercise.targetCell || 'A1'}
                  </span>
                  <div className="w-px h-5 bg-gv-border shrink-0" />
                  <input
                    type="text"
                    value={writtenFormula}
                    disabled={isAnswered}
                    onChange={(e) => setWrittenFormula(e.target.value)}
                    placeholder={locale === 'es' ? '=FÓRMULA(...)' : '=FORMULA(...)'}
                    className="flex-1 bg-transparent font-mono font-semibold text-sm sm:text-base text-gv-text outline-none placeholder:text-gv-faint"
                  />
                  {writtenFormula.length > 0 && !isAnswered && (
                    <button
                      onClick={handleBackspaceWriteFormula}
                      onDoubleClick={handleClearWriteFormula}
                      title={
                        locale === 'es'
                          ? 'Borrar ficha (doble clic para limpiar todo)'
                          : 'Backspace token'
                      }
                      className="p-1 text-gv-muted hover:text-gv-text transition-colors cursor-pointer"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Suggestion Token Chips */}
                {currentExercise.suggestions && currentExercise.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentExercise.suggestions.map((token, idx) => (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleInsertWriteToken(token)}
                        className="px-3.5 py-2 rounded-xl bg-gv-surface-higher hover:bg-gv-primary-soft/50 border border-gv-border border-b-[3px] font-mono font-bold text-xs sm:text-sm text-gv-text hover:text-gv-accent hover:border-gv-primary/60 transition-all cursor-pointer active:scale-95"
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CASE 5: Build Formula View (Assembled Box + Token Bank) */}
            {isBlocksExercise && (
              <div className="space-y-4 pt-1">
                {/* Answer Dropzone */}
                <div className="min-h-[68px] p-3 rounded-xl bg-gv-surface border border-gv-border flex flex-wrap items-center gap-1.5">
                  {pickedBlockIndices.length === 0 ? (
                    <div className="w-full text-center text-xs sm:text-sm text-gv-faint py-2">
                      {locale === 'es'
                        ? 'Toca las fichas para armar la fórmula'
                        : 'Tap the tokens below to build the formula'}
                    </div>
                  ) : (
                    pickedBlockIndices.map((blockIdx, orderIdx) => {
                      const token = blocks[blockIdx];
                      return (
                        <button
                          key={orderIdx}
                          disabled={isAnswered}
                          onClick={() => {
                            if (isAnswered) return;
                            sound.play('tap');
                            setPickedBlockIndices((prev) =>
                              prev.filter((_, idx) => idx !== orderIdx)
                            );
                          }}
                          className="px-3.5 py-2 rounded-xl bg-gv-primary-soft border border-gv-primary border-b-[3px] font-mono font-bold text-xs sm:text-sm text-gv-accent hover:bg-gv-primary/25 transition-all active:scale-95 cursor-pointer animate-scale-up"
                        >
                          {token}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Available Token Bank */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {blocks.map((token, idx) => {
                    const isPicked = pickedBlockIndices.includes(idx);
                    return (
                      <button
                        key={idx}
                        disabled={isAnswered || isPicked}
                        onClick={() => {
                          sound.play('tap');
                          setPickedBlockIndices((prev) => [...prev, idx]);
                        }}
                        className={`px-3.5 py-2 rounded-xl font-mono font-bold text-xs sm:text-sm transition-all select-none ${
                          isPicked
                            ? 'opacity-25 bg-gv-surface-higher border border-gv-border border-b-[3px] text-gv-text cursor-not-allowed'
                            : 'bg-gv-surface-higher hover:bg-gv-surface-high border border-gv-border border-b-[3px] text-gv-text hover:border-gv-primary/60 hover:text-gv-accent cursor-pointer active:scale-95 shadow-sm'
                        }`}
                      >
                        {token}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Victory Screen */
          <div className="p-6 sm:p-8 text-center flex flex-col items-center gap-4 my-auto">
            <CeldiMascot mood="celebrating" size={88} showBubble={false} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gv-primary font-mono">
                {locale === 'es' ? '¡Nivel Completado!' : 'Level Completed!'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gv-text mt-1">
                {level.titleByLocale?.[locale] ?? level.title}
              </h2>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((star) => {
                const earned = (mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1) >= star;
                return (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${
                      earned
                        ? 'fill-gv-warning text-gv-warning animate-scale-up'
                        : 'text-gv-border fill-gv-surface-high'
                    }`}
                  />
                );
              })}
            </div>

            {/* XP & Rewards */}
            <div className="flex items-center gap-4 bg-gv-surface-high border border-gv-border rounded-xl px-5 py-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 font-bold text-gv-accent font-mono">
                <Award className="w-4 h-4" />
                <span>+{level.rewardXp ?? 20} XP</span>
              </div>
              <div className="w-px h-4 bg-gv-border" />
              <div className="flex items-center gap-1.5 font-bold text-gv-bytes font-mono">
                <span>+5 Gemas 💎</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full max-w-xs py-3 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-gv-primary/20 active:scale-98"
            >
              {locale === 'es' ? 'Continuar al Mapa' : 'Back to Map'}
            </button>
          </div>
        )}

        {/* ── 3. Bottom Panel (100% Parity with Flutter `_BottomPanel`) */}
        {!isCompleted && (
          <div
            className={`px-4 py-3.5 sm:px-5 sm:py-4 border-t transition-colors shrink-0 ${
              !isAnswered
                ? 'bg-gv-surface border-gv-border'
                : isCorrect
                ? 'bg-gv-primary-soft border-gv-primary/50'
                : 'bg-[#2A1517] border-gv-error/50'
            }`}
          >
            {isAnswered && (
              <div className="flex items-center gap-3 mb-3.5 animate-pop-up">
                <CeldiMascot
                  mood={isCorrect ? (combo >= 3 ? 'onFire' : 'celebrating') : 'sad'}
                  size={52}
                  showBubble={false}
                />

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-base sm:text-lg font-extrabold leading-tight ${
                      isCorrect ? 'text-gv-primary' : 'text-gv-error'
                    }`}
                  >
                    {isCorrect
                      ? combo >= 5
                        ? locale === 'es'
                          ? `¡Imparable x${combo}!`
                          : `Unstoppable x${combo}!`
                        : combo >= 3
                        ? locale === 'es'
                          ? `¡Precisión x${combo}!`
                          : `Precision x${combo}!`
                        : locale === 'es'
                        ? '¡Perfecto!'
                        : 'Perfect!'
                      : locale === 'es'
                      ? '¡Error de sintaxis!'
                      : 'Syntax error!'}
                  </p>

                  {isCorrect ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono font-bold text-xs sm:text-sm text-gv-primary">
                        +3 XP
                      </span>
                      {combo >= 2 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gv-primary/15 border border-gv-primary/40 text-gv-primary font-mono font-extrabold text-[11px]">
                          <Zap className="w-3 h-3 fill-gv-primary" />
                          {locale === 'es' ? `Racha x${combo}` : `Streak x${combo}`}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 mt-1 text-gv-integrity font-bold text-xs">
                      <Heart className="w-3.5 h-3.5 fill-gv-integrity shrink-0" />
                      <span className="truncate">
                        {locale === 'es'
                          ? '-1 Integridad • Se repetirá al final'
                          : '-1 Integrity • Will repeat at the end'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Yellow Pista Button on the right side when wrong (matching Flutter) */}
                {!isCorrect && (
                  <button
                    onClick={() => {
                      sound.play('hint');
                      setShowHintModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gv-warning/15 border border-gv-warning/40 text-gv-text font-bold text-xs hover:bg-gv-warning/25 transition-colors cursor-pointer shrink-0"
                  >
                    <Lightbulb className="w-4 h-4 text-gv-warning" />
                    <span>{locale === 'es' ? 'Pista' : 'Hint'}</span>
                  </button>
                )}
              </div>
            )}

            <button
              disabled={!isAnswered && !canSubmit}
              onClick={!isAnswered ? handleVerify : handleNext}
              className={`w-full py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none ${
                !isAnswered
                  ? canSubmit
                    ? 'bg-gv-primary hover:bg-gv-accent text-black border-b-4 border-b-gv-primary-dark cursor-pointer active:translate-y-0.5 active:border-b-2 shadow-lg shadow-gv-primary/25'
                    : 'bg-gv-surface-higher text-gv-faint border border-gv-border cursor-not-allowed'
                  : isCorrect
                  ? 'bg-gv-primary hover:bg-gv-accent text-black border-b-4 border-b-gv-primary-dark cursor-pointer active:translate-y-0.5'
                  : 'bg-gv-error hover:bg-gv-error/90 text-white border-b-4 border-b-red-800 cursor-pointer active:translate-y-0.5'
              }`}
            >
              <span>
                {!isAnswered
                  ? locale === 'es'
                    ? 'Comprobar'
                    : 'Check'
                  : locale === 'es'
                  ? 'Continuar'
                  : 'Continue'}
              </span>
            </button>
          </div>
        )}

        {/* ── 4. Pedagogical Hint Bottom Sheet Modal (matching Flutter `_showHintSheet`) */}
        {showHintModal && (
          <div
            className="absolute inset-0 z-30 bg-black/70 backdrop-blur-xs flex items-end justify-center animate-fade-in"
            onClick={() => setShowHintModal(false)}
          >
            <div
              className="w-full bg-gv-surface-high border-t border-gv-border rounded-t-3xl p-5 sm:p-6 space-y-4 animate-pop-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gv-border rounded-full mx-auto" />

              <div className="flex items-center gap-3.5">
                <CeldiMascot mood="thinking" size={56} showBubble={false} />
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-gv-text">
                    {locale === 'es' ? 'Pista de Celdi' : "Celdi's Hint"}
                  </h3>
                  <p className="text-xs text-gv-muted">
                    {locale === 'es'
                      ? 'Analicemos la lógica paso a paso'
                      : "Let's analyze the logic step by step"}
                  </p>
                </div>
              </div>

              {/* Consigna */}
              <div className="p-3.5 rounded-xl bg-gv-surface-higher border border-gv-border">
                <span className="block font-mono font-bold text-[10px] uppercase tracking-wider text-gv-muted mb-1">
                  {locale === 'es' ? 'CONSIGNA' : 'PROMPT'}
                </span>
                <p className="text-xs sm:text-sm font-medium text-gv-text">{promptText}</p>
              </div>

              {/* Orientación */}
              <div className="p-3.5 rounded-xl bg-gv-warning/10 border border-gv-warning/30 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-gv-warning shrink-0 mt-0.5" />
                <div>
                  <span className="block font-mono font-extrabold text-[10px] uppercase tracking-wider text-gv-warning mb-1">
                    {locale === 'es' ? 'ORIENTACIÓN' : 'GUIDANCE'}
                  </span>
                  <p className="text-xs sm:text-sm text-gv-text leading-relaxed">
                    {pedagogicalHint}
                  </p>
                </div>
              </div>

              {/* Reveal Answer Option (Limited to 2 per lesson like Flutter) */}
              {isCurrentRevealed ? (
                <div className="px-3.5 py-2.5 rounded-lg bg-gv-surface-higher border border-gv-primary/30 flex items-center gap-2 font-mono text-xs">
                  <span className="text-gv-muted">
                    {locale === 'es' ? 'Solución: ' : 'Solution: '}
                  </span>
                  <span className="font-extrabold text-gv-primary">{correctTarget}</span>
                </div>
              ) : revealsRemaining > 0 ? (
                <button
                  onClick={() => {
                    sound.play('hint');
                    setRevealsRemaining((prev) => prev - 1);
                    setRevealedOriginalIndices((prev) => {
                      const next = new Set(prev);
                      next.add(currentQueued.originalIndex);
                      return next;
                    });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-gv-faint hover:text-gv-muted underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {locale === 'es'
                      ? `Revelar respuesta (quedan ${revealsRemaining})`
                      : `Reveal answer (${revealsRemaining} left)`}
                  </span>
                </button>
              ) : (
                <div className="px-3.5 py-2 rounded-lg bg-gv-surface-higher border border-gv-border flex items-center gap-2 text-xs text-gv-muted">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {locale === 'es'
                      ? 'Límite de revelaciones alcanzado en esta lección'
                      : 'Reveal limit reached for this lesson'}
                  </span>
                </div>
              )}

              <button
                onClick={() => setShowHintModal(false)}
                className="w-full py-3 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer border-b-4 border-b-gv-primary-dark"
              >
                {locale === 'es' ? '¡Intentarlo!' : 'Try it!'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
