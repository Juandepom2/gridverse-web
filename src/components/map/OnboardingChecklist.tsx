import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ListChecks, X, ChevronRight } from 'lucide-react';
import { SupportedLocale, UserStats } from '../../types';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface OnboardingChecklistProps {
  stats: UserStats;
  locale: SupportedLocale;
  onNavigateTab: (tab: string) => void;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
  stats,
  locale,
  onNavigateTab,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => Boolean(auth.currentUser));
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('gridverse_checklist_dismissed') === 'true';
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setIsLoggedIn(Boolean(u));
    });
    return () => unsub();
  }, []);

  const completedLevelsCount = Object.keys(stats.completedLevels).length;

  const steps = [
    {
      id: 'calibrate',
      title:
        locale === 'es'
          ? 'Calibrar tu ruta personalizada'
          : 'Calibrate your custom learning path',
      done: true,
      onAction: undefined,
    },
    {
      id: 'first_lesson',
      title:
        locale === 'es'
          ? 'Completar tu primera celda en el mapa'
          : 'Complete your first cell on the map',
      done: completedLevelsCount > 0,
      onAction: undefined,
    },
    {
      id: 'streak',
      title:
        locale === 'es'
          ? 'Encender tu 1.er día de racha 🔥'
          : 'Ignite your 1st day streak 🔥',
      done: stats.streak > 0 && completedLevelsCount > 0,
      onAction: undefined,
    },
    {
      id: 'account',
      title:
        locale === 'es'
          ? 'Guardar tu progreso con una cuenta gratis'
          : 'Save your progress with a free account',
      done: isLoggedIn,
      onAction: !isLoggedIn ? () => onNavigateTab('profile') : undefined,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allCompleted = completedCount >= steps.length || completedLevelsCount >= 3;

  useEffect(() => {
    if (allCompleted && !dismissed) {
      localStorage.setItem('gridverse_checklist_dismissed', 'true');
    }
  }, [allCompleted, dismissed]);

  // Hide immediately when dismissed or once completed
  if (dismissed || allCompleted) return null;

  const progressRatio = completedCount / steps.length;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('gridverse_checklist_dismissed', 'true');
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-6 bg-gv-surface-high border-[1.5px] border-gv-primary/45 rounded-2xl p-3.5 shadow-xl">
      <div className="flex items-center justify-between gap-2">
        <div
          className="flex items-center gap-2.5 flex-1 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Checklist icon + Counter pill (no star icon, matching Flutter app) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gv-primary text-black font-mono font-extrabold text-xs shrink-0">
            <ListChecks className="w-4 h-4 stroke-[2.5]" />
            <span>
              {completedCount}/{steps.length}
            </span>
          </div>
          <div>
            <h3 className="text-[13.5px] font-extrabold text-gv-text leading-tight">
              {locale === 'es'
                ? 'Tus Primeros Pasos en Gridverse'
                : 'Your First Steps in Gridverse'}
            </h3>
            <p className="text-[11.5px] text-gv-muted">
              {locale === 'es'
                ? 'Completa tus misiones de inicio'
                : 'Complete your starter missions'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg text-gv-muted hover:text-gv-text hover:bg-gv-surface transition-colors cursor-pointer"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-gv-muted hover:text-gv-text hover:bg-gv-surface transition-colors cursor-pointer"
            title={locale === 'es' ? 'Ocultar lista' : 'Hide checklist'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 flex flex-col gap-2">
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gv-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gv-primary rounded-full transition-all duration-300"
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>

          {/* Steps List */}
          <div className="flex flex-col gap-1 pt-1">
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={step.onAction}
                className={`flex items-center gap-2.5 py-1.5 px-1.5 rounded-lg transition-colors ${
                  step.onAction
                    ? 'hover:bg-gv-surface cursor-pointer'
                    : 'cursor-default'
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="w-[18px] h-[18px] text-gv-primary shrink-0" />
                ) : (
                  <Circle className="w-[18px] h-[18px] text-gv-muted shrink-0" />
                )}
                <span
                  className={`text-[12.5px] flex-1 ${
                    step.done
                      ? 'line-through text-gv-muted font-semibold'
                      : 'text-gv-text font-bold'
                  }`}
                >
                  {step.title}
                </span>
                {step.onAction && (
                  <ChevronRight className="w-4 h-4 text-gv-primary shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
