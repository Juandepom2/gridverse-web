import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, AlertCircle, ArrowRight, Star, Award } from 'lucide-react';
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
  const [selectedCell, setSelectedCell] = useState('A1');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [celdiMood, setCeldiMood] = useState<CeldiMood>('thinking');
  const [celdiSpeech, setCeldiSpeech] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [mistakes, setMistakes] = useState(0);

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
        // Minimal fallback level
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

  useEffect(() => {
    if (currentExercise) {
      setSelectedCell('A1');
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setCeldiMood('thinking');
      setCeldiSpeech(
        locale === 'es' ? '¡Tú puedes! Analiza la celda o fórmula con calma.' : 'You got this! Take a look at the grid.'
      );
    }
  }, [currentIndex, currentExercise, locale]);

  if (loading || !level || !currentExercise) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-gv-surface border border-gv-border rounded-2xl p-6 text-center">
          <CeldiMascot mood="thinking" size={64} speechText="Cargando lección..." />
        </div>
      </div>
    );
  }

  const promptText =
    currentExercise.promptByLocale?.[locale] ?? currentExercise.prompt;
  const explanationText =
    currentExercise.explanationByLocale?.[locale] ?? currentExercise.explanation;
  const options =
    currentExercise.optionsByLocale?.[locale] ?? currentExercise.options ?? [];

  const handleVerify = (userAnswer: string) => {
    if (isAnswered) return;

    const correctTarget = currentExercise.correct.trim().toUpperCase();
    const cleanUser = userAnswer.trim().toUpperCase();
    const won = cleanUser === correctTarget;

    setIsAnswered(true);
    setIsCorrect(won);

    if (won) {
      sound.play('correct');
      setCeldiMood('celebrating');
      setCeldiSpeech(locale === 'es' ? '¡Exacto! Celda dominada 🎉' : 'Spot on! Cell mastered 🎉');
    } else {
      sound.play('wrong');
      setCeldiMood('sad');
      setCeldiSpeech(locale === 'es' ? '¡Ups! Revisa la fila y columna.' : 'Oops! Check row and column.');
      setMistakes((m) => m + 1);
      onLoseLife();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < level.exercises.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Completed level
      setIsCompleted(true);
      sound.play('level_win');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
      const earnedXp = level.rewardXp ?? 20;
      onCompleteLevel(level.ref, stars, earnedXp);
    }
  };

  const progressPercent = Math.round(
    ((currentIndex + (isAnswered && isCorrect ? 1 : 0)) / level.exercises.length) * 100
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-gv-surface border border-gv-border rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto animate-fade-in">
        {/* Header: Progress Bar & Close */}
        <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gv-border bg-gv-surface-high">
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gv-muted hover:text-gv-text hover:bg-gv-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress bar */}
          <div className="flex-1 h-3 bg-gv-surface rounded-full overflow-hidden border border-gv-border p-0.5">
            <div
              className="h-full bg-gradient-to-r from-gv-primary to-gv-accent rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-xs font-mono font-bold text-gv-accent">
            {currentIndex + 1}/{level.exercises.length}
          </div>
        </div>

        {/* Content Body */}
        {!isCompleted ? (
          <div className="p-5 md:p-7 flex flex-col gap-6">
            {/* Mascot and Prompt */}
            <div className="flex items-start gap-4">
              <CeldiMascot mood={celdiMood} size={64} speechText={celdiSpeech} />
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gv-primary">
                  {level.ref} • {level.titleByLocale?.[locale] ?? level.title}
                </span>
                <h3 className="text-base md:text-lg font-bold text-gv-text mt-1 leading-snug">
                  {promptText}
                </h3>
              </div>
            </div>

            {/* Interactive Component depending on exercise type */}
            {currentExercise.type === 'select_range' ? (
              <div className="flex flex-col gap-3">
                <SpreadsheetGrid
                  data={currentExercise.data ?? { A1: '10', B1: '20', A2: '30', B2: '40' }}
                  selectedCell={selectedCell}
                  onSelectCell={(cell) => {
                    setSelectedCell(cell);
                    if (!isAnswered) {
                      handleVerify(cell);
                    }
                  }}
                  readOnly={isAnswered}
                />
                <p className="text-xs text-center text-gv-muted">
                  💡 Haz clic en la celda correspondiente dentro de la hoja de cálculo
                </p>
              </div>
            ) : (
              /* Predict / Multiple choice */
              <div className="flex flex-col gap-4">
                {currentExercise.data && (
                  <SpreadsheetGrid
                    data={currentExercise.data}
                    selectedCell={selectedCell}
                    onSelectCell={setSelectedCell}
                    readOnly
                  />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => {
                          setSelectedOption(opt);
                          handleVerify(opt);
                        }}
                        className={`p-3.5 rounded-xl border text-sm font-semibold font-mono text-left transition-all ${
                          isSelected
                            ? isCorrect
                              ? 'bg-gv-primary-soft border-gv-primary text-gv-accent'
                              : 'bg-gv-error/20 border-gv-error text-gv-error'
                            : 'bg-gv-surface-high border-gv-border text-gv-text hover:border-gv-primary/50 hover:bg-gv-surface-higher'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback Banner on answer */}
            {isAnswered && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 animate-fade-in ${
                  isCorrect
                    ? 'bg-gv-primary-soft/60 border-gv-primary/50 text-gv-text'
                    : 'bg-gv-error/15 border-gv-error/40 text-gv-text'
                }`}
              >
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-gv-accent shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-gv-error shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-xs md:text-sm">
                  <p className="font-bold mb-1">
                    {isCorrect
                      ? locale === 'es' ? '¡Respuesta correcta!' : 'Correct Answer!'
                      : locale === 'es' ? 'Respuesta incorrecta' : 'Incorrect'}
                  </p>
                  {explanationText && <p className="text-gv-muted leading-relaxed">{explanationText}</p>}
                </div>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-lg bg-gv-primary hover:bg-gv-accent hover:text-black font-bold text-black text-xs md:text-sm flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {locale === 'es' ? 'Continuar' : 'Next'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Victory Screen */
          <div className="p-8 text-center flex flex-col items-center gap-5">
            <CeldiMascot mood="celebrating" size={96} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gv-primary">
                {locale === 'es' ? '¡Nivel Completado!' : 'Level Completed!'}
              </span>
              <h2 className="text-2xl font-black text-gv-text mt-1">
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
                      earned ? 'fill-gv-warning text-gv-warning' : 'text-gv-border fill-gv-surface-high'
                    }`}
                  />
                );
              })}
            </div>

            {/* XP & Rewards */}
            <div className="flex items-center gap-4 bg-gv-surface-high border border-gv-border rounded-xl px-5 py-3 text-sm">
              <div className="flex items-center gap-2 font-bold text-gv-accent">
                <Award className="w-5 h-5" />
                <span>+{level.rewardXp ?? 20} XP</span>
              </div>
              <div className="w-px h-5 bg-gv-border" />
              <div className="flex items-center gap-1.5 font-bold text-gv-bytes">
                <span>+5 Gemas 💎</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full max-w-xs py-3 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-gv-primary/20"
            >
              {locale === 'es' ? 'Continuar al Mapa' : 'Back to Map'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
