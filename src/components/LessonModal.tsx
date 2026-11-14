import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Star,
  Award,
  Lightbulb,
  Heart,
  Zap,
  CornerDownLeft,
  RotateCcw,
  Bug,
  MousePointerClick,
  Sparkles,
} from 'lucide-react';
import { LevelData, Exercise, UserStats, SupportedLocale } from '../types';
import { CeldiMascot, CeldiMood } from './CeldiMascot';
import { SpreadsheetGrid } from './SpreadsheetGrid';
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

const EXERCISE_LABELS: Record<string, Record<SupportedLocale, string>> = {
  build_formula: {
    es: 'Arma la fórmula',
    en: 'Build the formula',
    de: 'Formel bauen',
    fr: 'Construis la formule',
    ja: '数式を組み立てる',
    pt: 'Monte a fórmula',
  },
  formula: {
    es: 'Arma la fórmula',
    en: 'Build the formula',
    de: 'Formel bauen',
    fr: 'Construis la formule',
    ja: '数式を組み立てる',
    pt: 'Monte a fórmula',
  },
  predict: {
    es: 'Predice el resultado',
    en: 'Predict the result',
    de: 'Ergebnis vorhersagen',
    fr: 'Prédis le résultat',
    ja: '結果を予測する',
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
    es: 'Caza el error',
    en: 'Catch the error',
    de: 'Fehler finden',
    fr: 'Trouve l\'erreur',
    ja: 'エラーを見つける',
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
  const [currentIndex, setCurrentIndex] = useState(0);

  // Exercise interaction states
  const [selectedCell, setSelectedCell] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [pickedBlockIndices, setPickedBlockIndices] = useState<number[]>([]);
  const [writtenFormula, setWrittenFormula] = useState<string>('');

  // Resolution states
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [celdiMood, setCeldiMood] = useState<CeldiMood>('thinking');
  const [isCompleted, setIsCompleted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [showLostLifeAnim, setShowLostLifeAnim] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Load level JSON
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/levels/${levelFile}`);
        if (!res.ok) throw new Error('File not found');
        const data: LevelData = await res.json();
        setLevel(data);
      } catch (err) {
        console.warn('Error loading level from public/levels, using fallback', err);
        setLevel({
          ref: levelRef,
          title: 'Hola, celda',
          titleByLocale: {
            es: 'Hola, celda',
            en: 'Hello, Cell',
            de: 'Hallo, Zelle',
            fr: 'Bonjour, cellule',
            ja: 'ハロー、セル',
            pt: 'Olá, célula',
          },
          rewardXp: 15,
          exercises: [
            {
              type: 'select_range',
              prompt: 'Toca la celda A1 para seleccionarla.',
              promptByLocale: {
                es: 'Toca la celda A1 para seleccionarla.',
                en: 'Tap cell A1 to select it.',
                de: 'Tippe auf Zelle A1, um sie auszuwählen.',
                fr: 'Touche la cellule A1 pour la sélectionner.',
                ja: 'セル A1 をタップして選択してください。',
                pt: 'Toque na célula A1 para selecioná-la.',
              },
              correct: 'A1',
              data: { A1: '10', B1: '20', A2: '30', B2: '40' },
              explanation: 'Las celdas se identifican por la letra de la columna y el número de la fila: Columna A, Fila 1 = A1.',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [levelFile, levelRef]);

  const currentExercise: Exercise | undefined = level?.exercises[currentIndex];

  // Reset exercise state upon step change
  useEffect(() => {
    if (currentExercise) {
      setSelectedCell(currentExercise.data ? Object.keys(currentExercise.data)[0] || 'A1' : 'B1');
      setSelectedOption(null);
      setPickedBlockIndices([]);
      setWrittenFormula('');
      setIsAnswered(false);
      setIsCorrect(false);
      setCeldiMood('thinking');
      setShowHint(false);
      setShakeScreen(false);
      setShowLostLifeAnim(false);

      // Scroll container to top smoothly on new exercise
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }
  }, [currentIndex, currentExercise]);

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

  // Exercise category label
  const exerciseLabel = useMemo(() => {
    if (!currentExercise) return '';
    if (isBlocksExercise) return EXERCISE_LABELS.build_formula[locale] || 'Arma la fórmula';
    if (isFindError) return EXERCISE_LABELS.find_error[locale] || 'Caza el error';
    if (isSelectRange) return EXERCISE_LABELS.select_range[locale] || 'Selecciona el rango';
    if (isWriteFormula) return EXERCISE_LABELS.write_formula[locale] || 'Escribe la fórmula';
    return EXERCISE_LABELS.predict[locale] || 'Predice el resultado';
  }, [currentExercise, isBlocksExercise, isFindError, isSelectRange, isWriteFormula, locale]);

  // Check whether options should use single-column layout (if any option is long, like in Flutter)
  const useSingleColumnOptions = useMemo(() => {
    return options.some((opt) => opt.length > 18 || opt.includes(' '));
  }, [options]);

  const handleVerify = () => {
    if (isAnswered || !canSubmit) return;

    const cleanUser = currentAnswer.trim().replace(/\s+/g, '').toUpperCase();
    const cleanTarget = correctTarget.trim().replace(/\s+/g, '').toUpperCase();

    // Check with and without leading '=' for user tolerance
    const won =
      cleanUser === cleanTarget ||
      cleanUser === cleanTarget.replace(/^=/, '') ||
      `=${cleanUser}` === cleanTarget;

    setIsAnswered(true);
    setIsCorrect(won);

    if (won) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo >= 3) {
        sound.play('streak');
      } else {
        sound.play('correct');
      }
      setCeldiMood('celebrating');

      // Visual confetti burst
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

      // Trigger shake effect and lost life animation
      setShakeScreen(true);
      setShowLostLifeAnim(true);
      setTimeout(() => setShakeScreen(false), 500);
      setTimeout(() => setShowLostLifeAnim(false), 1200);

      onLoseLife();
    }
  };

  const handleNext = () => {
    if (!level) return;
    sound.play('tap');

    if (currentIndex + 1 < level.exercises.length) {
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

  if (loading || !level || !currentExercise) {
    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-6 text-center">
          <CeldiMascot mood="thinking" size={60} speechText="Cargando lección..." />
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / level.exercises.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div
        className={`bg-gv-surface border border-gv-border rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col h-[94vh] sm:h-auto sm:max-h-[88vh] transition-all ${
          shakeScreen ? 'animate-shake' : ''
        }`}
      >
        {/* ── 1. Top Bar (Compact, always pinned) */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-gv-border/80 flex items-center gap-2.5 sm:gap-3 bg-gv-surface-high/60 shrink-0">
          <button
            onClick={() => {
              sound.play('tap');
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-gv-surface border border-gv-border hover:bg-gv-surface-higher flex items-center justify-center text-gv-muted hover:text-gv-text transition-colors cursor-pointer shrink-0"
            title="Cerrar lección"
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

          {/* Combo Badge */}
          {combo >= 2 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gv-primary/15 border border-gv-primary/40 text-gv-accent text-xs font-mono font-black animate-scale-up">
              <Zap className="w-3 h-3 fill-gv-accent" />
              <span>x{combo}</span>
            </div>
          )}

          {/* Lives Indicator with minus 1 animation */}
          <div className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gv-error/15 border border-gv-error/30 text-gv-error text-xs font-mono font-bold shrink-0">
            <Heart className={`w-3.5 h-3.5 fill-gv-error ${shakeScreen ? 'animate-bounce' : ''}`} />
            <span>{stats.lives}</span>

            {showLostLifeAnim && (
              <span className="absolute -top-3 -right-2 bg-gv-error text-black font-black text-[10px] px-1 rounded-full animate-bounce">
                -1
              </span>
            )}
          </div>
        </div>

        {/* ── 2. Scrollable Middle Body (Compact spacing to avoid scrolling) */}
        {!isCompleted ? (
          <div
            ref={containerRef}
            className="p-3 sm:p-5 flex-1 overflow-y-auto space-y-3 sm:space-y-4"
          >
            {/* Category Sub-Row: Ref Badge + Exercise Label + Hint Button */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="px-2 py-0.5 rounded bg-gv-primary-soft text-gv-accent text-[11px] font-mono font-bold tracking-wider">
                  {level.ref}
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gv-primary">
                  {exerciseLabel}
                </span>
              </div>

              {explanationText && (
                <button
                  onClick={() => {
                    sound.play('hint');
                    setShowHint((prev) => !prev);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                    showHint
                      ? 'bg-gv-warning/20 border-gv-warning text-gv-warning'
                      : 'bg-gv-surface-high border-gv-border text-gv-muted hover:text-gv-warning hover:border-gv-warning/50'
                  }`}
                >
                  <Lightbulb className="w-3 h-3" />
                  <span>{locale === 'es' ? 'Pista' : 'Hint'}</span>
                </button>
              )}
            </div>

            {/* Hint Drawer (Toggled) */}
            {showHint && explanationText && (
              <div className="p-3 rounded-xl bg-gv-warning/10 border border-gv-warning/30 flex items-start gap-2.5 animate-pop-up text-xs text-gv-warning">
                <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold">
                    {locale === 'es' ? 'Pista de Celdi: ' : 'Celdi’s hint: '}
                  </span>
                  {explanationText}
                </div>
              </div>
            )}

            {/* Celdi Mascot (No Pupils) + Speech Bubble with Prompt */}
            <div className="flex items-start gap-3">
              <div className="shrink-0 pt-0.5">
                <CeldiMascot mood={celdiMood} size={54} />
              </div>
              <div className="relative flex-1 bg-gv-surface-high border border-gv-border rounded-xl p-3 sm:p-3.5 shadow-md">
                <div className="absolute top-4 -left-1.5 w-2.5 h-2.5 bg-gv-surface-high border-l border-b border-gv-border transform rotate-45" />
                <p className="text-xs sm:text-sm font-semibold text-gv-text leading-snug">
                  {promptText}
                </p>
              </div>
            </div>

            {/* Formula Context Banner (e.g. fx =BUSCARV()) */}
            {exerciseFormula && !isBlocksExercise && (
              <div className="flex items-center gap-2.5 px-3 py-2 bg-gv-surface-higher border border-gv-border rounded-xl">
                <span className="text-xs font-mono font-bold italic text-gv-primary">fx</span>
                <span className="text-xs sm:text-sm font-mono font-bold text-gv-text truncate">
                  {exerciseFormula}
                </span>
              </div>
            )}

            {/* MiniSheet / Spreadsheet Grid (Only rendered if relevant, compact) */}
            {exerciseData && (
              <div className="space-y-1">
                <SpreadsheetGrid
                  data={exerciseData}
                  selectedCell={selectedCell}
                  onSelectCell={(cell) => {
                    if (isAnswered) return;
                    setSelectedCell(cell);
                  }}
                  readOnly={isAnswered}
                  targetFormula={exerciseFormula}
                />
                {(isSelectRange || isFindError) && (
                  <div className="flex items-center justify-between text-[11px] px-1 text-gv-muted font-mono">
                    <span className="flex items-center gap-1">
                      {isFindError ? (
                        <Bug className="w-3 h-3 text-gv-error" />
                      ) : (
                        <MousePointerClick className="w-3 h-3 text-gv-primary" />
                      )}
                      {locale === 'es'
                        ? 'Toca una celda en la tabla para responder'
                        : 'Tap a cell on the grid to answer'}
                    </span>
                    {selectedCell && (
                      <span className="font-bold text-gv-accent">[{selectedCell}]</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* INTERACTIVE ANSWER AREA */}

            {/* CASE A: Build Formula with Blocks */}
            {isBlocksExercise && (
              <div className="space-y-3 pt-1">
                {/* Construction Dropzone */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gv-muted font-mono">
                      {locale === 'es' ? 'Fórmula armada:' : 'Formula assembled:'}
                    </span>
                    {pickedBlockIndices.length > 0 && !isAnswered && (
                      <button
                        onClick={() => {
                          sound.play('tap');
                          setPickedBlockIndices([]);
                        }}
                        className="text-[11px] text-gv-muted hover:text-gv-error flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>{locale === 'es' ? 'Borrar todo' : 'Clear all'}</span>
                      </button>
                    )}
                  </div>

                  <div className="min-h-[56px] p-2 sm:p-2.5 rounded-xl bg-gv-surface-high border-2 border-dashed border-gv-border flex flex-wrap items-center gap-1.5 transition-all">
                    {pickedBlockIndices.length === 0 ? (
                      <div className="w-full text-center text-xs text-gv-faint py-2 font-mono">
                        {locale === 'es'
                          ? '👆 Toca las fichas de abajo para armar la fórmula'
                          : '👆 Tap the chips below to build the formula'}
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
                            className="px-3 py-1.5 rounded-lg bg-gv-primary-soft border border-gv-primary border-b-2 sm:border-b-4 border-b-gv-primary-dark font-mono font-bold text-xs sm:text-sm text-gv-accent hover:bg-gv-primary/25 transition-all active:scale-95 cursor-pointer shadow flex items-center gap-1 animate-scale-up"
                          >
                            <span>{token}</span>
                            {!isAnswered && (
                              <span className="text-[10px] text-gv-muted hover:text-gv-error">✕</span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Available Token Chips Pool */}
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-gv-muted mb-2 font-mono text-center">
                    {locale === 'es' ? 'Fichas disponibles:' : 'Available chips:'}
                  </span>
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
                              ? 'opacity-20 bg-gv-surface-high border border-gv-border text-gv-faint cursor-not-allowed scale-95'
                              : 'bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border border-b-3 border-b-black/50 text-gv-text hover:border-gv-primary/60 hover:text-gv-accent cursor-pointer active:scale-95 shadow'
                          }`}
                        >
                          {token}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* CASE B: Predict / Multiple Choice */}
            {isPredict && options.length > 0 && (
              <div className="space-y-2 pt-0.5">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gv-muted mb-1.5 font-mono">
                  {locale === 'es' ? 'Selecciona una respuesta:' : 'Select an answer:'}
                </span>
                <div
                  className={`grid gap-2 ${
                    useSingleColumnOptions ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'
                  }`}
                >
                  {options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => {
                          sound.play('tap');
                          setSelectedOption(opt);
                        }}
                        className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold font-mono text-left transition-all border-b-3 cursor-pointer flex items-center justify-between min-h-[46px] select-none ${
                          isSelected
                            ? isAnswered
                              ? isCorrect
                                ? 'bg-gv-primary-soft border-gv-primary border-b-gv-primary-dark text-gv-accent animate-scale-up animate-glow-flash'
                                : 'bg-gv-error/25 border-gv-error border-b-gv-error/80 text-gv-error animate-shake'
                              : 'bg-gv-primary-soft/50 border-gv-primary border-b-gv-primary-dark text-gv-accent shadow-md'
                            : 'bg-gv-surface-high border-gv-border border-b-black/50 text-gv-text hover:border-gv-primary/50 hover:bg-gv-surface-higher active:scale-[0.99]'
                        }`}
                      >
                        <span className="leading-snug">{opt}</span>
                        <div
                          className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                            isSelected
                              ? 'border-gv-primary bg-gv-primary text-black'
                              : 'border-gv-border'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CASE C: Write Formula */}
            {isWriteFormula && (
              <div className="space-y-2 pt-1">
                <div className="p-2.5 bg-gv-surface-high border border-gv-border rounded-xl flex items-center gap-2 font-mono">
                  <span className="text-gv-accent font-bold text-xs">
                    {currentExercise.targetCell ?? 'A1'} =
                  </span>
                  <input
                    type="text"
                    readOnly
                    value={writtenFormula}
                    placeholder={locale === 'es' ? 'Toca sugerencias...' : 'Tap tokens...'}
                    className="flex-1 bg-transparent text-gv-text font-bold text-xs sm:text-sm outline-none"
                  />
                  {writtenFormula.length > 0 && !isAnswered && (
                    <button
                      onClick={() => {
                        sound.play('tap');
                        setWrittenFormula((prev) => prev.slice(0, -1));
                      }}
                      className="p-1 text-gv-muted hover:text-gv-error cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {currentExercise.suggestions && (
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {currentExercise.suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => {
                          sound.play('tap');
                          setWrittenFormula((prev) => prev + s);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-gv-surface-high hover:bg-gv-surface-higher border border-gv-border border-b-2 text-xs font-mono font-bold text-gv-text cursor-pointer active:scale-95"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ── Victory Screen */
          <div className="p-6 sm:p-8 text-center flex flex-col items-center gap-4 my-auto">
            <CeldiMascot mood="celebrating" size={88} />
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
                      earned ? 'fill-gv-warning text-gv-warning animate-scale-up' : 'text-gv-border fill-gv-surface-high'
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

        {/* ── 3. Bottom Action / Feedback Footer (PINNED, ALWAYS ON SCREEN) */}
        {!isCompleted && (
          <div className="p-3 sm:p-4 border-t border-gv-border bg-gv-surface-high/90 shrink-0">
            {!isAnswered ? (
              <button
                disabled={!canSubmit}
                onClick={handleVerify}
                className={`w-full py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 select-none ${
                  canSubmit
                    ? 'bg-gv-primary hover:bg-gv-accent text-black border-b-4 border-b-gv-primary-dark cursor-pointer active:translate-y-0.5 active:border-b-2 shadow-lg shadow-gv-primary/25'
                    : 'bg-gv-surface-higher text-gv-faint border border-gv-border cursor-not-allowed'
                }`}
              >
                <span>{locale === 'es' ? 'Comprobar' : 'Check'}</span>
                <CornerDownLeft className="w-4 h-4" />
              </button>
            ) : (
              <div
                className={`p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pop-up ${
                  isCorrect
                    ? 'bg-gv-primary-soft/80 border-gv-primary/60 text-gv-text'
                    : 'bg-gv-error/20 border-gv-error/50 text-gv-text'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-gv-accent shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gv-error shrink-0 mt-0.5" />
                  )}
                  <div className="text-xs sm:text-sm">
                    <p className="font-bold text-xs sm:text-sm mb-0.5">
                      {isCorrect
                        ? locale === 'es'
                          ? '¡Excelente! Respuesta correcta'
                          : 'Awesome! Correct answer'
                        : locale === 'es'
                        ? 'Respuesta incorrecta'
                        : 'Incorrect'}
                    </p>
                    {!isCorrect && correctTarget && (
                      <p className="text-gv-error font-mono font-bold text-xs mb-1">
                        {locale === 'es' ? 'Solución correcta: ' : 'Correct solution: '}
                        <span className="underline">{correctTarget}</span>
                      </p>
                    )}
                    {explanationText && (
                      <p className="text-gv-muted leading-relaxed text-[11px] sm:text-xs max-w-md">
                        {explanationText}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <span>{locale === 'es' ? 'Continuar' : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
