import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Timer,
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Lock,
  Calculator,
  Search,
  Wrench,
  Trophy,
  Target,
  Keyboard,
  Flame,
  Star,
  Gem,
  X,
  Table2,
  ListChecks,
  RotateCcw,
} from 'lucide-react';
import { SupportedLocale, UserStats } from '../../types';
import { sound } from '../../lib/audio';
import { CeldiMascot, CeldiMood } from '../CeldiMascot';
import {
  PRACTICE_COURSES,
  PracticeCourseData,
  MissionData,
  StepByStepExerciseData,
  getStepByStepExercise,
} from '../../data/coursesData';
import { MissionModal } from '../practice/MissionModal';

interface PracticeTabProps {
  stats: UserStats;
  locale: SupportedLocale;
  onReward: (xp: number, gems: number, completedRef?: string) => void;
  onLoseLife?: () => void;
  onNavigateTab?: (tab: string) => void;
}

interface SpeedQuestion {
  prompt: string;
  options: string[];
  correct: string;
}

const STATIC_SPEED_QUESTIONS: SpeedQuestion[] = [
  {
    prompt: '¿Qué celda está en Columna B, Fila 4?',
    options: ['B4', '4B', 'A4', 'B5'],
    correct: 'B4',
  },
  {
    prompt: '¿Cuánto resulta la fórmula =5*4+2?',
    options: ['22', '30', '20', '28'],
    correct: '22',
  },
  {
    prompt: '¿Qué símbolo inicia obligatoriamente toda fórmula?',
    options: ['=', '+', '@', '#'],
    correct: '=',
  },
  {
    prompt: '¿Qué función obtiene el promedio de varias celdas?',
    options: ['PROMEDIO', 'MEDIA', 'SUMA', 'CONTAR'],
    correct: 'PROMEDIO',
  },
  {
    prompt: '¿Qué tecla fija una referencia absoluta ($A$1)?',
    options: ['F4', 'F2', 'F9', 'Ctrl'],
    correct: 'F4',
  },
  {
    prompt: '¿Cuál es el resultado de =SUMA(10, 15, 5)?',
    options: ['30', '25', '35', '10155'],
    correct: '30',
  },
  {
    prompt: '¿Qué símbolo representa división en Excel?',
    options: ['/', '÷', '\\', ':'],
    correct: '/',
  },
  {
    prompt: '¿Qué error aparece al dividir un número entre cero?',
    options: ['#¡DIV/0!', '#¡REF!', '#¡VALOR!', '#N/A'],
    correct: '#¡DIV/0!',
  },
  {
    prompt: '¿Qué celda está 2 filas abajo de C2?',
    options: ['C4', 'C3', 'E2', 'B2'],
    correct: 'C4',
  },
  {
    prompt: '¿Cuál es el resultado de =MAX(12, 45, 8)?',
    options: ['45', '12', '8', '65'],
    correct: '45',
  },
  {
    prompt: '¿Qué atajo inserta una Autosuma rápidamente?',
    options: ['Alt + =', 'Ctrl + S', 'Shift + A', 'Ctrl + +'],
    correct: 'Alt + =',
  },
  {
    prompt: '¿Cuál es el resultado de =MIN(100, 25, 75)?',
    options: ['25', '100', '75', '0'],
    correct: '25',
  },
  {
    prompt: '¿Qué celda está a la derecha de A1?',
    options: ['B1', 'A2', 'B2', 'AA1'],
    correct: 'B1',
  },
  {
    prompt: '¿Qué atajo activa o quita los Filtros?',
    options: ['Ctrl + Shift + L', 'Ctrl + F', 'Alt + F', 'Ctrl + T'],
    correct: 'Ctrl + Shift + L',
  },
  {
    prompt: '¿Cuánto resulta =2^3 (potencia de 2 al cubo)?',
    options: ['8', '6', '9', '5'],
    correct: '8',
  },
  {
    prompt: '¿Qué error indica que el nombre de función no existe?',
    options: ['#¿NOMBRE?', '#¡REF!', '#¡NULO!', '#¡NUM!'],
    correct: '#¿NOMBRE?',
  },
  {
    prompt: '¿Qué función cuenta celdas que contienen números?',
    options: ['CONTAR', 'CONTARA', 'SUMA', 'CONTAR.SI'],
    correct: 'CONTAR',
  },
  {
    prompt: '¿Cuál es el resultado de =10-2*3?',
    options: ['4', '24', '16', '6'],
    correct: '4',
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Exact port of Flutter's `_generateProceduralQuestion` from `time_attack_screen.dart`
 */
function generateProceduralQuestion(): SpeedQuestion {
  const type = Math.floor(Math.random() * 5);
  if (type === 0) {
    const a = Math.floor(Math.random() * 7) + 2;
    const b = Math.floor(Math.random() * 5) + 2;
    const c = Math.floor(Math.random() * 8) + 1;
    const isAdd = Math.random() > 0.5;
    if (isAdd) {
      const result = a + b * c;
      const set = new Set<string>([
        String(result),
        String((a + b) * c),
        String(a * b + c),
        String(result + 3),
      ]);
      let step = 2;
      while (set.size < 4) {
        set.add(String(result + step));
        step += 3;
      }
      return {
        prompt: `¿Cuánto resulta la fórmula =${a}+${b}*${c}?`,
        options: shuffleArray(Array.from(set).slice(0, 4)),
        correct: String(result),
      };
    } else {
      const result = a * b - c;
      const set = new Set<string>([
        String(result),
        String(a * (b - c)),
        String(result + 4),
        String(result - 2),
      ]);
      let step = 3;
      while (set.size < 4) {
        set.add(String(result + step));
        step += 2;
      }
      return {
        prompt: `¿Cuánto resulta la fórmula =${a}*${b}-${c}?`,
        options: shuffleArray(Array.from(set).slice(0, 4)),
        correct: String(result),
      };
    }
  } else if (type === 1) {
    const n1 = (Math.floor(Math.random() * 6) + 1) * 10;
    const n2 = (Math.floor(Math.random() * 5) + 1) * 5;
    const n3 = (Math.floor(Math.random() * 4) + 1) * 10;
    const sum = n1 + n2 + n3;
    const set = new Set<string>([
      String(sum),
      String(sum - 10),
      String(sum + 15),
      `${n1}${n2}`,
    ]);
    return {
      prompt: `¿Cuál es el resultado de =SUMA(${n1}, ${n2}, ${n3})?`,
      options: shuffleArray(Array.from(set).slice(0, 4)),
      correct: String(sum),
    };
  } else if (type === 2) {
    const isMax = Math.random() > 0.5;
    const nA = (Math.floor(Math.random() * 8) + 1) * 12;
    const nB = (Math.floor(Math.random() * 8) + 1) * 15;
    const nC = (Math.floor(Math.random() * 8) + 1) * 9;
    const nums = [nA, nB, nC];
    const target = isMax ? Math.max(...nums) : Math.min(...nums);
    const set = new Set<string>([
      String(target),
      String(nA),
      String(nB),
      String(nC),
      String(target + 10),
      String(target + 25),
    ]);
    return {
      prompt: `¿Cuál es el resultado de =${isMax ? 'MAX' : 'MIN'}(${nA}, ${nB}, ${nC})?`,
      options: shuffleArray(Array.from(set).slice(0, 4)),
      correct: String(target),
    };
  } else if (type === 3) {
    const cols = ['A', 'B', 'C', 'D', 'E'];
    const colIdx = Math.floor(Math.random() * 3);
    const row = Math.floor(Math.random() * 6) + 1;
    const offset = Math.floor(Math.random() * 2) + 1;
    const target = `${cols[colIdx]}${row + offset}`;
    const opts = shuffleArray([
      target,
      `${cols[colIdx]}${row + offset + 1}`,
      `${cols[colIdx + 1]}${row}`,
      `${cols[colIdx]}${row > 1 ? row - 1 : row + 3}`,
    ]);
    return {
      prompt: `¿Qué celda está ${offset} ${offset === 1 ? 'fila' : 'filas'} abajo de ${cols[colIdx]}${row}?`,
      options: opts,
      correct: target,
    };
  } else {
    const base = (Math.floor(Math.random() * 6) + 1) * 100;
    const pct = (Math.floor(Math.random() * 4) + 1) * 10;
    const res = Math.round((base * pct) / 100);
    const opts = shuffleArray([
      String(res),
      String(res + 10),
      String(Math.floor(res / 2) + 5),
      String(base - res),
    ]);
    return {
      prompt: `¿Cuánto es el ${pct}% de ${base}?`,
      options: opts,
      correct: String(res),
    };
  }
}

function buildTimeAttackDeck(): SpeedQuestion[] {
  const staticPool = shuffleArray(STATIC_SPEED_QUESTIONS).map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
  const procedural = Array.from({ length: 14 }, () => generateProceduralQuestion());
  return shuffleArray([...staticPool, ...procedural]);
}

const SHORTCUT_DRILL_QUESTIONS = [
  {
    q: '¿Qué atajo convierte una celda relativa (A1) en absoluta ($A$1)?',
    win: 'F4',
    mac: 'Cmd + T / F4',
    opts: ['F4', 'F2', 'Ctrl + A', 'Alt + F4'],
    ans: 'F4',
  },
  {
    q: '¿Qué combinación inserta automáticamente la función =SUMA() (Autosuma)?',
    win: 'Alt + =',
    mac: 'Cmd + Shift + T',
    opts: ['Alt + =', 'Ctrl + S', 'Ctrl + +', 'Shift + ='],
    ans: 'Alt + =',
  },
  {
    q: '¿Qué atajo activa o desactiva los Filtros de una tabla?',
    win: 'Ctrl + Shift + L',
    mac: 'Cmd + Shift + F',
    opts: ['Ctrl + Shift + L', 'Ctrl + F', 'Alt + L', 'Ctrl + T'],
    ans: 'Ctrl + Shift + L',
  },
  {
    q: '¿Qué tecla permite editar directamente el contenido de la celda activa?',
    win: 'F2',
    mac: 'F2 / Ctrl + U',
    opts: ['F2', 'F5', 'Esc', 'Tab'],
    ans: 'F2',
  },
  {
    q: '¿Qué atajo selecciona toda la fila actual en la hoja de cálculo?',
    win: 'Shift + Espacio',
    mac: 'Shift + Espacio',
    opts: ['Shift + Espacio', 'Ctrl + Espacio', 'Alt + Espacio', 'Ctrl + R'],
    ans: 'Shift + Espacio',
  },
  {
    q: '¿Qué atajo selecciona toda la columna actual en la hoja de cálculo?',
    win: 'Ctrl + Espacio',
    mac: 'Ctrl + Espacio',
    opts: ['Ctrl + Espacio', 'Shift + Espacio', 'Ctrl + C', 'Alt + C'],
    ans: 'Ctrl + Espacio',
  },
  {
    q: '¿Qué combinación convierte un rango de datos en una Tabla Oficial de Excel?',
    win: 'Ctrl + T',
    mac: 'Cmd + T',
    opts: ['Ctrl + T', 'Ctrl + B', 'Alt + T', 'Shift + T'],
    ans: 'Ctrl + T',
  },
  {
    q: '¿Qué combinación deshace la última acción realizada?',
    win: 'Ctrl + Z',
    mac: 'Cmd + Z',
    opts: ['Ctrl + Z', 'Ctrl + Y', 'Ctrl + X', 'Alt + Z'],
    ans: 'Ctrl + Z',
  },
];

/**
 * Port of `CourseCeldiMascot` from `course_celdi_mascot.dart`
 */
const CourseCeldiMascot: React.FC<{
  courseOrder: number;
  color: string;
  isLocked: boolean;
  isCompleted: boolean;
}> = ({ courseOrder, color, isLocked, isCompleted }) => {
  const [showBubble, setShowBubble] = useState(false);

  const mood: CeldiMood = isCompleted
    ? 'celebrating'
    : isLocked
    ? 'sad'
    : courseOrder === 1
    ? 'happy'
    : courseOrder === 2
    ? 'thinking'
    : 'onFire';

  const getPhrase = () => {
    if (isLocked) return '¡Completa el curso anterior o hazte PRO para desbloquearme!';
    if (isCompleted) return '¡Curso dominado al 100%! 🏆';
    if (courseOrder === 1) return '¡Vamos a cuadrar las cuentas del negocio!';
    if (courseOrder === 2) return '¡Activando modo detective de fórmulas!';
    return '¡Hora de reparar esas bases de datos!';
  };

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer select-none"
      onClick={(e) => {
        e.stopPropagation();
        sound.play('tap');
        setShowBubble((prev) => !prev);
      }}
    >
      {showBubble && (
        <div
          className="absolute -top-11 right-0 z-20 whitespace-nowrap px-2.5 py-1 rounded-xl bg-gv-surface-high border text-[10px] font-bold text-gv-text shadow-xl animate-fade-in"
          style={{ borderColor: color }}
        >
          {getPhrase()}
        </div>
      )}

      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Glow */}
        <div
          className="absolute inset-1 rounded-full blur-md opacity-25"
          style={{ backgroundColor: isLocked ? '#64748B' : color }}
        />

        <div className={isLocked ? 'opacity-65 grayscale-[35%]' : ''}>
          <CeldiMascot mood={mood} size={52} />
        </div>

        {/* Floating Themed Accessory Badge */}
        <div
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gv-surface-high border-2 flex items-center justify-center shadow-md"
          style={{ borderColor: isLocked ? '#475569' : color }}
        >
          {isLocked ? (
            <span className="text-[8px] font-mono font-black text-gv-muted">Zzz</span>
          ) : isCompleted ? (
            <Trophy className="w-3.5 h-3.5 text-gv-warning" />
          ) : courseOrder === 1 ? (
            <Calculator className="w-3.5 h-3.5" style={{ color }} />
          ) : courseOrder === 2 ? (
            <Search className="w-3.5 h-3.5" style={{ color }} />
          ) : (
            <Wrench className="w-3.5 h-3.5" style={{ color }} />
          )}
        </div>
      </div>
    </div>
  );
};

export const PracticeTab: React.FC<PracticeTabProps> = ({
  stats,
  locale,
  onReward,
  onLoseLife,
  onNavigateTab,
}) => {
  // Preview modal before launching a mission (MissionDetailSheet)
  const [previewMission, setPreviewMission] = useState<MissionData | null>(null);
  // Active multi-step workbook exercise
  const [activeExercise, setActiveExercise] = useState<StepByStepExerciseData | null>(null);

  // Daily Challenge completion state for today
  const todayKey = useMemo(() => {
    const now = new Date();
    return `daily_challenge_${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}`;
  }, []);

  const [dailyCompleted, setDailyCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(todayKey) === 'true';
    } catch {
      return false;
    }
  });
  const [remainingTime, setRemainingTime] = useState({ hours: 7, minutes: 25 });

  // Time Attack 60s state
  const [isTimeAttackOpen, setIsTimeAttackOpen] = useState(false);
  const [taQuestions, setTaQuestions] = useState<SpeedQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selectedTaAnswer, setSelectedTaAnswer] = useState<string | null>(null);
  const [lastTaCorrect, setLastTaCorrect] = useState<boolean | null>(null);
  const [isTaFinished, setIsTaFinished] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [personalRecord, setPersonalRecord] = useState<number>(() => {
    try {
      return Number(localStorage.getItem('time_attack_record') || '0');
    } catch {
      return 0;
    }
  });

  // Keyboard Shortcuts Drill state
  const [isShortcutsDrillOpen, setIsShortcutsDrillOpen] = useState(false);
  const [shortcutIndex, setShortcutIndex] = useState(0);
  const [shortcutScore, setShortcutScore] = useState(0);
  const [shortcutSelected, setShortcutSelected] = useState<string | null>(null);
  const [shortcutDone, setShortcutDone] = useState(false);

  // Check if a mission is completed (either in stats.completedLevels or localStorage)
  const isMissionDone = (ref: string): boolean => {
    const upper = ref.toUpperCase();
    for (const [k, v] of Object.entries(stats.completedLevels || {})) {
      if (k.toUpperCase() === upper && v && v.stars > 0) return true;
    }
    try {
      const local = JSON.parse(localStorage.getItem('gridverse_completed_missions') || '{}');
      return Boolean(local[upper]);
    } catch {
      return false;
    }
  };

  const isCourseDone = (course: PracticeCourseData): boolean => {
    return course.missions.every((m) => isMissionDone(m.ref));
  };

  const isCourseUnlocked = (course: PracticeCourseData): boolean => {
    if (stats.isPro) return true;
    if (!course.prerequisiteCourseId) return true;
    const prereq = PRACTICE_COURSES.find((c) => c.id === course.prerequisiteCourseId);
    if (!prereq) return true;
    return isCourseDone(prereq);
  };

  const isMissionUnlocked = (mission: MissionData, course: PracticeCourseData): boolean => {
    if (!isCourseUnlocked(course)) return false;
    if (!mission.prerequisiteRef) return true;
    return isMissionDone(mission.prerequisiteRef);
  };

  // Countdown timer for daily challenge
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
      const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
      setRemainingTime({ hours, minutes });
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Time Attack 60s Timer
  useEffect(() => {
    if (!isTimeAttackOpen || isTaFinished) return;
    if (timeLeft <= 0) {
      setIsTaFinished(true);
      sound.play('level_win');
      confetti({ particleCount: 70, spread: 60 });
      const prevBest = Number(localStorage.getItem('time_attack_record') || '0');
      if (score > prevBest) {
        setIsNewRecord(true);
        setPersonalRecord(score);
        localStorage.setItem('time_attack_record', String(score));
      }
      if (score > 0) {
        onReward(score * 3, Math.max(5, Math.floor(score * 1.5)));
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isTimeAttackOpen, timeLeft, isTaFinished, score, onReward]);

  const handleOpenTimeAttack = () => {
    sound.play('tap');
    setTaQuestions(buildTimeAttackDeck());
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setQIndex(0);
    setSelectedTaAnswer(null);
    setLastTaCorrect(null);
    setIsTaFinished(false);
    setIsNewRecord(false);
    setIsTimeAttackOpen(true);
  };

  const handleAnswerTimeAttack = (option: string) => {
    if (selectedTaAnswer !== null || isTaFinished) return;
    const currentQ = taQuestions[qIndex % taQuestions.length];
    const correct = option === currentQ.correct;
    setSelectedTaAnswer(option);
    setLastTaCorrect(correct);

    if (correct) {
      sound.play('correct');
      const nextCombo = combo + 1;
      const multiplier = nextCombo >= 8 ? 4 : nextCombo >= 5 ? 3 : nextCombo >= 3 ? 2 : 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) setMaxCombo(nextCombo);
      setScore((s) => s + 10 * multiplier);
    } else {
      sound.play('wrong');
      setCombo(0);
    }

    setTimeout(() => {
      setSelectedTaAnswer(null);
      setLastTaCorrect(null);
      setQIndex((i) => i + 1);
    }, 260);
  };

  const handleCompleteExercise = (ref: string, xp: number, gems: number) => {
    try {
      const saved = JSON.parse(localStorage.getItem('gridverse_completed_missions') || '{}');
      saved[ref.toUpperCase()] = true;
      localStorage.setItem('gridverse_completed_missions', JSON.stringify(saved));
      if (ref.toUpperCase() === 'DAILY') {
        localStorage.setItem(todayKey, 'true');
        setDailyCompleted(true);
      }
    } catch {
      // ignore storage errors
    }
    onReward(xp, gems, ref.toUpperCase());
  };

  const totalMissionsCount = PRACTICE_COURSES.reduce((acc, c) => acc + c.missions.length, 0);
  const completedMissionsCount = PRACTICE_COURSES.reduce(
    (acc, c) => acc + c.missions.filter((m) => isMissionDone(m.ref)).length,
    0
  );

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-7 py-6 px-4">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gv-text tracking-tight">
            {locale === 'es' ? 'Centro de Práctica' : 'Practice Center'}
          </h1>
          <p className="text-xs text-gv-muted mt-0.5">
            {locale === 'es'
              ? 'Resuelve libros contables multipaso de negocios reales y entrena tu velocidad.'
              : 'Solve multi-sheet business workbooks and train your formula speed.'}
          </p>
        </div>
      </div>

      {/* 1. Daily Challenge Banner (matching mobile _DailyChallengeCard) */}
      <div
        onClick={() => {
          sound.play('tap');
          setActiveExercise(getStepByStepExercise('DAILY', locale));
        }}
        className={`relative overflow-hidden rounded-3xl border p-6 md:p-7 shadow-2xl cursor-pointer transition-all hover:scale-[1.005] ${
          dailyCompleted
            ? 'bg-gradient-to-br from-gv-surface-high via-gv-surface to-gv-primary/15 border-gv-primary/50'
            : 'bg-gradient-to-br from-gv-surface-high via-gv-surface to-gv-boss/15 border-gv-boss/50'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                  dailyCompleted
                    ? 'bg-gv-primary/20 text-gv-accent border-gv-primary/40'
                    : 'bg-gv-boss/20 text-gv-boss border-gv-boss/40'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {dailyCompleted
                    ? locale === 'es'
                      ? '¡COMPLETADO HOY!'
                      : 'COMPLETED TODAY!'
                    : locale === 'es'
                    ? 'DESAFÍO DIARIO · 3 HOJAS'
                    : 'DAILY CHALLENGE · 3 SHEETS'}
                </span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gv-bg/80 border border-gv-border font-mono text-[11px] font-bold text-gv-muted">
                <Clock className="w-3 h-3 text-gv-warning" />
                <span>
                  {remainingTime.hours}h {remainingTime.minutes}m
                </span>
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-gv-text">
              {locale === 'es'
                ? 'La Hoja Rota: Facturación y BUSCARV'
                : 'The Broken Sheet: Billing & VLOOKUP'}
            </h2>
            <p className="text-xs md:text-sm text-gv-muted mt-1 max-w-lg leading-relaxed">
              {locale === 'es'
                ? 'Audita y repara 10 pasos en 3 hojas de cálculo empresariales con errores #N/A, SI.ERROR y referencias absolutas $B$5.'
                : 'Audit and repair 10 steps across 3 business sheets with #N/A errors, IFERROR, and $B$5 references.'}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 mt-4 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-gv-warning/15 border border-gv-warning/30 font-mono text-xs font-extrabold text-gv-warning">
                ⚡ +60 XP
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-gv-bytes/15 border border-gv-bytes/30 font-mono text-xs font-extrabold text-gv-bytes">
                💎 +50 Gemas
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-gv-surface border border-gv-border font-mono text-xs font-bold text-gv-muted">
                📊 10 pasos · 3 hojas
              </span>
            </div>

            <div className="mt-5 flex justify-center sm:justify-start">
              <button
                type="button"
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg flex items-center gap-2 ${
                  dailyCompleted
                    ? 'bg-gv-surface-higher border border-gv-primary text-gv-accent hover:bg-gv-primary hover:text-black'
                    : 'bg-gv-primary hover:bg-gv-accent text-black shadow-gv-primary/25'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {dailyCompleted
                    ? locale === 'es'
                      ? 'Practicar de nuevo'
                      : 'Practice Again'
                    : locale === 'es'
                    ? 'Resolver Desafío Diario'
                    : 'Solve Daily Challenge'}
                </span>
              </button>
            </div>
          </div>

          <div className="shrink-0">
            <CeldiMascot mood={dailyCompleted ? 'celebrating' : 'onFire'} size={108} />
          </div>
        </div>
      </div>

      {/* 2. Specialization Path (Courses with CourseCeldiMascot & Progressive Unlocking) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h2 className="text-lg md:text-xl font-black text-gv-text">
              {locale === 'es' ? 'Ruta de Especialización Práctica' : 'Practical Specialization Path'}
            </h2>
            <p className="text-xs text-gv-muted mt-0.5">
              {locale === 'es'
                ? 'Libros de trabajo reales de múltiples hojas con clientes y casos de negocio.'
                : 'Real multi-sheet workbooks with clients and hands-on business cases.'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-gv-primary/15 border border-gv-primary/35 font-mono text-xs font-extrabold text-gv-accent">
            {completedMissionsCount}/{totalMissionsCount} casos resueltos
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {PRACTICE_COURSES.map((course) => {
            const courseUnlocked = isCourseUnlocked(course);
            const courseDone = isCourseDone(course);
            const doneCount = course.missions.filter((m) => isMissionDone(m.ref)).length;
            const totalCount = course.missions.length;
            const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
            const isFreeCourse = course.order === 1;

            return (
              <div
                key={course.id}
                className="bg-gv-surface border-[1.5px] rounded-3xl p-5 md:p-6 shadow-xl flex flex-col gap-4 transition-all"
                style={{
                  borderColor: !courseUnlocked
                    ? '#233229'
                    : courseDone
                    ? '#21C26B'
                    : `${course.color}66`,
                }}
              >
                {/* Course Header with CourseCeldiMascot */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black uppercase tracking-wider"
                        style={{
                          backgroundColor: `${course.color}22`,
                          color: courseUnlocked ? course.color : '#94A3B8',
                        }}
                      >
                        CURSO {course.order}
                      </span>

                      {isFreeCourse ? (
                        <span className="px-2 py-0.5 rounded-md bg-gv-primary/20 border border-gv-primary/40 font-mono text-[10px] font-black text-gv-accent">
                          GRATIS
                        </span>
                      ) : !stats.isPro ? (
                        <span className="px-2 py-0.5 rounded-md bg-gv-warning/20 border border-gv-warning/40 font-mono text-[10px] font-black text-gv-warning flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> PRO
                        </span>
                      ) : null}

                      {courseDone && (
                        <span className="px-2 py-0.5 rounded-md bg-gv-primary text-black font-mono text-[10px] font-black flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> COMPLETADO
                        </span>
                      )}
                    </div>

                    <h3 className="text-base md:text-lg font-extrabold text-gv-text">
                      {course.title.includes('·')
                        ? course.title.split('·')[1].trim()
                        : course.title}
                    </h3>
                    <p className="text-xs text-gv-muted mt-0.5">{course.subtitle}</p>
                  </div>

                  <CourseCeldiMascot
                    courseOrder={course.order}
                    color={course.color}
                    isLocked={!courseUnlocked}
                    isCompleted={courseDone}
                  />
                </div>

                {/* Course Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-gv-surface-high overflow-hidden border border-gv-border/60">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: courseUnlocked ? course.color : '#475569',
                      }}
                    />
                  </div>
                  <span
                    className="font-mono text-xs font-extrabold"
                    style={{ color: courseUnlocked ? course.color : '#64748B' }}
                  >
                    {doneCount}/{totalCount} ({progressPct}%)
                  </span>
                </div>

                {/* Locked Course Notice */}
                {!courseUnlocked && course.prerequisiteCourseTitle && (
                  <div className="px-3.5 py-2.5 rounded-xl bg-gv-warning/10 border border-gv-warning/30 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-xs text-gv-warning font-semibold">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>
                        Completa <strong>{course.prerequisiteCourseTitle}</strong> o desbloquea{' '}
                        <strong>Gridverse PRO</strong> para acceder inmediatamente.
                      </span>
                    </div>
                    {onNavigateTab && (
                      <button
                        type="button"
                        onClick={() => onNavigateTab('shop')}
                        className="px-3 py-1 rounded-lg bg-gv-warning text-black font-black text-[11px] cursor-pointer"
                      >
                        Ver PRO
                      </button>
                    )}
                  </div>
                )}

                {/* Course Missions List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {course.missions.map((mission) => {
                    const isDone = isMissionDone(mission.ref);
                    const unlocked = isMissionUnlocked(mission, course);
                    const exData = getStepByStepExercise(mission.ref, locale);

                    return (
                      <div
                        key={mission.ref}
                        onClick={() => {
                          sound.play('tap');
                          if (!unlocked) {
                            setPreviewMission(mission);
                            return;
                          }
                          setPreviewMission(mission);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          !unlocked
                            ? 'bg-gv-bg/60 border-gv-border/60 opacity-75 hover:border-gv-border'
                            : isDone
                            ? 'bg-gv-surface-high/70 border-gv-primary/50 hover:border-gv-primary'
                            : 'bg-gv-surface-high border-gv-border hover:border-gv-accent hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border"
                            style={{
                              backgroundColor: `${mission.color}18`,
                              borderColor: `${mission.color}40`,
                            }}
                          >
                            {mission.emoji}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gv-muted">
                                {mission.client}
                              </span>
                              <span className="text-[10px] font-mono text-gv-primary font-bold">
                                · {exData.steps.length} pasos · {exData.sheets.length} hojas
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-gv-text mt-0.5 truncate">
                              {mission.title}
                            </h4>
                            <p className="text-[11px] text-gv-muted mt-1 line-clamp-2 leading-relaxed">
                              {mission.description}
                            </p>

                            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-gv-accent border border-gv-primary/20">
                                {mission.skills}
                              </span>
                              {isDone && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-gv-warning">
                                  <Star className="w-3 h-3 fill-gv-warning" />
                                  <Star className="w-3 h-3 fill-gv-warning" />
                                  <Star className="w-3 h-3 fill-gv-warning" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 pt-1">
                          {!unlocked ? (
                            <Lock className="w-4 h-4 text-gv-muted" />
                          ) : isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-gv-accent" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gv-muted" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. All 3 Quick Training Modes (Entrenamiento Rápido) */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-gv-text">
            {locale === 'es' ? 'Entrenamiento Rápido' : 'Quick Training'}
          </h2>
          <p className="text-xs text-gv-muted mt-0.5">
            {locale === 'es'
              ? 'Sesiones intensivas para reforzar puntos débiles, agilidad mental y atajos.'
              : 'Focused drills to reinforce weak spots, mental speed, and keyboard shortcuts.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Mode 1: Repasar Puntos Débiles (WEAK_POINTS) */}
          <div
            onClick={() => {
              sound.play('tap');
              setActiveExercise(getStepByStepExercise('WEAK_POINTS', locale));
            }}
            className="p-5 rounded-2xl bg-gv-surface border border-gv-border hover:border-gv-info/60 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-md group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gv-info/15 border border-gv-info/30 flex items-center justify-center text-gv-info group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-gv-info/15 text-gv-info border border-gv-info/30">
                +45 XP
              </span>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-gv-text">
                {locale === 'es' ? 'Repasar puntos débiles' : 'Review Weak Points'}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {locale === 'es'
                  ? 'Practica referencias fijas ($B$5), jerarquía de paréntesis y potencias en 2 hojas.'
                  : 'Practice absolute references ($B$5), parentheses priority, and powers across 2 sheets.'}
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gv-info pt-1 border-t border-gv-border/60">
              <span>10 pasos · 2 hojas</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Mode 2: Contrarreloj de 60s (TimeAttackScreen) */}
          <div
            onClick={handleOpenTimeAttack}
            className="p-5 rounded-2xl bg-gv-surface border border-gv-border hover:border-gv-warning/60 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-md group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gv-warning/15 border border-gv-warning/30 flex items-center justify-center text-gv-warning group-hover:scale-105 transition-transform">
                <Timer className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-gv-warning/15 text-gv-warning border border-gv-warning/30">
                {personalRecord > 0 ? `Récord: ${personalRecord} pts` : '60 seg'}
              </span>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-gv-text">
                {locale === 'es' ? 'Contrarreloj de 60s' : '60s Time Attack'}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {locale === 'es'
                  ? '¿Cuántas fórmulas y cálculos mentales puedes resolver antes de que acabe el reloj?'
                  : 'How many formulas and mental calculations can you solve before time runs out?'}
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gv-warning pt-1 border-t border-gv-border/60">
              <span>Combos x2 · x3 · x4</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Mode 3: Atajos de Teclado (SHORTCUTS) */}
          <div
            onClick={() => {
              sound.play('tap');
              setShortcutIndex(0);
              setShortcutScore(0);
              setShortcutSelected(null);
              setShortcutDone(false);
              setIsShortcutsDrillOpen(true);
            }}
            className="p-5 rounded-2xl bg-gv-surface border border-gv-border hover:border-gv-primary/60 transition-all cursor-pointer flex flex-col justify-between gap-4 shadow-md group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gv-primary/15 border border-gv-primary/30 flex items-center justify-center text-gv-accent group-hover:scale-105 transition-transform">
                <Keyboard className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-full bg-gv-primary/15 text-gv-accent border border-gv-primary/30">
                +30 XP
              </span>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-extrabold text-gv-text">
                {locale === 'es' ? 'Atajos de teclado' : 'Keyboard Shortcuts'}
              </h3>
              <p className="text-xs text-gv-muted mt-1 leading-relaxed">
                {locale === 'es'
                  ? 'Domina F4, Alt+=, Ctrl+Shift+L y combinaciones rápidas de productividad.'
                  : 'Master F4, Alt+=, Ctrl+Shift+L, and high-speed productivity shortcuts.'}
              </p>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-gv-accent pt-1 border-t border-gv-border/60">
              <span>8 retos interactivos</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* MissionDetailSheet Modal (Preview before launching StepByStepScreen) */}
      {previewMission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          {(() => {
            const parentCourse =
              PRACTICE_COURSES.find((c) => c.id === previewMission.courseId) ||
              PRACTICE_COURSES[0];
            const unlocked = isMissionUnlocked(previewMission, parentCourse);
            const done = isMissionDone(previewMission.ref);
            const ex = getStepByStepExercise(previewMission.ref, locale);

            return (
              <div className="w-full max-w-md bg-gv-surface border border-gv-border rounded-3xl p-6 shadow-2xl flex flex-col gap-4 animate-fade-in">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border"
                      style={{
                        backgroundColor: `${previewMission.color}18`,
                        borderColor: `${previewMission.color}45`,
                      }}
                    >
                      {previewMission.emoji}
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${previewMission.color}20`,
                          color: previewMission.color,
                        }}
                      >
                        CLIENTE: {previewMission.client}
                      </span>
                      <h3 className="text-lg font-black text-gv-text mt-1">
                        {previewMission.title}
                      </h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewMission(null)}
                    className="p-1.5 rounded-lg text-gv-muted hover:text-gv-text cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs md:text-sm text-gv-muted leading-relaxed">
                  {previewMission.description}
                </p>

                {/* Workbook Specs */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-gv-surface-high border border-gv-border flex items-center gap-2.5">
                    <ListChecks className="w-4 h-4 text-gv-primary shrink-0" />
                    <div>
                      <div className="text-[10px] text-gv-muted font-bold">Estructura</div>
                      <div className="text-xs font-mono font-extrabold text-gv-text">
                        {ex.steps.length} pasos guiados
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-gv-surface-high border border-gv-border flex items-center gap-2.5">
                    <Table2 className="w-4 h-4 text-gv-info shrink-0" />
                    <div>
                      <div className="text-[10px] text-gv-muted font-bold">Libro Excel</div>
                      <div className="text-xs font-mono font-extrabold text-gv-text">
                        {ex.sheets.length} hojas conectadas
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sheets preview */}
                <div className="flex flex-wrap gap-1.5">
                  {ex.sheets.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded-lg bg-gv-bg border border-gv-border font-mono text-[11px] text-gv-text font-semibold"
                    >
                      📄 {s.name}
                    </span>
                  ))}
                </div>

                {/* Rewards */}
                <div className="p-3 rounded-xl bg-gv-surface-high/60 border border-gv-border flex items-center justify-around">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-gv-warning">
                    <Zap className="w-4 h-4 fill-gv-warning" />
                    <span>+{ex.earnedXp} XP</span>
                  </div>
                  <div className="w-px h-4 bg-gv-border" />
                  <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-gv-bytes">
                    <Gem className="w-4 h-4" />
                    <span>+{ex.earnedBytes} Gemas</span>
                  </div>
                  <div className="w-px h-4 bg-gv-border" />
                  <div className="font-mono text-[11px] font-bold text-gv-accent">
                    {previewMission.skills}
                  </div>
                </div>

                {!unlocked ? (
                  <div className="p-3.5 rounded-xl bg-gv-warning/10 border border-gv-warning/30 text-xs text-gv-warning font-semibold flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>
                        Requisito previo:{' '}
                        <strong>
                          {previewMission.prerequisiteTitle ||
                            parentCourse.prerequisiteCourseTitle}
                        </strong>
                      </span>
                    </div>
                    {onNavigateTab && !stats.isPro && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewMission(null);
                          onNavigateTab('shop');
                        }}
                        className="w-full py-2.5 rounded-xl bg-gv-warning text-black font-black text-xs uppercase cursor-pointer"
                      >
                        Desbloquear todo con Gridverse PRO
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      sound.play('tap');
                      const targetEx = getStepByStepExercise(previewMission.ref, locale);
                      setPreviewMission(null);
                      setActiveExercise(targetEx);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-gv-primary/25 flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>{done ? 'REPETIR MISIÓN PASO A PASO' : 'COMENZAR MISIÓN'}</span>
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Multi-Sheet StepByStep Workbook Modal */}
      {activeExercise && (
        <MissionModal
          exercise={activeExercise}
          stats={stats}
          locale={locale}
          onClose={() => setActiveExercise(null)}
          onSuccess={handleCompleteExercise}
          onLoseLife={onLoseLife}
        />
      )}

      {/* 60-Second Time Attack Modal (matching TimeAttackScreen) */}
      {isTimeAttackOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gv-surface border border-gv-border rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gv-border pb-3">
              <div className="flex items-center gap-2 text-gv-warning font-black text-sm">
                <Timer className="w-5 h-5" />
                <span>CONTRARRELOJ 60s</span>
              </div>

              <div className="flex items-center gap-2">
                {combo >= 2 && !isTaFinished && (
                  <span className="px-2.5 py-0.5 rounded-full bg-gv-streak/20 border border-gv-streak text-gv-streak font-mono text-xs font-black flex items-center gap-1 animate-bounce">
                    <Flame className="w-3.5 h-3.5 fill-gv-streak" />
                    x{combo >= 8 ? 4 : combo >= 5 ? 3 : 2}
                  </span>
                )}
                <span
                  className={`font-mono text-lg font-black px-3 py-0.5 rounded-xl border ${
                    timeLeft <= 10
                      ? 'bg-gv-error/20 border-gv-error text-gv-error animate-pulse'
                      : 'bg-gv-bg border-gv-border text-gv-accent'
                  }`}
                >
                  {timeLeft}s
                </span>
                <button
                  type="button"
                  onClick={() => setIsTimeAttackOpen(false)}
                  className="p-1 text-gv-muted hover:text-gv-text cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isTaFinished && taQuestions.length > 0 ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-gv-muted">
                    Puntaje: <strong className="text-gv-text text-sm">{score}</strong>
                  </span>
                  <span className="text-gv-warning">
                    Récord: <strong>{personalRecord}</strong>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gv-surface-high border border-gv-border flex items-center gap-3">
                  <CeldiMascot
                    mood={
                      lastTaCorrect === true
                        ? 'celebrating'
                        : lastTaCorrect === false
                        ? 'sad'
                        : combo >= 3
                        ? 'onFire'
                        : 'thinking'
                    }
                    size={50}
                  />
                  <p className="text-sm md:text-base font-bold text-gv-text leading-snug">
                    {taQuestions[qIndex % taQuestions.length].prompt}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {taQuestions[qIndex % taQuestions.length].options.map((opt) => {
                    const isPicked = selectedTaAnswer === opt;
                    const isRight = opt === taQuestions[qIndex % taQuestions.length].correct;
                    let btnStyle =
                      'bg-gv-surface-high hover:bg-gv-primary/15 border-gv-border hover:border-gv-primary text-gv-text';
                    if (selectedTaAnswer !== null) {
                      if (isRight) {
                        btnStyle = 'bg-gv-primary/25 border-gv-primary text-gv-accent';
                      } else if (isPicked) {
                        btnStyle = 'bg-gv-error/25 border-gv-error text-gv-error';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswerTimeAttack(opt)}
                        className={`p-3.5 rounded-xl border text-left font-mono text-xs md:text-sm font-bold transition-all cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <CeldiMascot mood="celebrating" size={88} />
                {isNewRecord && (
                  <span className="px-3 py-1 rounded-full bg-gv-warning/20 border border-gv-warning text-gv-warning font-mono text-xs font-black">
                    🏆 ¡NUEVO RÉCORD PERSONAL!
                  </span>
                )}
                <h4 className="text-xl font-black text-gv-text">¡Tiempo terminado!</h4>
                <p className="text-xs text-gv-muted">
                  Puntaje final: <strong className="text-gv-accent font-mono">{score} pts</strong> ·
                  Combo máx: <strong className="text-gv-streak font-mono">x{maxCombo}</strong>
                </p>
                <div className="flex items-center gap-3 w-full mt-3">
                  <button
                    type="button"
                    onClick={handleOpenTimeAttack}
                    className="flex-1 py-3 rounded-xl bg-gv-surface-high border border-gv-border hover:border-gv-primary text-gv-text font-black text-xs uppercase cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Jugar otra vez
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTimeAttackOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-gv-primary text-black font-black text-xs uppercase cursor-pointer"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Drill Modal */}
      {isShortcutsDrillOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-gv-surface border border-gv-border rounded-3xl p-6 shadow-2xl flex flex-col gap-5 animate-fade-in">
            <div className="flex items-center justify-between border-b border-gv-border pb-3">
              <div className="flex items-center gap-2 text-gv-accent font-black text-sm">
                <Keyboard className="w-5 h-5" />
                <span>ENTRENAMIENTO DE ATAJOS</span>
              </div>
              <button
                type="button"
                onClick={() => setIsShortcutsDrillOpen(false)}
                className="p-1 text-gv-muted hover:text-gv-text cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!shortcutDone ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-mono text-gv-muted">
                  <span>
                    Reto {shortcutIndex + 1} de {SHORTCUT_DRILL_QUESTIONS.length}
                  </span>
                  <span className="text-gv-accent font-bold">Aciertos: {shortcutScore}</span>
                </div>

                <div className="p-4 rounded-2xl bg-gv-surface-high border border-gv-border">
                  <p className="text-sm md:text-base font-bold text-gv-text leading-snug">
                    {SHORTCUT_DRILL_QUESTIONS[shortcutIndex].q}
                  </p>
                  <p className="text-[11px] font-mono text-gv-muted mt-2">
                    🍎 En Mac equivale a:{' '}
                    <span className="text-gv-accent">
                      {SHORTCUT_DRILL_QUESTIONS[shortcutIndex].mac}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {SHORTCUT_DRILL_QUESTIONS[shortcutIndex].opts.map((opt) => {
                    const isPicked = shortcutSelected === opt;
                    const isCorrect = opt === SHORTCUT_DRILL_QUESTIONS[shortcutIndex].ans;
                    let cls =
                      'bg-gv-surface-high hover:bg-gv-primary/15 border-gv-border text-gv-text';
                    if (shortcutSelected !== null) {
                      if (isCorrect) cls = 'bg-gv-primary/25 border-gv-primary text-gv-accent';
                      else if (isPicked) cls = 'bg-gv-error/25 border-gv-error text-gv-error';
                    }
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (shortcutSelected !== null) return;
                          setShortcutSelected(opt);
                          if (isCorrect) {
                            sound.play('correct');
                            setShortcutScore((s) => s + 1);
                          } else {
                            sound.play('wrong');
                          }
                          setTimeout(() => {
                            if (shortcutIndex + 1 < SHORTCUT_DRILL_QUESTIONS.length) {
                              setShortcutIndex((i) => i + 1);
                              setShortcutSelected(null);
                            } else {
                              sound.play('level_win');
                              setShortcutDone(true);
                              onReward(30, 15, 'SHORTCUTS');
                            }
                          }, 600);
                        }}
                        className={`p-3.5 rounded-xl border font-mono text-xs md:text-sm font-bold text-left transition-all cursor-pointer flex items-center justify-between ${cls}`}
                      >
                        <span>⌨️ {opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <CeldiMascot mood="celebrating" size={84} />
                <h4 className="text-xl font-black text-gv-text">¡Atajos Dominados!</h4>
                <p className="text-xs text-gv-muted">
                  Acertaste {shortcutScore} de {SHORTCUT_DRILL_QUESTIONS.length} combinaciones de
                  teclado (+30 XP y +15 Gemas).
                </p>
                <button
                  type="button"
                  onClick={() => setIsShortcutsDrillOpen(false)}
                  className="w-full py-3 rounded-xl bg-gv-primary text-black font-black text-xs uppercase cursor-pointer mt-2"
                >
                  Continuar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
