import React, { useState, useEffect } from 'react';
import { Timer, Zap, ShieldAlert, Play, CheckCircle2, RotateCcw } from 'lucide-react';
import { SupportedLocale, UserStats } from '../../types';
import { sound } from '../../lib/audio';
import { CeldiMascot } from '../CeldiMascot';

interface PracticeTabProps {
  stats: UserStats;
  locale: SupportedLocale;
  onReward: (xp: number, gems: number) => void;
}

interface QuickChallenge {
  question: Record<SupportedLocale, string>;
  options: string[];
  correct: string;
}

const CHALLENGES: QuickChallenge[] = [
  {
    question: {
      es: '¿Qué fórmula suma las celdas de A1 hasta A10?',
      en: 'Which formula sums cells from A1 through A10?',
      de: 'Welche Formel summiert die Zellen von A1 bis A10?',
      fr: 'Quelle formule additionne les cellules de A1 à A10 ?',
      ja: 'A1からA10までのセルを合計する関数はどれ？',
      pt: 'Qual fórmula soma as células de A1 até A10?',
    },
    options: ['=SUM(A1:A10)', '=ADD(A1..A10)', '=COUNT(A1:A10)', '=TOTAL(A1:A10)'],
    correct: '=SUM(A1:A10)',
  },
  {
    question: {
      es: '¿Qué error aparece al dividir un número entre una celda vacía o 0?',
      en: 'What error appears when dividing by zero or an empty cell?',
      de: 'Welcher Fehler tritt auf, wenn durch Null geteilt wird?',
      fr: 'Quelle erreur apparaît lors d\'une division par zéro ?',
      ja: '数値をゼロや空のセルで割った時に出るエラーは？',
      pt: 'Qual erro aparece ao dividir um número por zero?',
    },
    options: ['#DIV/0!', '#REF!', '#VALUE!', '#NAME?'],
    correct: '#DIV/0!',
  },
  {
    question: {
      es: '¿Qué ventaja tiene BUSCARX / XLOOKUP sobre BUSCARV?',
      en: 'What key advantage does XLOOKUP have over VLOOKUP?',
      de: 'Welchen Vorteil hat XVERWEIS gegenüber SVERWEIS?',
      fr: 'Quel est l\'avantage clé de RECHERCHEX sur RECHERCHEV ?',
      ja: 'XLOOKUPがVLOOKUPより優れている最大の利点は？',
      pt: 'Qual a principal vantagem do PROCX sobre o PROCV?',
    },
    options: [
      'Busca hacia la izquierda y derecha sin romperse',
      'Es más lenta',
      'Solo funciona con números',
      'Requiere ordenar la tabla',
    ],
    correct: 'Busca hacia la izquierda y derecha sin romperse',
  },
];

export const PracticeTab: React.FC<PracticeTabProps> = ({ locale, onReward }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setIsFinished(true);
      sound.play('level_win');
      onReward(score * 10, Math.floor(score * 2));
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft, score, onReward]);

  const handleStart = () => {
    sound.play('tap');
    setIsPlaying(true);
    setTimeLeft(30);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
  };

  const handleAnswer = (option: string) => {
    const q = CHALLENGES[currentIndex];
    if (option === q.correct) {
      sound.play('correct');
      setScore((s) => s + 1);
    } else {
      sound.play('wrong');
    }

    if (currentIndex + 1 < CHALLENGES.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Loop or finish
      setCurrentIndex(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 py-6 px-4">
      <div className="border-b border-gv-border pb-4">
        <h1 className="text-xl md:text-2xl font-black text-gv-text">
          {locale === 'es' ? 'Gimnasio de Práctica y Desafíos' : 'Practice Arena'}
        </h1>
        <p className="text-xs text-gv-muted mt-1">
          {locale === 'es'
            ? 'Entrena velocidad de respuesta, memorización de atajos y resolución de errores bajo presión.'
            : 'Train reaction speed, memorize formula syntax, and battle spreadsheet errors.'}
        </p>
      </div>

      {/* Main Challenge Card */}
      <div className="bg-gradient-to-br from-gv-surface-high to-gv-surface border border-gv-border rounded-2xl p-6 shadow-xl flex flex-col gap-5">
        {!isPlaying && !isFinished ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <CeldiMascot mood="onFire" size={80} speechText="¿Listo para la prueba de velocidad? 🔥" />
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gv-streak">
                Desafío Contrarreloj (Time Attack)
              </span>
              <h2 className="text-lg md:text-xl font-bold text-gv-text mt-1">
                {locale === 'es' ? '30 Segundos de Fórmulas Rápidas' : '30-Second Formula Blitz'}
              </h2>
              <p className="text-xs text-gv-muted mt-1">
                {locale === 'es'
                  ? 'Responde tantas preguntas como puedas antes de que el reloj llegue a cero.'
                  : 'Answer as many rapid formula challenges as you can before time expires.'}
              </p>
            </div>
            <button
              onClick={handleStart}
              className="px-6 py-3 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-gv-primary/20 shrink-0"
            >
              <Play className="w-4 h-4 fill-black" />
              {locale === 'es' ? 'Comenzar' : 'Start'}
            </button>
          </div>
        ) : isPlaying ? (
          /* Active Playing screen */
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono font-bold text-sm text-gv-streak">
                <Timer className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                <span>{timeLeft}s restantes</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-gv-surface-higher border border-gv-border text-xs font-bold text-gv-accent">
                Aciertos: {score}
              </div>
            </div>

            <div className="bg-gv-surface border border-gv-border rounded-xl p-5">
              <h3 className="text-base font-bold text-gv-text mb-4">
                {CHALLENGES[currentIndex].question[locale]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CHALLENGES[currentIndex].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="p-3 rounded-xl border border-gv-border bg-gv-surface-high hover:border-gv-primary hover:bg-gv-surface-higher font-mono text-xs md:text-sm text-gv-text font-semibold text-left transition-colors cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Results screen */
          <div className="text-center flex flex-col items-center gap-4 py-4">
            <CeldiMascot mood="celebrating" size={80} />
            <h2 className="text-xl font-black text-gv-text">
              {locale === 'es' ? '¡Tiempo Finalizado!' : 'Time Up!'}
            </h2>
            <p className="text-sm text-gv-muted">
              Lograste <strong className="text-gv-accent">{score} respuestas correctas</strong>.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-gv-accent">
              <span>+{score * 10} XP</span>
              <span>•</span>
              <span>+{Math.floor(score * 2)} Gemas 💎</span>
            </div>
            <button
              onClick={handleStart}
              className="mt-2 px-5 py-2.5 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              {locale === 'es' ? 'Intentar de Nuevo' : 'Play Again'}
            </button>
          </div>
        )}
      </div>

      {/* Error Boss Battle section */}
      <div className="bg-gv-surface border border-gv-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gv-boss-soft border border-gv-boss/40 flex items-center justify-center text-gv-boss shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gv-text">
              {locale === 'es' ? 'Boss Battle: Combate contra Errores' : 'Error Boss Battle'}
            </h3>
            <p className="text-xs text-gv-muted">
              {locale === 'es'
                ? 'Enfrenta a los errores más temidos de Excel: #REF!, #DIV/0!, #VALUE! y #N/A.'
                : 'Defeat classic spreadsheet error monsters before they corrupt your executive reports.'}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded bg-gv-surface-high border border-gv-border text-gv-boss shrink-0">
          Disponible en el Mapa
        </span>
      </div>
    </div>
  );
};
