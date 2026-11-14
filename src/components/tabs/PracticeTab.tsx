import React, { useState, useEffect } from 'react';
import { Timer, Zap, ShieldAlert, Play, CheckCircle2, RotateCcw, Clock, Award, Sparkles, ChevronRight, Lock } from 'lucide-react';
import { SupportedLocale, UserStats } from '../../types';
import { sound } from '../../lib/audio';
import { CeldiMascot } from '../CeldiMascot';
import { PRACTICE_COURSES, PracticeCourseData, MissionData } from '../../data/coursesData';
import { MissionModal } from '../practice/MissionModal';

interface PracticeTabProps {
  stats: UserStats;
  locale: SupportedLocale;
  onReward: (xp: number, gems: number) => void;
}

export const PracticeTab: React.FC<PracticeTabProps> = ({ stats, locale, onReward }) => {
  const [activeMission, setActiveMission] = useState<MissionData | null>(null);
  const [completedMissions, setCompletedMissions] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('gridverse_completed_missions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Daily Challenge state
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [remainingTime, setRemainingTime] = useState({ hours: 7, minutes: 25 });

  // Time attack state
  const [isTimeAttackOpen, setIsTimeAttackOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [isTaFinished, setIsTaFinished] = useState(false);

  // Countdown timer for daily challenge
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setRemainingTime({ hours, minutes });
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Time Attack Timer
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (isTimeAttackOpen && timeLeft > 0 && !isTaFinished) {
      t = setTimeout(() => setTimeLeft((tl) => tl - 1), 1000);
    } else if (isTimeAttackOpen && timeLeft === 0 && !isTaFinished) {
      setIsTaFinished(true);
      sound.play('level_win');
      onReward(score * 10, Math.floor(score * 2));
    }
    return () => clearTimeout(t);
  }, [isTimeAttackOpen, timeLeft, isTaFinished, score, onReward]);

  const handleCompleteMission = (xp: number, gems: number) => {
    if (activeMission) {
      const updated = { ...completedMissions, [activeMission.ref]: true };
      setCompletedMissions(updated);
      localStorage.setItem('gridverse_completed_missions', JSON.stringify(updated));
      onReward(xp, gems);
      setActiveMission(null);
    }
  };

  const handleStartDaily = () => {
    sound.play('tap');
    // Open the bakery mission as today's daily challenge
    const dailyMission = PRACTICE_COURSES[0].missions[0];
    setActiveMission(dailyMission);
  };

  const quickQuestions = [
    {
      q: '¿Qué fórmula suma las celdas de A1 hasta A10?',
      opts: ['=SUM(A1:A10)', '=ADD(A1..A10)', '=COUNT(A1:A10)', '=TOTAL(A1:A10)'],
      ans: '=SUM(A1:A10)',
    },
    {
      q: '¿Qué error aparece al dividir un número entre cero?',
      opts: ['#DIV/0!', '#REF!', '#VALUE!', '#NAME?'],
      ans: '#DIV/0!',
    },
    {
      q: '¿Qué ventaja tiene BUSCARX / XLOOKUP sobre BUSCARV?',
      opts: [
        'Busca hacia la izquierda y derecha sin romperse',
        'Es más lenta',
        'Solo funciona con números',
        'Requiere ordenar la tabla',
      ],
      ans: 'Busca hacia la izquierda y derecha sin romperse',
    },
    {
      q: '¿Cómo anclas la celda A1 para que no cambie al arrastrar?',
      opts: ['$A$1', '#A#1', '@A@1', '&A&1'],
      ans: '$A$1',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-6 px-4">
      {/* 1. Daily Challenge Banner (matching mobile app _DailyChallengeCard) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gv-surface-high via-gv-surface to-gv-surface-high border border-gv-border p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gv-streak/15 text-gv-streak border border-gv-streak/30 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Desafío Diario</span>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-gv-text">
              {locale === 'es' ? 'Reto de Cálculo Diario' : 'Daily Spreadsheet Challenge'}
            </h2>
            <p className="text-xs md:text-sm text-gv-muted mt-1 max-w-md">
              {locale === 'es'
                ? 'Resuelve la misión diaria para ganar 50 gemas y mantener activa tu racha de aprendizaje.'
                : 'Solve today\'s real business mission to claim 50 gems and protect your streak.'}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-xs font-bold">
              <span className="text-gv-bytes flex items-center gap-1">
                💎 +50 Gemas
              </span>
              <span className="text-gv-muted flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                Quedan {remainingTime.hours}h {remainingTime.minutes}m
              </span>
            </div>

            <div className="mt-5">
              <button
                onClick={handleStartDaily}
                className="px-6 py-2.5 rounded-xl bg-gv-primary hover:bg-gv-accent text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-gv-primary/20 flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>{locale === 'es' ? 'Comenzar Desafío' : 'Start Challenge'}</span>
              </button>
            </div>
          </div>

          <div className="shrink-0">
            <CeldiMascot mood={dailyCompleted ? 'celebrating' : 'thinking'} size={110} />
          </div>
        </div>
      </div>

      {/* 2. Structured Practice Courses (matching mobile defaultCourses) */}
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-lg md:text-xl font-black text-gv-text">
            {locale === 'es' ? 'Cursos Prácticos de Excel y Negocios' : 'Practical Business Excel Courses'}
          </h2>
          <p className="text-xs text-gv-muted mt-0.5">
            {locale === 'es'
              ? 'Casos de negocio reales organizados por dificultad con clientes ficticios.'
              : 'Real-world business cases structured by difficulty with hands-on spreadsheet tasks.'}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {PRACTICE_COURSES.map((course) => (
            <div
              key={course.id}
              className="bg-gv-surface border border-gv-border rounded-2xl p-5 md:p-6 shadow-lg flex flex-col gap-4"
            >
              {/* Course Title */}
              <div className="flex items-center justify-between border-b border-gv-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{course.emoji}</span>
                  <div>
                    <h3 className="text-base font-bold text-gv-text">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gv-muted">{course.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Course Missions List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {course.missions.map((mission) => {
                  const isDone = Boolean(completedMissions[mission.ref]);
                  return (
                    <div
                      key={mission.ref}
                      onClick={() => {
                        sound.play('tap');
                        setActiveMission(mission);
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isDone
                          ? 'bg-gv-surface-high/60 border-gv-primary/40 hover:border-gv-primary'
                          : 'bg-gv-surface-high border-gv-border hover:border-gv-accent hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0 mt-0.5">{mission.emoji}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase text-gv-muted">
                              {mission.client}
                            </span>
                            {isDone && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gv-primary-soft text-gv-accent">
                                Completada
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs md:text-sm font-bold text-gv-text mt-0.5">
                            {mission.title}
                          </h4>
                          <p className="text-[11px] text-gv-muted mt-1 line-clamp-2">
                            {mission.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-gv-accent border border-gv-primary/20">
                              {mission.skills}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 pt-1">
                        {isDone ? (
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
          ))}
        </div>
      </div>

      {/* 3. Quick Practice Modes (Time Attack & Boss Battle) */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-black text-gv-text">
          {locale === 'es' ? 'Gimnasio Rápido' : 'Quick Training Arena'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Time Attack Card */}
          <div
            onClick={() => {
              sound.play('tap');
              setIsTimeAttackOpen(true);
              setTimeLeft(30);
              setScore(0);
              setQIndex(0);
              setIsTaFinished(false);
            }}
            className="p-5 rounded-2xl bg-gv-surface border border-gv-border hover:border-gv-streak/60 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-md group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gv-streak/15 border border-gv-streak/30 flex items-center justify-center text-gv-streak group-hover:scale-105 transition-transform">
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-gv-text">
                  Contrarreloj (Time Attack)
                </h3>
                <p className="text-xs text-gv-muted mt-0.5">
                  30 segundos para resolver fórmulas
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-gv-streak/10 text-gv-streak border border-gv-streak/30 shrink-0">
              30s
            </span>
          </div>

          {/* Boss Battle Card */}
          <div className="p-5 rounded-2xl bg-gv-surface border border-gv-border flex items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gv-boss/15 border border-gv-boss/30 flex items-center justify-center text-gv-boss">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-bold text-gv-text">
                  Boss Battles de Errores
                </h3>
                <p className="text-xs text-gv-muted mt-0.5">
                  Combate contra #REF!, #DIV/0! y #N/A
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-gv-boss/10 text-gv-boss border border-gv-boss/30 shrink-0">
              En el Mapa
            </span>
          </div>
        </div>
      </div>

      {/* Mission Modal */}
      {activeMission && (
        <MissionModal
          mission={activeMission}
          locale={locale}
          onClose={() => setActiveMission(null)}
          onSuccess={handleCompleteMission}
        />
      )}

      {/* Time Attack Modal */}
      {isTimeAttackOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-gv-surface border border-gv-border rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
            {!isTaFinished ? (
              <>
                <div className="flex items-center justify-between border-b border-gv-border pb-3">
                  <div className="flex items-center gap-2 font-mono font-bold text-sm text-gv-streak">
                    <Timer className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                    <span>{timeLeft}s</span>
                  </div>
                  <div className="text-xs font-bold text-gv-accent">
                    Aciertos: {score}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-gv-text mb-4">
                    {quickQuestions[qIndex % quickQuestions.length].q}
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {quickQuestions[qIndex % quickQuestions.length].opts.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (opt === quickQuestions[qIndex % quickQuestions.length].ans) {
                            sound.play('correct');
                            setScore((s) => s + 1);
                          } else {
                            sound.play('wrong');
                          }
                          setQIndex((idx) => idx + 1);
                        }}
                        className="p-3 rounded-xl border border-gv-border bg-gv-surface-high hover:border-gv-primary hover:bg-gv-surface-higher font-mono text-xs md:text-sm text-gv-text font-semibold text-left transition-colors cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center flex flex-col items-center gap-4 py-3">
                <CeldiMascot mood="celebrating" size={80} />
                <h2 className="text-xl font-black text-gv-text">¡Tiempo Finalizado!</h2>
                <p className="text-sm text-gv-muted">
                  Lograste <strong className="text-gv-accent">{score} respuestas correctas</strong>.
                </p>
                <button
                  onClick={() => setIsTimeAttackOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gv-primary text-black font-bold text-xs uppercase cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
