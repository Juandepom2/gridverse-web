import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import { SupportedLocale, UserStats } from '../../types';

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
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('gridverse_checklist_dismissed') === 'true';
  });

  if (dismissed) return null;

  const steps = [
    {
      id: 'first_lesson',
      title:
        locale === 'es'
          ? 'Completa tu primera lección (A1)'
          : 'Complete your first lesson (A1)',
      done: Boolean(stats.completedLevels['A1']),
      onAction: () => {},
    },
    {
      id: 'formulas',
      title:
        locale === 'es'
          ? 'Consulta el Diccionario de Fórmulas'
          : 'Check the Formula Dictionary',
      done: true,
      onAction: () => onNavigateTab('formulas'),
    },
    {
      id: 'practice',
      title:
        locale === 'es'
          ? 'Supera un Desafío de Práctica'
          : 'Beat a Practice Challenge',
      done: stats.xp > 20,
      onAction: () => onNavigateTab('practice'),
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const progressRatio = completedCount / steps.length;

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('gridverse_checklist_dismissed', 'true');
  };

  return (
    <div className="w-full max-w-lg mx-auto mb-6 bg-gv-surface border border-gv-border rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gv-primary-soft border border-gv-primary/30 flex items-center justify-center text-gv-accent shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-extrabold text-gv-text">
              {locale === 'es'
                ? 'Tus Primeros Pasos en Gridverse'
                : 'Your First Steps in Gridverse'}
            </h3>
            <p className="text-[11px] text-gv-muted">
              {completedCount} de {steps.length} completadas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg text-gv-muted hover:text-gv-text hover:bg-gv-surface-high transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-gv-muted hover:text-gv-text hover:bg-gv-surface-high transition-colors"
            title="Ocultar lista"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3.5 flex flex-col gap-2.5">
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-gv-surface-high rounded-full overflow-hidden border border-gv-border">
            <div
              className="h-full bg-gv-primary rounded-full transition-all duration-300"
              style={{ width: `${progressRatio * 100}%` }}
            />
          </div>

          {/* Steps List */}
          <div className="flex flex-col gap-1.5 pt-1">
            {steps.map((step) => (
              <div
                key={step.id}
                onClick={step.onAction}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-gv-surface-high/60 cursor-pointer transition-colors"
              >
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-gv-primary shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gv-muted shrink-0" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    step.done ? 'line-through text-gv-muted' : 'text-gv-text'
                  }`}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
